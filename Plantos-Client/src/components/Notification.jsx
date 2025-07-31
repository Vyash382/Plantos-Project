import { Bell, X } from "lucide-react";
import { useEffect,useState } from "react";
import axios from "axios";
export default function Notification({ open, setOpen }) {
  const [notifications,setNotifications] = useState([]);
  useEffect(()=>{
    async function fetch_notification(){
      const response = await axios.post('https://plantos-backend.onrender.com/api/user/notification',{},{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setNotifications(response.data.messages);
    }
    fetch_notification();
  },[])

  if (!open) return null;

  return (
    <div className="relative z-50 w-full">
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-full px-4 flex justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl border border-green-300 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-white bg-green-500 hover:bg-green-600 rounded-full p-1 shadow"
            aria-label="Close notifications"
          >
            <X size={20} />
          </button>

          <h1 className="text-2xl font-bold text-center text-green-700 mb-6 flex items-center justify-center gap-2">
            <Bell size={24} /> Notifications
          </h1>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {notifications.map((message, index) => (
              <div
                key={index}
                className="bg-green-100 border-l-4 border-green-500 text-green-900 p-4 rounded-md shadow"
              >
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
