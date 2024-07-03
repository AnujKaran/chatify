const userModels = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const JWT_KEY = "123456789";
// method for signUp user
const signUpUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(401).send("Invalid credentials");
    }
    // checking User existence
    const UserExit = await userModels.findOne({ email });
    if (UserExit) return res.status(409).send("Email already exists");

    const user = await userModels.create({
      name: name,
      email: email,
      password: password,
    });

    if (!user) {
      return res.status(400).send("User creating Un-Successfully");
    }
    return res.status(200).send("Successfully sign-up");
  } catch (error) {
    console.log(error.message);
    return res.status(502).send("Internal server error :(");
  }
};

//metod for login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
     return res.status(401).send("Unavailable credentials");
    }
    const user = await userModels.findOne({ email: email });

    // checking user exits in database
    if (!user) {
      return res.status(401).send("Invalid email");
    }
    // matching password from the database
    if (!(user.password === password)) {
      return res.status(400).send("Incorrect password");
    }

    // creating cookie for the for login +

    const token = jwt.sign({ payload: user["_id"] }, JWT_KEY);
    return res
      .cookie("ConversifyLogin", token)
      .status(200)
      .send("Login Succesfully");
  } catch (error) {
   
    return res.status(502).send("Internal server error :(");
  }

 
};
const logoutUser = async(req,res)=>{
  
  try {
    return res.cookie("ConversifyLogin"," ").status(200).send("Logout successfully");
  } catch (error) {
    console.log(error)
   return res.status(502).send("Internal server error :(");
   
  }
 }
module.exports = { signUpUser, loginUser , logoutUser};
