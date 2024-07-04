import { useState } from "react";
import "./Auth.css";

import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

const Auth = () => {
  const [formType, setFormType] = useState('signup')

 
  return (
    <div className="auth-container">
      <div>
        <h1>Conversify</h1>
        {formType==='login'?<LoginForm setFormType={setFormType}/>:<SignupForm setFormType= {setFormType}/>} 

      </div>
    </div>
  );
};

export default Auth;
