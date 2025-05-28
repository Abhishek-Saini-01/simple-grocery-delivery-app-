import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // check if seller is login
  const checkSellerLogin = async () => {
    try {
      const response = await axios.get("/api/seller/is-auth");
      if (response.data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      console.log(error);
      setIsSeller(false);
    }
  };

  //fetch user status , user cart data
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/user/is-auth");
      if (response.data.success) {
        setUser(response.data.user);
        setCartItems(response.data.user.cartItems);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      setUser(null);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Add Products to Cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  //Remove Products from Cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Removed from cart");
  };

  //get cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (let item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (let items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    checkSellerLogin();
    fetchProducts();
    fetchUser();
  }, []);

  //update cart items in db
  useEffect(() => {
    const updateCart = async () => {
      try {
        const response = await axios.post("/api/cart/update", {
          cartItems,
        });
        if (!response.data.success) {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user) {
      updateCart();
      getCartAmount()
    }
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    updateCartItem,
    addToCart,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
