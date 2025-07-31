import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { userAtom } from "../Recoil/UserAtom";
import { useRecoilValue } from "recoil";

const PlantPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plantId = searchParams.get('id');

  const [plantSpecs, setPlantSpecs] = useState({
    name: '',
    species: '',
    location: '',
    status: '',
  });

  const [tasks, setTasks] = useState([]);
  const [media, setMedia] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, []);

  const fetchPlantData = async () => {
    try {
      const response = await axios.post('https://plantos-backend.onrender.com/api/plant/get-plant', { id: plantId });
      setPlantSpecs(response.data.plant_specs[0]);
      setTasks(response.data.tasks);
      setMedia(response.data.media);
    } catch (error) {
      console.error("Error fetching plant data:", error);
    }
  };

  useEffect(() => {
    if (plantId) {
      fetchPlantData();
    }
  }, [plantId]);

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("plant_id", plantId);
    formData.append("photos", image);
    formData.append("location", plantSpecs.location);

    try {
      await axios.post("https://plantos-backend.onrender.com/api/plant/predict-status", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setImage(null);
      await fetchPlantData();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-100 pt-24">
      {/* Left Panel */}
      <div className="lg:w-1/3 w-full p-4 sm:p-8 bg-green-50 border-b lg:border-b-0 lg:border-r border-green-300 shadow-inner">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-green-900 mb-4">{plantSpecs.name}</h2>
          <p className="text-xl text-green-700 italic mb-1">{plantSpecs.species}</p>
          <p className="text-md text-green-600 mb-2">
            📍 <span className="font-medium">Located in:</span> {plantSpecs.location}
          </p>
          <p className="text-md text-green-700 mb-6">
            🌡️ <span className="font-medium">Status:</span> {plantSpecs.status}
          </p>

          <h3 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4 border-b-2 border-green-300 pb-2">
            🌿 Today’s Care Schedule
          </h3>

          {tasks.length === 0 ? (
            <div className="text-center mt-6 space-y-4">
              <p className="text-green-700 text-lg">Upload Pending</p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-sm text-green-700 bg-green-100 rounded p-2"
              />

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow transition-all duration-200"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin w-4 h-4" />
                    Uploading...
                  </span>
                ) : (
                  <>📷 Add Plant Image</>
                )}
              </button>
            </div>
          ) : (
            <ul className="list-disc list-inside text-lg sm:text-xl text-green-900 space-y-3 mt-4">
              {tasks.map((task, index) => (
                <li key={index}>{task.task}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-2/3 w-full p-4 sm:p-8 bg-green-50 overflow-y-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-green-900 mb-6">📸 Plant Media</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {media.map((mediaItem, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={mediaItem.url}
                alt={`Plant media ${index + 1}`}
                className="w-full h-56 sm:h-64 object-cover"
              />
              <div className="bg-green-100 text-green-800 text-sm px-4 py-2 border-t border-green-200">
                Uploaded at: <span className="font-medium">{mediaItem.uploaded_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantPage;
