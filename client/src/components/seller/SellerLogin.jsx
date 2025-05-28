import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";


const SellerLogin = () => {
  const { isSeller, axios, setIsSeller, navigate } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/seller/login", {
        email,
        password
      });
      if (response.data.success) {
        setIsSeller(true);
        toast.success("Seller Login successful");
        navigate("/seller");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Seller Login failed");
    }
  };

  return (
    !isSeller && (
      <form
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center text-sm text-gray-600"
      >
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">Seller</span> Login
          </p>

          <div className="w-full ">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="example@gmail.com"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="email"
              required
            />
          </div>
          <div className="w-full ">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="********"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              required
            />
          </div>

          <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
            Login
          </button>
        </div>
      </form>
    )
  );
};

export default SellerLogin;
