import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserDataContext } from "./UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";

export const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const { serverURL } = useContext(authDataContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    if (!userData) return;

    const newSocket = io(serverURL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("register", userData._id);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [userData]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
