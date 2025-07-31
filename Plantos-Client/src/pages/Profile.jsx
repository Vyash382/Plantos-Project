import axios from "axios";
import React, { useEffect, useState } from "react";
import { userAtom } from "../Recoil/UserAtom";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

export default function Profile() {
    const [user,setUser]  = useState({});
    const usere = useRecoilValue(userAtom);
const navigate = useNavigate();
useEffect(()=>{
    if(!usere){
      navigate('/');
    }
  },[])
  useEffect(()=>{
    async function fetch_user(){
        const response = await axios.post('https://plantos-backend.onrender.com/api/user/my-profile',{},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(response.data.profile);
        setUser(response.data.profile);
    }
    fetch_user();  
  },[])
  

  return (
    <div className="pt-24 min-h-screen bg-yellow-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center border border-yellow-200">
        {/* Profile Image */}
        <div className="mb-6">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto shadow-lg border-4 border-yellow-200 object-cover"
          />
        </div>

        {/* User Details */}
        <h2 className="text-2xl font-bold text-yellow-800 mb-1">{user.name}</h2>
        <p className="text-yellow-600 text-sm mb-2">@{user.username}</p>
        <p className="text-yellow-700 text-sm">
          📞 <span className="font-medium">{user.phone}</span>
        </p>
      </div>
    </div>
  );
}
