import { UserButton } from '@clerk/clerk-react';
import { Menu, Share2, Wallet, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';
import CreditsDisplay from './CreditsDisplay';
import { UserCreditsContext } from '../context/UserCreditContext';

const NavBar = ({activeMenu}) => {
  const [openSidemenu, setOpenSideMenu] = useState(false);
  const {credits,fetchUserCredits} = useContext(UserCreditsContext);

  useEffect(()=>{
    fetchUserCredits();
  },[fetchUserCredits]);


  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-7 py-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpenSideMenu(!openSidemenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {openSidemenu ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="p-2 rounded-lg bg-blue-50">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-lg font-semibold text-gray-800 tracking-tight">
              DocSphere
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link
            to="/subscriptions"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <CreditsDisplay credits={credits}/>
          </Link>

          <div className="relative">
            <UserButton />
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      {openSidemenu && (
        <div className="fixed top-[72px] left-0 right-0 bg-white border-b border-gray-200 shadow-md lg:hidden z-20">
          <SideMenu activeMenu={activeMenu}/>
        </div>
      )}
    </header>
  );
};

export default NavBar;