import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatWindow from "./ChatWindow/ChatWindow";
import VideoCallWindow from "./VideoCallWindow/VideoCallWindow";
import "./Home.css";
import UsersListWindow from "./UsersListWindow/UsersListWindow";

import { commonApi } from "../../api/common";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketProvider";
import { MyInfoContext } from "../../context/MyInfoProvider";

import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import Error from "../Error/customError";

import CustomPopup from "../../CustomPop/CustomPopup";

import peerJs from "peerjs";

const Home = () => {
  

  const { socket } = useContext(SocketContext);

  const { getMyInfo, myInfo, myInfoError } = useContext(MyInfoContext);

  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);

  const [isCalling, setIsCalling] = useState(false);
  const [callData, setCallData] = useState();
  const [isCallAccept, setIsCallAccept] = useState(false);
  const [userStream, setUserStream] = useState();
  const [remoteUserStream, setRemoteUserStream] = useState();
  // useState for messages
  const [globalPeer, setGlobalPeer] = useState();
  const PeerRef = useRef();

  useEffect(() => {
    getMyInfo();
  }, []);

  useEffect(() => {
    if (myInfo) {
      getAllUsers();
      getAllFriends();
      getReceivedRequest();
    }
  }, [myInfo]);

  useEffect(() => {
    if (socket) {
      socket.on("incoming-call", HandleIncomingCall);
    }
    return () => {
      if (socket) {
      }
    };
  }, [socket, globalPeer]);
  useEffect(() => {
    if (globalPeer) {
      globalPeer.on("close", (e) => {
        console.log("Peer connection closed:", e);
      });
    }
  }, [globalPeer]);

  // method for video call user
  const onVideoCall = async (email, name) => {
    console.log("Call - ", name);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setIsCalling(true);

      setUserStream(stream);

      const peer = new peerJs();

      setGlobalPeer(peer);
      if (peer) {
        peer.on("open", (id) => {
          console.log("My peer ID is: " + id);
          socket.emit("user-call", {
            receiverEmail: email,
            receiverName: name,
            callerName: myInfo.name,
            callerEmail: myInfo.email,
            callerSignalData: id, // Send the Peer ID to the receiver
          });
          setCallData({
            receiverEmail: email,
            receiverName: name,
            callerName: myInfo.name,
            callerEmail: myInfo.email,
            callerSignalData: id,
          });

          socket.on("call-accept", (data) => {
            peer.connect(data.receiverSignalData);
            setIsCallAccept(true);
            setCallData(data);

            peer.on("call", async (call) => {
              call.answer(stream); // Answer the call with an A/V stream.

              call.on("stream", function (remoteStream) {
                // Show stream in some video/canvas element.
                setRemoteUserStream(remoteStream);
              });
            });
          });
        });
      }
    } catch (error) {
      toast.error("Something bad happend");
      toast.error("Try again later");
    }
  };

  const AcceptCall = async (SocketData) => {
    try {
      setIsCallAccept(true);
      const peer = new peerJs();

      setGlobalPeer(peer);
      if (peer) {
        peer.connect(SocketData.callerSignalData);

        peer.on("open", async (id) => {
          socket.emit("call-accept", { ...SocketData, receiverSignalData: id });

          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          const call = peer.call(SocketData.callerSignalData, stream);
          setUserStream(stream);

          call.on("stream", function (remoteStream) {
            // Show stream in some video/canvas element.
            setRemoteUserStream(remoteStream);
          });
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something bad happend");
      toast.error("Try again later");
    }
  };

  const HandleIncomingCall = useCallback(
    async (data) => {
      setCallData(data);
      setPopupVisible(true);
    },
    [socket]
  );

  //method for onAccept popup
  const onAcceptPopup = async () => {
    await AcceptCall(callData);
    setPopupVisible(false);
    setIsCalling(true);
  };

  const [userOnChat, setUserOnChat] = useState();

  //method for popup toast for incoming-call

  const [allUsers, setAllUsers] = useState();
  // method for getting all users info
  const getAllUsers = async () => {
    try {
      let res = await commonApi("post", "/user/allUsers");
      if (res.status === 200) {
        setAllUsers(res.data);
      }
    } catch (error) {
      toast.error("Couldn't load users!");
      toast.info("Try again later");
    }
  };

  // method for get friends
  const [friendList, setFriendList] = useState(null);
  const [friendListError, setFriendListError] = useState(null);
  const getAllFriends = async () => {
    try {
      if (myInfo) {
        const res = await commonApi("post", "/user/friends");
        if (res.status == 200) {
          setFriendList(res.data);
          setFriendListError(null);
        }
      }
    } catch (error) {
      setFriendListError(error);
      setFriendList(null);
      
    }
  };
  const [receivedRequest, setReceivedRequest] = useState([]);
  // method for received request
  const getReceivedRequest = async () => {
    try {
      const res = await commonApi("post", "/user/ReceivedRequest", {
        userId: myInfo._id,
      });
      if (res.status == 200) {
        setReceivedRequest(res.data);
      }
    } catch (error) {
      toast.error("Something bad happend :)");
    }
  };

  // method for add friend
  const addFriend = async (friendId) => {
    try {
      const res = await commonApi("post", "/user/addFriend", {
        friendId: friendId,
      });
      if (res.status == 200) {
        await getReceivedRequest();
        await getAllFriends();
        await getMyInfo()
        await getAllUsers();
        toast.success("Friend added successfully :)");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.info(error.response.data);
      }
    }
    await getMyInfo();
  };

  //method for remove request
  const removeRequest = async (friendId) => {
    try {
      const res = await commonApi("post", "/user/removeRequest", {
        friendId: friendId,
      });
      if (res.status == 200) {
        await getReceivedRequest();
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  //method for render homepage
  const renderHomepage = () => {
    if (!myInfoError && !myInfo) {
      return <Loader />;
    }

    if (myInfo) {
      return (
        <div className="home">
          <ChatWindow userOnChat={userOnChat} onVideoCall={onVideoCall} />
         
          <div>
            <UsersListWindow
              allUsers={allUsers}
              friendList={friendList}
              frinedListError={friendListError}
              receivedRequest={receivedRequest}
              addFriend={addFriend}
              removeRequest={removeRequest}
              setUserOnChat={setUserOnChat}
              onVideoCall={onVideoCall}
            />
            {/* <OthersWindow /> */}
            {popupVisible ? (
              <CustomPopup
                setPopupVisible={setPopupVisible}
                autoCloseTime={25000}
                callerName={callData.callerName}
                onAcceptPopup={onAcceptPopup}
              />
            ) : (
              <></>
            )}

            {isCalling && callData && (
              <VideoCallWindow
                setIsCalling={setIsCalling}
                setCallData={setCallData}
                callData={callData}
                isCallAccept={isCallAccept}
                setIsCallAccept={setIsCallAccept}
                userStream={userStream}
                remoteUserStream={remoteUserStream}
                globalPeer={globalPeer}
                PeerRef={PeerRef}
                // receiverEmail={callData.receiverEmail}
              />
            )}
          </div>
        </div>
      );
    }
    if (myInfoError) {
      if (myInfoError == 500) {
        toast.error("Something bad happend");
        toast.error("Try again later");
        return Error(500);
      } else {
        navigate("/auth");
      }
      // return customError(myInfoError)
    }
  };
  return renderHomepage();
};

export default Home;
