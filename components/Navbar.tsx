import Worldcoin from '@/pages/worldcoin'
import React from 'react'

const Navbar = () => {
  return (
    

<nav className="bg-white  fixed w-full z-20 top-0 left-0 border-b ">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="/" className="flex items-center">
      
      <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">Refer 🤝 </span>
  </a>
  <div className="flex md:order-2">
      <Worldcoin/>
  </div>
  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white text-black ">
      
      <li>
        <a href="/createCampaign" className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Create Campaign</a>
      </li>
      <li>
        <a href="/generateReferral" className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Generate Referrals</a>
      </li>
      <li>
        <a href="#" className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Campaign Action</a>
      </li>
    </ul>
  </div>
  </div>
</nav>


  )
}

export default Navbar