const userModels = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const LoginChecker = async (req, res, next) => {
  // ishme abhi undefine cookie checker solve karna ha req.cookie par

  if (!req.headers.cookie) {
    return res.status(401).send("Cookies not found");
  }

  // console.log(req.header.cookies)
  //   console.log(req.headers.cookie.ConversifyLogin);
  const cookies = {};
  req.headers.cookie.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0].trim();
    const value = parts[1].trim();
    cookies[name] = value;
  });
  //   console.log(cookies)
  try {
    // const token = cookies.ConversifyLogin;
    if (!cookies.ConversifyLogin) {
      return res.status(401).send("Cookies not foundaljhdhsldh");
    }

    const token = jwt.verify(cookies.ConversifyLogin, "123456789");
    const payload = token.payload;

    let user = await userModels.findById(payload);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.id = user["_id"];
    next();
  } catch (error) {
    return res.status(502).send("Internal server error");
  }
};

module.exports = { LoginChecker };
