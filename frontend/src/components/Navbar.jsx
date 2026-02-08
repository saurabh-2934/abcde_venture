import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const onClickLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const api_url = process.env.REACT_APP_API_URL;
      const url = `${api_url}/users/logout`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      console.log("Logout API failed, logging out anyway");
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="w-full flex items-center justify-end bg-sky-100 px-5 py-3">
      <ul className="w-half flex items-center">
        <li className="text-gray mr-5 cursor-pointer">
          <Link to="/">Products</Link>
        </li>
        <li className="text-gray mr-5 cursor-pointer">
          <Link to="/cart">Cart</Link>
        </li>
        <li className="text-gray mr-5 cursor-pointer">
          <Link to="/orders">Your Orders</Link>
        </li>
        <li className="cursor-pointer">
          <button
            onClick={onClickLogout}
            className="px-5 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white
                     hover:bg-blue-700 active:scale-[0.98] transition-all duration-200">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
