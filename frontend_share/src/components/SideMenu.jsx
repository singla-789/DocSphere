import { useUser } from '@clerk/clerk-react';
import { User } from 'lucide-react';
import React from 'react';
import { SIDE_MENU_DATA } from '../assets/data';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({ activeMenu }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-500" />
          </div>
        )}

        <div className="text-center">
          <h2 className="text-sm font-semibold text-gray-800">
            {user?.fullName || "Guest User"}
          </h2>
          <p className="text-xs text-gray-500">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <div>
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-all duration-200 cursor-pointer ${
              activeMenu === item.label
                ? "bg-purple-500 text-white font-medium shadow-md hover:bg-purple-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>

    </div>
  );
};

export default SideMenu;