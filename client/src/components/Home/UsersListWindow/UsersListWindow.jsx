import "./UsersListWindow.css";

import { useContext, useState } from "react";
import { MyInfoContext } from "../../../context/MyInfoProvider";
import { commonApi } from "../../../api/common";
import { toast } from "react-toastify";
import Avatar from "react-avatar";
const UsersListWindow = ({
  allUsers,
  friendList,
  friendListError,
  receivedRequest,
  addFriend,
  removeRequest,
  setUserOnChat,
  onVideoCall
}) => {
  const [optionSelected, setOptionSelected] = useState("friends");

  const { myInfo,getMyInfo } = useContext(MyInfoContext);

  if (allUsers && myInfo) {
    allUsers = allUsers.filter((user) => user._id != myInfo._id);
  }
  // method for sendFriendRequest
  const sendFriendRequest = async (friendId) => {
    try {
      const res = await commonApi("post", "/user/FriendRequest", {
        userId: myInfo._id,
        friendId: friendId,
      });
      if (res.status === 200) {
        return toast.success(res.data + " : " + res.status);
        
      }
      toast.info(res.data + " : " + res.status);
    } catch (error) {
      toast.error(error.res.data + " : " + error.res.status);
    }
    
  };


  const onClickLogout = async () => {
    try {
      // const res = await commonApi("post", "/user/logout");
      // if (res.status == 200) {
      //     window.location.reload()
      //   // toast.success(res.data);
      //   // await getMyInfo();
      // }

      // localStorage.setItem('conversifyUserInfo',null)
      localStorage.removeItem("conversifyUserInfo");
      window.location.reload()
      // await getMyInfo()
      
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };


  //method for renderAll Users
  const renderAllUsers = () => {
    if (allUsers) {

      


      return allUsers.map((user, index) => {
        const checkFriendInList = friendList.length >0 && friendList.filter((user)=>user.friendID._id === user._id )
        if(checkFriendInList){
          return<></>
        }
        
        return (
          <li key={index}>
            <div>
              {/* <img src={img1} alt="profile pic" /> */}
              <Avatar name={user.name} size="45" round={true} />
              <div>
                <span>{user.name}</span>
               
              </div>
            </div>
            <div>
              <i
                class="bi bi-person-plus-fill"
                title="Add friend"
                onClick={() => sendFriendRequest(user._id)}
              ></i>
            </div>
          </li>
        );
      });
    } else {
      return <span>Loading...</span>;
    }
  };

  // method for render friends
  const renderFriends = () => {
    if (!friendList && !friendListError) {
      return <>Loading</>;
    }
    if (friendList) {
      if (friendList.length == 0) {
        return <>You have no friends.</>;
      }

      return friendList.map((user, index) => {
        return (
          <li key={index} onClick={() => setUserOnChat(user.friendID)}>
            <div>
              {/* <img src={img1} alt="profile pic" /> */}
              <Avatar name={user.friendID.name} size="45" round={true} />
              <div>
                <span>{user.friendID.name}</span>
                
              </div>
            </div>
            <div>
              <i class="bi bi-camera-video" title="Video call" onClick={()=>onVideoCall(user.friendID.email,user.friendID.name)}></i>
            </div>
          </li>
        );
      });
    }
    if (friendListError) {
      return <>Try again later.</>;
    }
  };

  // method for render requets
  const renderRequests = () => {
    if (receivedRequest.length == 0) {
      return <>No request available.</>;
    }
    if (receivedRequest.length != 0) {
      return receivedRequest.map((user, index) => {
        return (
          <li key={index}>
            <div>
              {/* <img src={img1} alt="profile pic" /> */}

              <Avatar name={user.name} size="45" round={true} />
              <div>
                <span>{user.name}</span>
              </div>
            </div>
            <div>
              <button onClick={() => addFriend(user._id)}>accept</button>
              <button onClick={() => removeRequest(user._id)}>remove</button>
            </div>
          </li>
        );
      });
    } else {
      return <span>Loading...</span>;
    }
  };

  // method for coditionaly render list
  const renderList = () => {
    if (optionSelected === "all") {
      return renderAllUsers();
    } else  if (optionSelected === "friends") {
      return renderFriends();
    } else if (optionSelected === "requets") {
      return renderRequests();
    }
  };
  return (
    <div className="UserListWindow-container">
      {/* <div className="search-user-input-container">

      <form className="search-user-input">
        <input type="search" placeholder="Search users and groups here..." />
      </form>
      </div> */}
      {/* <h1>Friends list</h1> */}
      <div className="logout">
      <button onClick={()=>onClickLogout()}>Log out</button>
      </div>
      <div className="UserList-option">
        {/* <div
          className={
            optionSelected === "friends" ? "UserList-option-selected" : ""
          }
          onClick={() => setOptionSelected("friends")}
        >
          Friends
        </div> */}
        <div
          className={
            optionSelected === "all" ? "UserList-option-selected" : ""
          }
          onClick={() => setOptionSelected("all")}
        >
          All
        </div>
        <div
          className={
            optionSelected === "friends" ? "UserList-option-selected" : ""
          }
          onClick={() => setOptionSelected("friends")}
        >
          Friends
        </div>
        {/* <div
          className={
            optionSelected === "groups" ? "UserList-option-selected" : ""
          }
          onClick={() => setOptionSelected("groups")}
        >
          Groups
        </div> */}
        <div
          className={
            optionSelected === "requets" ? "UserList-option-selected" : ""
          }
          onClick={() => setOptionSelected("requets")}
        >
          Requests
        </div>
      </div>
      <ul className="UserListWindow-ul">{renderList()}</ul>
    </div>
  );
};

export default UsersListWindow;
