// await axios.post('http://localhost:4000', inputData);

import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Axios = axios.create({
    
    withCredentials: true,
});



 const BASE_URL = process.env.REACT_APP_BACKEND_URL;
 
 

const customConfig = (method,route,data)=>{
    const config = {
        method: `${method}`,
        url: `${BASE_URL}${route}`,
        data:{...data,id:localStorage.getItem('conversifyUserInfo')?(JSON.parse(localStorage.getItem('conversifyUserInfo')))._id : null}
        
        // Content-Type:"application/json
    }
    console.log(localStorage.getItem('conversifyUserInfo')?(JSON.parse(localStorage.getItem('conversifyUserInfo')))._id:null)
    return config;
}
 export const commonApi = async (m,r,d)=>await Axios(customConfig(m,r,d));