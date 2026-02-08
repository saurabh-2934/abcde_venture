import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Loader from "./Loader";
import { Link } from "react-router-dom";

function Order() {
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        //get the token from localStorage
        const token = localStorage.getItem("token");
        const api_url = process.env.REACT_APP_API_URL;
        const url = `${api_url}/order-history`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orders = res.data.orderDetails.map((eachItem) => ({
          orderId: eachItem.order_id,
          orderDate: eachItem.order_date,
        }));

        setOrderList(orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  return (
    <>
      <Navbar />

      {loading && <Loader />}

      {!loading && orderList.length === 0 && (
        <div className="text-center">
          <h1 className="p-6 text-5xl text-center text-gray-500">
            You have not done any checkout till now
          </h1>
          <Link to="/cart">
            <button className="rounded bg-blue-600 px-4 py-2 text-white text-center hover:bg-blue-700">
              checkout now
            </button>
          </Link>
        </div>
      )}

      {!loading && orderList.length > 0 && (
        <div className="p-6">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left font-semibold">
                  Order Id
                </th>
                <th className="border px-4 py-2 text-left font-semibold">
                  Order Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((item) => (
                <tr key={item.orderId}>
                  <td className="border px-4 py-2">{item.orderId}</td>
                  <td className="border px-4 py-2">{item.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Order;
