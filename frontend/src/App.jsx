import React from "react";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { UserDataContext } from "../src/context/UserContext.jsx";

const App = () => {
  let { userData } = useContext(UserDataContext);
  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/login"} />}
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/login"
        element={userData ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/profile/:userId"
        element={userData ? <Profile /> : <Navigate to={"/login"} />}
      />
    </Routes>
  );
};

export default App;
