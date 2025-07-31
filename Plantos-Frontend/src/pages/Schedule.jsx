import { useEffect, useState } from "react";
import { Clock, Leaf, Droplet, Scissors, ClipboardList } from "lucide-react";
import axios from "axios";
import { userAtom } from "../Recoil/UserAtom";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

export default function Schedule() {
  const [tasks, setTasks] = useState([]);
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user){
      navigate('/');
    }
  },[])
  useEffect(() => {
    async function fetch_tasks() {
      const response = await axios.post(
        "https://plantos-backend.onrender.com/api/user/get_today_schedule",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(response.data.tasks);
    }
    fetch_tasks();
  }, []);

  const handleCheck = async (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const newStatus = task.status === "done" ? "pending" : "done";

          axios.post(
            "https://plantos-backend.onrender.com/api/plant/toggle",
            { id, status: newStatus },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const isTaskTimeStarted = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const now = new Date();
    const taskTime = new Date();
    taskTime.setHours(hour, minute, 0, 0);
    return now >= taskTime;
  };

  const getIcon = (taskName) => {
    const lower = taskName.toLowerCase();
    if (lower.includes("water")) return <Droplet size={16} />;
    if (lower.includes("spray")) return <Leaf size={16} />;
    if (lower.includes("prune")) return <Scissors size={16} />;
    return <ClipboardList size={16} />;
  };

  return (
    <div className="pt-24 min-h-screen bg-yellow-50 text-yellow-900 p-4 flex justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-serif text-yellow-800 text-center mb-10 font-bold">
          🌿 Today’s Care Timeline
        </h1>

        <div className="relative border-l-4 border-yellow-400 ml-6 space-y-8">
          {tasks.map((task) => {
            const timeStarted = isTaskTimeStarted(task.scheduled_time);
            return (
              <div key={task.id} className="flex items-center gap-6 relative">
                {/* Timeline dot */}
                <div className="absolute -left-[19px] bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-white shadow">
                  {getIcon(task.task)}
                </div>

                {/* Task content */}
                <div className="flex justify-between items-center w-full ml-4 bg-white p-4 rounded-xl shadow border border-yellow-200">
                  <div>
                    <h2 className="text-lg font-semibold text-yellow-900">{task.task}</h2>
                    <p className="text-yellow-600 text-sm italic mb-1">{task.plant_name}</p>
                    <p className="text-yellow-700 flex items-center gap-1 text-sm">
                      <Clock size={14} />
                      {task.scheduled_time}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={() => handleCheck(task.id)}
                    disabled={!timeStarted}
                    className={`w-6 h-6 accent-yellow-500 ${
                      !timeStarted ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
