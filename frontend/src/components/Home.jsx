import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Loader from "./Loader";
function Home() {
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        //get the token from localStorage

        const token = localStorage.getItem("token");

        const api_url = process.env.REACT_APP_API_URL;
        const url = `${api_url}/items`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const products = res.data.items.map((eachProduct) => ({
          id: eachProduct._id,
          name: eachProduct.name,
          status: eachProduct.status,
        }));

        setItemList(products);
      } catch (error) {
        console.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const onAddCart = async (e) => {
    try {
      const token = localStorage.getItem("token");
      const id = e.target.value;
      const api_url = process.env.REACT_APP_API_URL;
      const url = `${api_url}/carts/${id}`;
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
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left font-semibold">
                  Product Name
                </th>
                <th className="border px-4 py-2 text-center font-semibold">
                  Availability
                </th>
                <th className="border px-4 py-2 text-center font-semibold">
                  Add to Cart
                </th>
              </tr>
            </thead>
            <tbody>
              {itemList.map((eachData) => {
                return (
                  <tr key={eachData.id}>
                    <td className="border px-4 py-2">{eachData.name}</td>
                    <td
                      className={`border px-4 py-2 text-center ${eachData.status === "available" ? "text-green-600" : "text-gray-500"} font-medium`}>
                      {eachData.status}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        value={eachData.id}
                        onClick={onAddCart}
                        disabled={eachData.status === "unavailable"}
                        className={`rounded ${eachData.status === "available" ? "bg-blue-600" : "bg-gray-400"} px-4 py-1 text-white hover:${eachData.status === "available" ? "bg-blue-700" : "bg-gray-400"}`}>
                        Add
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Home;
