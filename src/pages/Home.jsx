import React from 'react'
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
  // container
  return (
      <section className='rounded-lg overflow-hidden w-full max-w-[1200px] h-[82vh] flex shadow-xl drop-shadow-lg'>
        <Sidebar />
        <Chat />
      </section>
  )
}

export default Home