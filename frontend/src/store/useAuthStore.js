import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL=import.meta.env.MODE ==="development"? "http://localhost:5000":"/";

export const useAuthStore = create((set,get) => ({
  user: null,
  isSigningUp: false,
  isSigningIn: false,
  isUpdating: false,
  isCheckingAuth: true,
  onlineUsers :[],
  socket:null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ user: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ user: res.data });
      toast.success("Account Created Successfully");
      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
},
logout: async () => {
    try {
        await axiosInstance.get("/auth/logout");
        set({ user: null });
        toast.success("Logged out successfully");
        get().disconnectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
    }
},
login: async (data)=>{
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ user: res.data });
      toast.success("Logged In Successfully");
      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningIn: false });
    }
  },
  updateProfile: async (data)=>{
    set({isUpdating:true});
    try {
      const res=await axiosInstance.put("/auth/update-profile",data);
      set({user:res.data});
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally{
      set({isUpdating:false});
    }
  },
  connectSocket:()=>{
    const {user}=get();
    if(!user ||  get().socket?.connected) return;
    const socket=io(BASE_URL,{
      query:{
        userId:user._id
      }
    });
    socket.connect(); 
    set({socket:socket});
    socket.on("getOnlineUsers",(users)=>{
      set({onlineUsers:users});
    });
  },
  disconnectSocket:()=>{
    if(get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
