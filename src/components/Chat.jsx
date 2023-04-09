import React from 'react'
import Messages from './Messages';
import Input from './Input';
import { useChat } from '../context/ChatContext';

const Chat = () => {
  const [state ] = useChat();

  return <aside className="w-full flex-[2]">
    <div className="chatInfo h-[60px] bg-secondaryColor flex items-center justify-between px-4 text-lightGray">
      <span className='text-lg font-semibold'>{state?.user?.displayName}</span>
      
      <div className="chatIcons flex gap-[10px]">
        <img src="img/cam.png" className='h-[24px] cursor-pointer' alt="camera" />
        <img src="img/add.png" className='h-[24px] cursor-pointer' alt="add icon" />
        <img src="img/more.png" className='h-[24px] cursor-pointer' alt="more" />
      </div>
    </div>
    <Messages />
    <Input />
  </aside>;
}

export default Chat