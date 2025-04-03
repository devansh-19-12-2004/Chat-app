import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import NoChat from '../components/NoChat';

const HomePage = () => {
  const {selectedUser}=useChatStore();
  return (
    <div className='h-screen bg-base-200'>
      <div className="flex justify-center items-center pt-16 px-4">
        <div className='bg-base-100 rounded-lg shadow-xl w-full  h-[calc(100vh-5rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar />
            {selectedUser? <ChatContainer/> : <NoChat/>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default HomePage