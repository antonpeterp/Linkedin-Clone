import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import { SocketContext } from "../context/SocketContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import logo2 from "../assets/logo2.svg";
import avatar from "../assets/avatar.png";
import { IoSearchSharp } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { FaBriefcase } from "react-icons/fa6";
import { AiFillMessage } from "react-icons/ai";
import { BsBellFill } from "react-icons/bs";
import axios from "axios";
import Home from "../pages/Home.jsx";

const Nav = () => {
  const navigate = useNavigate();
  const [activeSearch, setActiveSearch] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { userData, setUserData } = useContext(UserDataContext);
  const { serverURL } = useContext(authDataContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(serverURL + "/api/notifications", {
          withCredentials: true,
        });
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setNotifications([]);
      }
    };
    if (userData) fetchNotifications();
  }, [userData]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => socket.off("newNotification");
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = async () => {
    setShowNotifications((prev) => !prev);
    setShowPopup(false);

    if (!showNotifications && unreadCount > 0) {
      try {
        await axios.patch(
          serverURL + "/api/notifications/read-all",
          {},
          { withCredentials: true }
        );
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-[60px] bg-white fixed top-0 shadow-lg flex justify-around items-center px-[10px] left-0 z-[99]">
      <div className="flex justify-around items-center gap-[10px]">
        <div onClick={() => setActiveSearch(false)}>
          <img src={logo2} alt="logo" className="w-[40px]" />
        </div>
        {!activeSearch && (
          <IoSearchSharp
            className="w-[24px] h-[24px] text-gray-600 lg:hidden"
            onClick={() => setActiveSearch(true)}
          />
        )}
        <form
          className={`lg:w-[300px] w-[180px] h-[30px] lg:flex border border-[#E0E0E0] rounded-[30px] flex items-center gap-[10px] px-[10px] ${
            !activeSearch ? "hidden" : ""
          }`}
        >
          <IoSearchSharp className="w-[24px] h-[24px] text-gray-600" />
          <input
            type="text"
            className="w-[80%] h-full bg-transparent outline-none border-0"
            placeholder="Search"
          />
        </form>
      </div>

      <div className="flex justify-center items-center gap-[30px]">
        <div
          className="flex-col flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <IoHomeSharp />
          Home
        </div>
        <div className="lg:flex flex-col items-center justify-center hidden">
          <HiUsers />
          My Network
        </div>
        <div className="lg:flex flex-col items-center justify-center hidden">
          <FaBriefcase />
          Jobs
        </div>
        <div className="lg:flex flex-col items-center justify-center hidden">
          <AiFillMessage />
          Message
        </div>

        {/* Bell */}
        <div
          className="relative flex-col flex items-center justify-center cursor-pointer"
          onClick={handleBellClick}
        >
          <div className="relative">
            <BsBellFill />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          Notifications
        </div>

        {/* Notification dropdown */}
        {showNotifications && (
          <div className="absolute top-[70px] right-[80px] w-[350px] max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-lg border border-[#E0E0E0] z-[100]">
            <div className="p-[16px] font-semibold text-gray-700 border-b border-[#E0E0E0]">
              Notifications
            </div>
            {notifications.length === 0 ? (
              <div className="p-[16px] text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-center gap-[12px] p-[12px] border-b border-[#F0F0F0] ${
                    !n.read ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <img
                    src={n.sender?.profileImage || avatar}
                    alt="sender"
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {n.sender?.firstName} {n.sender?.lastName}
                    </span>{" "}
                    {n.message}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile avatar */}
        <div
          className="w-[50px] h-[48px] rounded-full cursor-pointer"
          onClick={() => {
            setShowPopup((prev) => !prev);
            setShowNotifications(false);
          }}
        >
          <img
            src={userData.profileImage || avatar}
            alt="default profile picture"
          />
        </div>

        {/* Profile popup */}
        {showPopup && (
          <div className="w-[300px] min-h-[380px] bg-white shadow-lg absolute top-[84px] rounded-lg border border-[#E0E0E0] flex flex-col items-center p-[20px] gap-[20px]">
            <div className="w-[50px] h-[48px] rounded-full">
              <img src={userData.profileImage || avatar} alt="profile" />
            </div>
            <div className="text-[20px] font-semibold text-gray-700">
              {`${userData.firstName} ${userData.lastName}`}
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
              onClick={() => {
                navigate(`/profile/${userData._id}`);
                setShowPopup(false);
              }}
            >
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-700"></div>
            <div className="flex items-center justify-center text-gray-600">
              <HiUsers className="w-[22px] h-[22px] text-gray-600" />
              <div>My Networks</div>
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#ff2d2d] text-[#ff2d2d]"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
