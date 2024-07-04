import axios from "axios";
import { useState } from "react";
import { commonApi } from "../../api/common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setFormType }) => {
  const [loginInfo, setLoginInfo] = useState({});
  const navigate = useNavigate();
  const handelInputLogin = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };
  const onLogin = async (e) => {
    
    e.preventDefault();
    if(loginInfo.email.length<1 || loginInfo.password.length < 1){
    return toast.warning("All fields are required for log-in")
    }
    if(loginInfo.password.length < 6){
      return toast.warning("password should be greater then 6 characters")
    }
    try {
      const res = await commonApi("post", "/login", loginInfo);
      console.log(res)
      if (res.status === 200) {
        localStorage.setItem('conversifyUserInfo', JSON.stringify(res.data));
        if(localStorage.getItem('conversifyUserInfo')){

          navigate("/");
        }
        // toast.success(res.data + " : " + res.status);
      }
    } catch (error) {
      console.log(error)
      if(error.response){
        toast.error(error.response.data);

      }
      else{
        toast.error("something went wrong");
      }
      
    }
  };

  const [passType,setPasstype] = useState('password')
  return (
    <>
      <form className="Auth-container-form" onSubmit={(e) => onLogin(e)}>
        <label>Login</label>

        <input
          type="email"
          placeholder="Enter email"
          name="email"
          onChange={(e) => handelInputLogin(e)}
          required
        />
        <div className="form-group">

        <input
          type={passType}
          placeholder="Enter password"
          name="password"
          onChange={(e) => handelInputLogin(e)}
          value={loginInfo.password ? loginInfo.password : ""}
          required
          minLength={6}
          
          />{
            passType==="password"? <i class="bi bi-eye-fill" onClick={()=>setPasstype('text')}></i>:<i class="bi bi-eye-slash-fill" onClick={()=>setPasstype('password')}></i>
          }
          </div>

        <button type="submit">Login</button>
        <span onClick={() => setFormType("signup")}>Create new account?</span>
      </form>
    </>
  );
};

export default LoginForm;
