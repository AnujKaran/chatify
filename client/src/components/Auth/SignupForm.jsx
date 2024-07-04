import { toast } from "react-toastify";
import { commonApi } from "../../api/common";
import { useState } from "react";

const SignupForm = ({ setFormType }) => {
  const [signUpInfo, setSignUpInfo] = useState({});
  const onSingUp = async (e) => {
    e.preventDefault();
    if(signUpInfo.password !== signUpInfo.confirmPassword){
      return toast.warning("current password and password should be same")
    }
    try {
      const res = await commonApi("post", "/signup", signUpInfo);
      if (res.status == 200) {
        toast.success(res.data);
        toast.info("Login to continue");
        setFormType("login");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("something went wrong");
      }
    }
  };
  const [passType, setPasstype] = useState("Password");
  const handelInputSingUp = (e) => {
    const { name, value } = e.target;
    setSignUpInfo({ ...signUpInfo, [name]: value });
  };

  return (
    <>
      <form className="Auth-container-form" onSubmit={(e) => onSingUp(e)}>
        <label>Create Account</label>
        <input
          type="text"
          placeholder="Enter name"
          name="name"
          onChange={(e) => handelInputSingUp(e)}
          required
        />
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          onChange={(e) => handelInputSingUp(e)}
          required
        />
        <div className="form-group">
          <input
            type={passType}
            placeholder="Enter password"
            name="password"
            onChange={(e) => handelInputSingUp(e)}
            required
            minLength={6}
          />
          {passType === "password" ? (
            <i class="bi bi-eye-fill" onClick={() => setPasstype("text")}></i>
          ) : (
            <i
              class="bi bi-eye-slash-fill"
              onClick={() => setPasstype("password")}
            ></i>
          )}
        </div>
        <input
          type="text"
          placeholder="Enter confirm password"
          name="confirmPassword"
          onChange={(e) => handelInputSingUp(e)}
          required
          minLength={6}
        />
        <button type="submit">Sign up</button>
        <span onClick={() => setFormType("login")}>
          Already have an account!
        </span>
      </form>
    </>
  );
};

export default SignupForm;
