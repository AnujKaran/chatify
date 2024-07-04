import { toast } from "react-toastify";
import { commonApi } from "../api/common";

const { createContext, useState } = require("react");

const MyInfoContext = createContext();

const MyInfoProvider = ({ children }) => {
  const [myInfo, setMyInfo] = useState(null);
  const [myInfoError, setMyInfoError] = useState(null);

  const getMyInfo = async () => {
    console.log(document.cookie)
    try {
     
      const res = await commonApi("post", "/user/Info");
      if (res.status == 200) {
        setMyInfo(res.data);
        setMyInfoError(null);
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
         setMyInfoError(error.response.status);
        
      }
      else{

        setMyInfoError(502);
        return toast.error("Network failed");
      }
     
      
    }
  };

  return (
    <MyInfoContext.Provider value={{ myInfo, getMyInfo, myInfoError }}>
      {children}
    </MyInfoContext.Provider>
  );
};

export { MyInfoContext, MyInfoProvider };
