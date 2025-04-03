import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes,Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {user,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
  const {theme}=useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // console.log(onlineUsers);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  if(isCheckingAuth && !user){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
    <div >
      <Navbar/>
      <Routes>
        <Route path="/" element={user?<HomePage/>:<Navigate to="/login"/>} />
        <Route path="/Signup" element={!user?<SignupPage/>:<Navigate to="/" />} />
        <Route path="/login" element={!user?<LoginPage/>:<Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={user?<ProfilePage/>:<Navigate to="/login  " />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
