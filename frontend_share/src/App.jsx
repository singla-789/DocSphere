import React from "react";
import { assets } from "./assets/assets";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import Upload from "./pages/Upload";
import Subscription from "./pages/Subscription";
import Transactions from "./pages/Transactions";

const App = () => {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/my-files" element={<MyFiles/>}/>
      <Route path="/upload" element={<Upload/>}/>
      <Route path="/subscription" element={<Subscription/>}/>
      <Route path="/transaction" element={<Transactions/>}/>


    </Routes>
    </BrowserRouter>
  );

};

export default App;
