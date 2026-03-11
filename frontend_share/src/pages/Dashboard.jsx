import { useAuth, UserButton } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import DashBoardLayout from "../layout/DashBoardLayout";

const Dashboard = () => {
  const {getToken} = useAuth();
  useEffect(() => {
    const displayToken = async () => {
        const token= await getToken();
        console.log(token);
    }
    displayToken();
}, []);
  return (
    <DashBoardLayout activeMenu="Dashboard">
      <div>
        DashBoard content
      </div>
    </DashBoardLayout>
  );
};

export default Dashboard;
