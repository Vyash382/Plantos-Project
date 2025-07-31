import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userAtom } from "../Recoil/UserAtom";

export default function Register() {
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const [step, setStep] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const rsp = await axios.post("https://plantos-backend.onrender.com/api/user/send-otp", {
        phone: formData.phone,
      });
      if (rsp.data.type === true) {
        setStep("otp");
      }
      alert(rsp.data.message);
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://plantos-backend.onrender.com/api/user/verify-otp", {
        phone: formData.phone,
        otp: formData.otp,
      });

      if (res.data.flag === true) {
        alert("OTP verified successfully");
        const userData = new FormData();
        userData.append("name", formData.name);
        userData.append("username", formData.username);
        userData.append("phone", formData.phone);
        userData.append("password", formData.password);
        if (formData.avatar) {
          userData.append("file", formData.avatar);
        }

        const response = await axios.post(
          "https://plantos-backend.onrender.com/api/user/register",
          userData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response);
        navigate("/login");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  return (
    <div
      className="pt-24 w-full min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1492496913980-501348b61469?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-80"></div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl border border-yellow-200 backdrop-blur-sm mx-4">
        <h1 className="text-4xl font-extrabold text-yellow-800 text-center mb-4 font-serif tracking-wide drop-shadow-lg">
          🌿 Plantos
        </h1>
        <p className="text-yellow-700 text-center mb-6 italic text-sm">
          Join the Plantos family
        </p>

        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-5">
            {["name", "username", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-yellow-800 text-sm mb-1 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  type={field === "phone" ? "tel" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={field === "phone" ? "9876543210" : ""}
                  className="w-full p-3 rounded bg-white border border-yellow-300 text-yellow-800 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-yellow-800 text-sm mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full p-3 rounded bg-white border border-yellow-300 text-yellow-800 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-yellow-800 text-sm mb-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full p-3 rounded bg-white border border-yellow-300 text-yellow-800 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-yellow-800 text-sm mb-1">Profile Photo</label>
              <input
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 rounded bg-white border border-yellow-300 text-yellow-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 transition duration-200 text-white p-3 rounded font-semibold shadow"
            >
              Get OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-yellow-800 text-sm mb-1">Enter OTP</label>
              <input
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="1234"
                className="w-full p-3 rounded bg-white border border-yellow-300 text-yellow-800 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 transition duration-200 text-white p-3 rounded font-semibold shadow"
            >
              Submit OTP & Register
            </button>
          </form>
        )}

        <p className="text-center text-yellow-700 text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="underline hover:text-yellow-800"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
