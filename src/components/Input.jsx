import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { chatsCollectionRef, storage, userChatCollectionRef } from '../firebase.config';
import { v4 as uuid} from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useAuth();
  const [state] = useChat();

  const handleSend = async () => {
    if (img) {
      // upload user image
      const storageRef = ref(storage, `${uuid}--${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed', (snapshot) => {}, 
    (error) => {}, 
    () => {getDownloadURL(uploadTask.snapshot.ref)
      .then(async (downloadURL) => {
        // update
        await updateDoc(doc(chatsCollectionRef, state?.chatId), {
        messages : arrayUnion({
          id : uuid(), text, senderId : currentUser.uid,
          date : Timestamp.now(), img: downloadURL
        })
      })
      });
    })

    } else {
      await updateDoc(doc(chatsCollectionRef, state?.chatId), {
        messages : arrayUnion({
          id : uuid(), text, senderId : currentUser.uid,
          date : Timestamp.now(),
        })
      })
    }

    // update last message
    await updateDoc(doc(userChatCollectionRef, currentUser?.uid), {
      [state?.chatId + ".lastMessage"] : {text},
      [state?.chatId + ".date"] : serverTimestamp(),
    })
    await updateDoc(doc(userChatCollectionRef, state.user?.uid), {
      [state?.chatId + ".lastMessage"]: { text },
      [state?.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  }


  return (
    <section className='h-[60px] px-4 bg-darkSecondaryColor text-gray-200 flex items-center justify-between '>
      <input type="text" value={text} className='w-full h-full border-none outline-none text-lg px-2 text-white bg-transparent' placeholder='Type Something...' onChange={(e) => setText(e.target.value)} />

      {/* send */}
      <div className="send flex items-center justify-between gap-[16px]">
        <img src="img/attach.png" className='h-[24px] cursor-pointer' alt="attach" />
        <input type="file" className='hidden' id='file-1' onChange={(e) => setImg(e.target.files[0])} />
        <label htmlFor="file-1">
          <img src="img/img.png" alt="img" className='w-14 h-[24px] cursor-pointer' />
        </label>
        <button onClick={handleSend} className='px-3 py-2'>Send</button>
      </div>
    </section>
  )
}

export default Input