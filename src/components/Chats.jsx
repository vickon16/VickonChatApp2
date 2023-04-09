import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { userChatCollectionRef } from '../firebase.config';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const {currentUser} = useAuth();
  const [, dispatch] = useChat();

  const handleSelect = (userInfo) => {
    dispatch({type: "CHANGE_USER", payload : userInfo})
  }

  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(userChatCollectionRef, currentUser.uid), (doc) => {
        setChats(doc.data());
      }); 
      return () => unSub()
    }

    currentUser.uid && getChats();
  }, [currentUser.uid])
  

  return (
    <section className='chats py-4 flex flex-col gap-2'>
      {// convert object of chats to arrays
        Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map(chat => (
        <div onClick={() => handleSelect(chat[1]?.userInfo)} key={chat[0]} className="userChat flex items-center gap-2 px-3 py-2 text-gray-200 cursor-pointer hover:bg-darkSecondaryColor">
          <img src={chat[1]?.userInfo?.photoURL} className='w-[40px] h-[40px] rounded-full object-cover' alt="dymmmy" />
          <div className="chatinfo">
            <span className='capitalize font-semibold'>{chat[1]?.userInfo?.displayName}</span>
            <p className='text-xs font-light'>{chat[1]?.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Chats