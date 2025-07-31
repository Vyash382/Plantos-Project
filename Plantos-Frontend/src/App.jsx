import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import Navbar from './components/Header'
import Garden from './pages/Garden'
import AddPlant from './pages/AddPlant'
import Schedule from './pages/Schedule'
import { userAtom } from './Recoil/UserAtom.js'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import PlantPage from './pages/Plant.jsx'
import Notification from './components/Notification'
import Profile from './pages/Profile.jsx'
function App() {
  const [open,setOpen] = useState(false);
  const [user,setUser] = useRecoilState(userAtom);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.post(
          'https://plantos-backend.onrender.com/api/user/getDetails',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser({
          username:response.data.user.username
        });
      } catch (error) {
        console.error('User fetch failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    fetchUser();
  },[]
  );

  return (
    <BrowserRouter>
      <Navbar open={open} setOpen={setOpen} />
      <Notification open={open} setOpen={setOpen} />
      <Routes>
        <Route path='/schedule' element={<Schedule />} />
        <Route path='/add-plant' element={<AddPlant />} />
        <Route path='/garden' element={<Garden />} />
        <Route path='/' element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plant" element={<PlantPage />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
