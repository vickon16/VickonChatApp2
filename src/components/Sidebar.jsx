import React from 'react'
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Chats from './Chats';

const Sidebar = () => {
  return (
    <aside className='w-full flex-1 bg-secondaryColor'>
      <Navbar />
      <Search />
      <Chats />
    </aside>
  )
}

export default Sidebar