import React from "react";
import { Route, Routes } from "react-router-dom";
import VideoChat from "../page/VideoChat";

import Header from "./Header";
import Main from "../pages/Main";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import SignupTech from "./SignupTech";
import SignupUser from "./SignupUser";
import Review from "../pages/Review";

export default function Router() {
  return (
    <>
      <Header />
      <Routes>
        {/* <Route path="/" element={<VideoChat />} /> */}
        <Route path="/" element={<Main />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />}>
          <Route path="user" element={<SignupUser />} />
          <Route path="tech" element={<SignupTech />} />
        </Route>
        <Route path="review" element={<Review />} />
      </Routes>
    </>
  );
}
