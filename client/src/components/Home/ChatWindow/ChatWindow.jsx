// ChatWindow.js
import React, { useCallback, useContext, useRef, useState } from "react";
import "./ChatWindow.css";
import img1 from "../../img/profile.jpg";
import EmojiPicker from "emoji-picker-react";
import { MyInfoContext } from "../../../context/MyInfoProvider";
import { SocketContext } from "../../../context/SocketProvider";
import Avatar from "react-avatar";
import { commonApi } from "../../../api/common";
import { useEffect } from "react";

const ChatWindow = ({ userOnChat, onVideoCall }) => {
  const { myInfo } = useContext(MyInfoContext);
  const { socket } = useContext(SocketContext);

  const [chatHistory, setChatHistory] = useState([]);
  // useState for inputMsg
  const [messageInput, setMessageInput] = useState("");
  const [renderEmoji, setRenderEmoji] = useState(false);
  const [chatRoomId, setChatRoomId] = useState();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever the messages array changes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    if (userOnChat) {
      getChatRoomId();
    }
  }, [userOnChat]);

  useEffect(() => {
    if (chatRoomId) {
      getMessage();
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (socket) {
      console.log("getting message socket");
      socket.on("message", (data) => {
        setChatHistory((prevChat) => [
          ...prevChat,
          { senderId: data.senderId, msg: data.msg },
        ]);
      });
    }
  }, [socket]);

  // getting chat room id
  const getChatRoomId = () => {
    const chatRoom = myInfo.friends.filter(
      (friend) => friend.friendID === userOnChat._id
    )[0].chatRoomID;
    setChatRoomId(chatRoom);
    console.log(chatRoomId);
  };

  // method for getting messages from DB
  const getMessage = async () => {
    try {
      console.log("get messages");
      const res = await commonApi("post", `/user/getMessages/${chatRoomId}`);
      if (res.status == 200) {
        setChatHistory(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // method for send message
  const sendMessage = async () => {
    try {
      socket.emit("message", {
        msg: messageInput.trim(),
        sender: myInfo.email,
        receiver: userOnChat.email,
        chatRoomId: chatRoomId,
      });
      setChatHistory((prevChat) => [
        ...prevChat,
        { senderId: myInfo._id, msg: messageInput.trim() },
      ]);
      setMessageInput("");
      console.log(chatHistory);
    } catch (error) {
      console.log(error);
    }
  };

  // method for onForm submit
  const onFormSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  //method for render messages
  const rendermessages = () => {
    return chatHistory.map((msg, index) => {
      if (msg.senderId === myInfo._id) {
        return (
          <li className="chat sent" key={index}>
            <span>{msg.msg}</span>
          </li>
        );
      }
      return (
        <li className="chat received" key={index}>
          <span>{msg.msg}</span>
        </li>
      );
    });
  };

  //method for render chat window
  const renderChatWindow = () => {
    if (userOnChat) {
      return (
        <>
          <div className="chat-window">
            <div>
              <div className="chat-user">
                <div>
                  <div className="back-arrow">
                    <i class="bi bi-arrow-left"></i>
                  </div>
                  <Avatar name={userOnChat.name} size="50" round={true} />
                  <div>
                    <h2>{userOnChat.name}</h2>
                  </div>
                </div>
                <div>
                  <i class="bi bi-person-dash" title="remove friend"></i>
                  <i
                    className="bi bi-camera-video"
                    onClick={async () =>
                      await onVideoCall(userOnChat.email, userOnChat.name)
                    }
                    title="video call"
                  ></i>
                </div>
              </div>
              <ul className="inbox-chat">
                {rendermessages()}
                <div ref={messagesEndRef} />
              </ul>
            </div>

            <form
              className="chat-inputbox-container"
              // onSubmit={() => sendMessage(messageInput)}
            >
              <textarea
                type="text"
                placeholder="Type your message..."
                onChange={(e) => setMessageInput(e.target.value)}
                value={messageInput}
              />
              <i
                className="bi bi-emoji-smile"
                title="Reactions"
                onClick={(e) => setRenderEmoji(!renderEmoji)}
              ></i>
              <i className="bi bi-send-fill" onClick={() => sendMessage()}></i>
            </form>
          </div>
          {renderEmoji ? (
            <EmojiPicker
              className="Emoji-Picker"
              emojiStyle=""
              searchPlaceholder="search emoji"
              suggestedEmojisMode="recent"
              reactionsDefaultOpen={true}
              lazyLoadEmojis="true"
              onEmojiClick={(e) =>
                setMessageInput((prevMsg) => prevMsg + e.emoji)
              }
            />
          ) : (
            <></>
          )}
        </>
      );
    }
    return (
      <div className="def-ChatScreen">select friend and enjoy conversation</div>
    );
  };
  return <div>{renderChatWindow()}</div>;
};

export default ChatWindow;
