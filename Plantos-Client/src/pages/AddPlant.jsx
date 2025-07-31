import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userAtom } from "../Recoil/UserAtom";
import { useNavigate } from "react-router-dom";

export default function AddPlant() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] = useState("");
  const [disease, setDisease] = useState("");
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user){
      navigate('/');
    }
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photoFiles.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }

    if (!location) {
      alert("Please enter a location.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      photoFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await axios.post(
        "https://plantos-backend.onrender.com/api/plant/predict-plant",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      if (data.prediction) {
        setSpecies(data.prediction.species);
        setDisease(data.prediction.disease);
      } else {
        alert("Prediction failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while predicting the plant.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      setPhotoFiles(filesArray);
    }
  };

  return (
    <div className="pt-24 min-h-screen flex justify-center items-center bg-yellow-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-yellow-200 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-yellow-900 text-center mb-6 font-serif">
          🌿 Add a New Plant
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader className="w-10 h-10 animate-spin text-yellow-500" />
            <p className="text-yellow-800 font-semibold">
              Analyzing your plant... 🌿
            </p>
          </div>
        ) : species && disease ? (
          <div className="text-center space-y-4">
            <h2 className="text-yellow-800 text-xl font-bold">
              Prediction Result
            </h2>
            <p className="text-yellow-700">
              🌿 <strong>Species:</strong> {species}
            </p>
            <p className="text-yellow-700">
              🩺 <strong>Disease:</strong> {disease}
            </p>
            <p className="text-yellow-600 font-medium">
              Plant added to garden successfully!
            </p>
            <button
              onClick={() => {
                setName("");
                setLocation("");
                setPhotoFiles([]);
                setSpecies("");
                setDisease("");
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded font-semibold shadow"
            >
              Add Another Plant
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-yellow-800 mb-1 font-medium">
                Plant Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded border border-yellow-300 bg-yellow-50 text-yellow-900 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. Aloe Vera"
              />
            </div>

            <div>
              <label className="block text-yellow-800 mb-1 font-medium">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-3 rounded border border-yellow-300 bg-yellow-50 text-yellow-900 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. Deoghar"
              />
            </div>

            <div>
              <label className="block text-yellow-800 mb-1 font-medium">
                Upload Photos (max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required
                className="w-full p-2 rounded border border-yellow-300 bg-yellow-50 text-yellow-800"
              />
            </div>

            {photoFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-yellow-600 text-sm">Previews:</p>
                {photoFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full rounded shadow"
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded font-semibold shadow"
            >
              Add Plant
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
