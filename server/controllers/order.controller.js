import { Order } from "../models/order.modal.js";
import { Product } from "../models/product.modal.js";
import { Address } from "../models/address.modal.js";
import { User } from "../models/user.modal.js";
import stripe from "stripe";

// place order COD 
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        if (!items || !address) {
            return res.json({
                success: false,
                message: "All fields are required",
            })
        }

        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return acc + product.offerPrice * item.quantity;
        }, 0);

        //add tax charge 2%
        amount = amount + Math.floor(amount * 0.02);

        await Order.create({
            userId: req.user.id,
            items,
            amount,
            address,
            paymentType: "COD"
        });
        return res.json({
            success: true,
            message: "Order placed successfully",
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

// place order Stripe 
export const placeOrderStripe = async (req, res) => {
    try {
        const { items, address } = req.body;
        const { origin } = req.headers;

        if (!items || !address) {
            return res.json({
                success: false,
                message: "All fields are required",
            })
        }

        let productData = [];

        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            return acc + product.offerPrice * item.quantity;
        }, 0);

        //add tax charge 2%
        amount = amount + Math.floor(amount * 0.02);

        const order = await Order.create({
            userId: req.user.id,
            items,
            amount,
            address,
            paymentType: "Online"
        });

        const addressData = await Address.findById(address);
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const line_items = productData.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
            },
            quantity: item.quantity,
        }));

        const customer = await stripeInstance.customers.create({
            name: req.user.name, // Make sure to collect this from frontend
            address: {
                line1: addressData.street,
                city: addressData.city,
                state: addressData.state,
                postal_code: addressData.pincode,
                country: addressData.country, // e.g., 'IN'
            },
        });

        const session = await stripeInstance.checkout.sessions.create({
            customer: customer.id,
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId: req.user.id,
            },
        });

        return res.json({
            success: true,
            url: session.url
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//stripe webhook to verify payments actions: /stripe
export const stripeWebhook = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"]
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`)
    }

    // handle event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            const sessoin = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });

            const { orderId, userId } = sessoin.data[0].metadata;
            // mark payment is paid in orders
            await Order.findByIdAndUpdate(orderId, {
                isPaid: true,
            })
            //clear cart of user
            await User.findByIdAndUpdate(userId, {
                cartItems: {},
            })
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            const sessoin = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });

            const { orderId } = sessoin.data[0].metadata;
            // mark payment is paid in orders
            await Order.findByIdAndDelete(orderId);
            break;
        }

        default:
            console.error(`Unknown event type ${event.type}`);
            break;
    }

    res.json({ received: true });
}

// get order by userId
export const getOrderById = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.id,
            $or: [
                { isPaid: true },
                { paymentType: "COD" }
            ]
        }).populate("items.product address").sort({ createdAt: -1 });
        return res.json({
            success: true,
            orders,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}


// get all orders for seller 
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { isPaid: true },
                { paymentType: "COD" }
            ]
        }).populate("items.product address").sort({ createdAt: -1 });
        return res.json({
            success: true,
            orders,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}
