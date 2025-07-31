import { useEffect, useState } from "react";
import { Sun, Info } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../Recoil/UserAtom";

export default function Garden() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const user = useRecoilValue(userAtom);
  useEffect(()=>{
    if(!user){
      navigate('/');
    }
  },[])
  useEffect(() => {
    async function fetch_garden() {
      try {
        const response = await axios.post(
          "https://plantos-backend.onrender.com/api/plant/get-garden",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPlants(response.data.rows);
      } catch (err) {
        console.error("Error fetching garden:", err);
      }
    }

    fetch_garden();
  }, []);

  return (
    <div className="pt-24 min-h-screen w-full bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-yellow-900 font-serif mb-10 text-center">
          🌿 Your Garden
        </h1>

        {plants.length === 0 ? (
          <p className="text-center text-yellow-700 text-lg">No plants in your garden yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="bg-white rounded-xl shadow-lg border border-yellow-200 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src={plant.url}
                  alt={plant.name}
                  className="w-full h-56 object-cover rounded-t-xl"
                />
                <div className="p-5 space-y-2">
                  <h2 className="text-xl font-bold text-yellow-800 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-600" />
                    {plant.name}
                  </h2>
                  <p className="italic text-yellow-700 text-sm">
                    {plant.species}
                  </p>
                  <p className="text-yellow-600 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Status: {plant.status}
                  </p>
                  <button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg shadow transition mt-3 font-semibold"
                    onClick={() => navigate(`/plant?id=${plant.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
