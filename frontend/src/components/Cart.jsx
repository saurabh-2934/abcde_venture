import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Loader from "./Loader";
import { Link } from "react-router-dom";

function Cart() {
  const [loading, setLoading] = useState(true);
  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        //get the token from localStorage
        const token = localStorage.getItem("token");
        const api_url = process.env.REACT_APP_API_URL;
        const url = `${api_url}/carts`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartItems = res.data.allProducts.map((eachItem) => ({
          id: eachItem._id,
          name: eachItem.name,
        }));

        setCartList(cartItems);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const onClickCheckout = async () => {
    try {
      setLoading(true);
      const api_url = process.env.REACT_APP_API_URL;
      const url = `${api_url}/orders`;

      const token = localStorage.getItem("token");
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        window.alert(res.data.message);
        setCartList([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {loading && <Loader />}

      {!loading && cartList.length === 0 && (
        <div className="text-center">
          <h1 className="p-6 text-5xl text-center text-gray-500">
            Your cart is empty 🛒
          </h1>
          <Link to="/">
            <button className="rounded bg-blue-600 px-4 py-2 text-white text-center hover:bg-blue-700">
              add product to cart
            </button>
          </Link>
        </div>
      )}

      {!loading && cartList.length > 0 && (
        <div className="p-6">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left font-semibold">
                  Product Name
                </th>
              </tr>
            </thead>
            <tbody>
              {cartList.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={onClickCheckout}
            className="mt-5 rounded bg-green-600 px-4 py-1 text-white hover:bg-green-700">
            Checkout
          </button>
        </div>
      )}
    </>
  );
}

export default Cart;
