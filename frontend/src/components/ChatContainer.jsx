import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessagesInput from "./MessagesInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const { user } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatMessageDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const shouldShowDate = (currentMessageDate, previousMessageDate) => {
    const currentDate = new Date(currentMessageDate).toDateString();
    const previousDate = new Date(previousMessageDate).toDateString();
    return currentDate !== previousDate;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessagesInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          const showDate = !previousMessage || shouldShowDate(message.createdAt, previousMessage.createdAt);

          return (
            <React.Fragment key={message._id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <div className=" px-4 py-1 rounded-full text-sm">
                    {formatMessageDate(message.createdAt)}
                  </div>
                </div>
              )}
              <div
                className={`chat ${
                  message.senderId === selectedUser._id ? "chat-start" : "chat-end"
                }`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full">
                    <img
                      src={
                        message.senderId === selectedUser._id
                          ? selectedUser.profilePic
                          : user.profilePic
                      }
                    />
                  </div>
                </div>
                <div className="chat-header">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <MessagesInput />
    </div>
  );
};

export default ChatContainer;
