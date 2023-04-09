import { doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { chatsCollectionRef, userChatCollectionRef, userCollectionRef } from '../firebase.config';
import { errorHandler } from '../firebaseFunctions';

const Search = () => {
  const [userName, setUserName] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [err, setErr] = useState("");
  const {currentUser} = useAuth();

  // search for a user in the list
  const handleSearch = async () => {
    const q = query(userCollectionRef, where("displayName", "==", userName))

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setSearchedUser(doc.data());
      });
    } catch (error) {errorHandler(setErr, "Failed to get User")}
  }

  const handleKey = (e) => e.code === "Enter" &&  handleSearch()

  const handleSelect = async () => {
    // check wheter the group exist or not, if not, create new one
    //combine the two id.
    const combinedID = currentUser?.uid > searchedUser.uid
        ? currentUser.uid + "-" + searchedUser.uid
        :  searchedUser.uid + "-" + currentUser.uid;

    try {
      const resp = await getDocs(chatsCollectionRef, combinedID);
      if (resp.size === 0) {
        // create chat in chat collections
        await setDoc(doc(chatsCollectionRef, combinedID), { messages: [] }, {merge : true});
      }

      // update currentUser userChats collection
      await updateDoc(doc(userChatCollectionRef, currentUser.uid), {
        [combinedID+".userInfo"] : {
          uid : searchedUser.uid,
          displayName : searchedUser.displayName,
          photoURL : searchedUser.photoURL
        },
        [combinedID+".date"] : serverTimestamp()
      })

      // update searched userChat collection
      await updateDoc(doc(userChatCollectionRef, searchedUser.uid), {
        [combinedID + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedID + ".date"]: serverTimestamp(),
      });
      
    } catch (error) {
      console.log(error)
    }

    //create user chats
    setSearchedUser(null)
    setUserName("");
  }

  return (
    <section className='border-b-gray-300 flex gap-y-2 flex-col'>
      <div className="searchform p-2 ">
        <input onKeyDown={handleKey} value={userName} onChange={(e) => setUserName(e.target.value)} type="text" className='bg-transparent py-3 px-4 w-full drop-shadow-md shadow-md outline-none text-white' placeholder='Find a user...'  />
      </div>

      {/* searched User detail */}
      {searchedUser && <div onClick={handleSelect} className="userChat flex items-center gap-2 px-3 py-3 text-gray-200 cursor-pointer hover:bg-darkSecondaryColor shadow-lg drop-shadow-lg">
        <img src={searchedUser?.photoURL} className='w-[40px] h-[40px] rounded-full object-cover' alt="dymmmy" />
        <div className="chatinfo">
          <span className='capitalize font-semibold'>{searchedUser?.displayName}</span>
        </div>
      </div>}
      {err && <span className='w-full px-3 text-base text-gray-400'>...{err}...</span>}
    </section>
  )
}

export default Search