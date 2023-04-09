import { doc, onSnapshot } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import Message from "../components/Message";
import { useChat } from "../context/ChatContext";
import {chatsCollectionRef} from "../firebase.config"

const Messages = () => {
  const [state] = useChat();
  const [messages, setMessages] = useState();

  useEffect(() => {
    const getAllChats = () => {
      const unSub = onSnapshot(doc(chatsCollectionRef, state?.chatId), (doc) => {
        doc.exists() && setMessages(doc.data()?.messages);
      });
      return () => unSub();
    }

    state?.chatId && getAllChats();
  }, [state?.chatId])

  return (
    <aside className='flex flex-col gap-y-4 bg-neutral-600 p-[13px] w-full overflow-scroll' style={{height : "calc(100% - 120px)"}}>
      {messages && messages?.map(message => (
          <Message key={message.id} message={message} />
        ))
      }
    </aside>
  )
}

export default Messages