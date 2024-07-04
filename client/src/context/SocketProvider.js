import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MyInfoContext } from "./MyInfoProvider";

const SocketContext = createContext();

// const socket = io("http://localhost:9000");

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const { myInfo } = useContext(MyInfoContext);

  useEffect(() => {
    if (myInfo) {
      // Connect to the WebSocket server
      const newSocket = io(process.env.REACT_APP_BACKEND_URL,{
        withCredentials: true,
      });
      setSocket(newSocket);
    }
    // Clean up function to disconnect from the server when the component unmounts
  }, [myInfo]);


  useEffect(() => {
    if(socket){
      socket.emit("MapEmailToSocketID", myInfo.email);

    }
    
  }, [socket]);
  const connectEmailToSocket = (email) => {
    socket.emit("MapEmailToSocketID", email);
  };
  return (
    <SocketContext.Provider value={{ connectEmailToSocket, socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
