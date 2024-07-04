// VideoCallWindow.js
import React, {
  useCallback,
  useContext,
  useEffect,
  
  useState,
} from "react";
import "./VideoCallWindow.css";
import ReactPlayer from "react-player";
import { SocketContext } from "../../../context/SocketProvider";



const VideoCallWindow = ({
  callData,
  setIsCalling,
  isCallAccept,
  setIsCallAccept,
  userStream,
  remoteUserStream,
  globalPeer,
  PeerRef,
}) => {
  

  const { socket } = useContext(SocketContext);
  

  const [isHangedUp, setIsHangedUp] = useState(false);

  const handleHangup = useCallback(
    async () => {
      setIsHangedUp(true);
      console.log("Hang-up");
      try {
      

      
        setIsCallAccept(false);

        setIsHangedUp(true);
      } catch (error) {
        console.log(error);
      }
    },
    [setIsCallAccept]
  );

  useEffect(() => {
    socket.on("hang-up", handleHangup);

    return () => {
      socket.off("hang-up", handleHangup);
    };
  }, [socket, handleHangup]);

  const renderCallStatus = () => {
    if (isHangedUp) {
      return <h1>Call Ended</h1>;
    }
    if (!isCallAccept) {
      return <h1>Calling...</h1>;
    }
  };
  return (
    <div className="video-call-window">
      {renderCallStatus()}

      <div className="video-container">
        <div className="remoteVideo">
          {/* <h1>ahkh</h1> */}
          {!isHangedUp && remoteUserStream && (
            <ReactPlayer url={remoteUserStream} playing />
          )}
        </div>
        <div className="userVideo">
          <ReactPlayer url={userStream} playing />
        </div>
      </div>

      <div className="controls">
        <button
          onClick={async () => {
            try {
              userStream.getTracks().forEach((track) => track.stop());
              if (globalPeer) {
                globalPeer.destroy();
              }
              if (remoteUserStream) {
                remoteUserStream.getTracks().forEach((track) => track.stop());
              }
              setIsHangedUp(false)
              socket.emit("hang-up", {
                callerEmail: callData.callerEmail,
                receiverEmail: callData.receiverEmail,
              });
              setIsCalling(false);
              window.location.reload()
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <i class="bi bi-telephone"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoCallWindow;
