import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputField = ({ type, placeholder, name, handleChange, address }) => {
  return (
    <input
      className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      value={address[name]}
      required
    />
  );
};

const AddAddress = () => {
  const { user, axios, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  //   console.log({ address });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/address/add", { address });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/cart");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [])

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              placeholder="Email Address"
              type="email"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              placeholder="Street"
              type="text"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                placeholder="City"
                type="text"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                placeholder="State"
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="pincode"
                placeholder="Pin code"
                type="number"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                placeholder="Country"
                type="text"
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              placeholder="Phone"
              type="text"
            />

            <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
              Save Address
            </button>
          </form>
        </div>
        <img
          src={assets.add_address_iamge}
          alt="address-image"
          className="md:mr-16 mb-16 md:mt-0"
        />
      </div>
    </div>
  );
};

export default AddAddress;
