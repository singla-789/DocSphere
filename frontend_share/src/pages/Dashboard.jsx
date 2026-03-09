import { UserButton } from "@clerk/clerk-react";
import React from "react";
import DashBoardLayout from "../layout/DashBoardLayout";

const Dashboard = () => {
  return (
    <DashBoardLayout activeMenu="Dashboard">
      <div>
        DashBoard content
      </div>
    </DashBoardLayout>
  );
};

export default Dashboard;
