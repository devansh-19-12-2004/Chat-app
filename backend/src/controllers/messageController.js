import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filtered_users =await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    res.status(200).json(filtered_users);
  } catch (error) {
    console.error("error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("error in getMessages:", error.message);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }
    const message = new Message({
      text,
      image: imageURL,
      receiverId,
      senderId,
    });
    await message.save();
    const  recieverSocketId=getReceiverSocketId(receiverId);
    if(recieverSocketId){
      io.to(recieverSocketId).emit('newMessage', message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("error in sendMessage:", error.message);
    res.status(500).json({ message: "Error sending message" });
  }
};
