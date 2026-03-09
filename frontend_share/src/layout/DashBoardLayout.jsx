import { useUser } from '@clerk/clerk-react';
import React, { Children } from 'react'
import NavBar from '../components/NavBar';
import SideMenu from '../components/SideMenu';

const DashBoardLayout = ({children,activeMenu}) => {
    const {user} = useUser();
  return (
    <div>
        {/* navbar component goes here */}
        <NavBar activeMenu={activeMenu}/>
        {user && (
            <div className='flex'>
                <div className='max-[1080px]:hidden'>
                    {/* sidemenu goes here */}
                    <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className='grow mx-5'>{children}</div>
            </div>
        )}
    </div>
  )
}

export default DashBoardLayout;