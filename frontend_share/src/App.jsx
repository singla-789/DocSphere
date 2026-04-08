import React from "react";
import { assets } from "./assets/assets";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import Upload from "./pages/Upload";
import Subscription from "./pages/Subscription";
import Transactions from "./pages/Transactions";
import PublicFileView from "./pages/PublicFileView";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { UserCreditsProvider } from "./context/UserCreditContext";

const App = () => {
  return (
    <UserCreditsProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/file/:id" element={<PublicFileView />} />
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/my-files"
            element={
              <>
                <SignedIn>
                  <MyFiles />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/upload"
            element={
              <>
                <SignedIn>
                  <Upload />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/subscription"
            element={
              <>
                <SignedIn>
                  <Subscription />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/transactions"
            element={
              <>
                <SignedIn>
                  <Transactions />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserCreditsProvider>
  );
};

export default App;
