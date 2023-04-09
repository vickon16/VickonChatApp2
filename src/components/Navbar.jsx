import { signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../firebase.config'

const Navbar = () => {
  const navigate = useNavigate();
  const {currentUser} = useAuth();

  const logOut = async () => {
    await signOut(auth);
    navigate("/login")
  }

  return (
    <nav className='flex items-center bg-darkSecondaryColor h-[60px] px-4 justify-between text-gray-200'>
      <span className='font-semibold '>Chat App</span>
      <div className="user flex items-center gap-3">
        <img src={currentUser?.photoURL} alt="dummy" className='bg-gray-200 h-[24px] w-[24px] rounded-md object-cover' />
        <span className='text-sm'>{currentUser?.displayName}</span>
        <button onClick={logOut} className='bg-primaryColor px-2 py-1 rounded-md text-sm border-none'>logout</button>
      </div>
    </nav>
  )
}

export default Navbar