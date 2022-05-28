var express = require("express");
var router = express.Router();
const methods = require("../methods");
const User = require("../models/user");

//rutas
const homeRoute = "../views/pages/home";
const loginRoute = "../views/pages/login";
const registerRoute = "../views/pages/register";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//home page route
router.get("/home", function (req, res) {
  if (req.user) {
    res.render(homeRoute, { title: "Home Page", userName: req.user.fullName });
  } else {
    res.render(loginRoute, {
      message: "Please log in to continue",
      messageClass: "alert-danger",
    });
  }
});

//register routes

router.get("/register", (req, res) => {
  res.render(registerRoute);
});

router.post("/register", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    //verificar si las contraseñas coinciden
    if (password === confirmPassword) {
      user = await User.findOne({ email: email }).then((user) => {
        if (user) {
          res.render(registerRoute, {
            message: "The user is already registered",
            messageClass: "alert-danger",
          });
        } else {
          const hashedPassword = methods.getHashedPassword(password);
          const userDB = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
          });
          userDB.save();

          res.render(loginRoute, {
            message: "The register has been completed successfully",
            messageClass: "alert-success",
          });
        }
      });
    } else {
      res.render(registerRoute, {
        message: "Passwords do not match",
        messageClass: "alert-danger",
      });
    }
  } catch (error) {
    console.log("error", error);
  }
});


//login routes

router.get("/login", (req, res) => {
  res.render(loginRoute);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = methods.getHashedPassword(password);

  user = await User.findOne({ email: email, password: hashedPassword }).then(
    (user) => {
      if (user) {
        const authToken = methods.generateAuthToken();

        //almacenar el token de autenticacion
        methods.authTokens[authToken] = user;
        //guardar el token en una cookie
        res.cookie("AuthToken", authToken);
        res.redirect("/home");
      } else {
        res.render(loginRoute, {
          message: "The username or password is invalid",
          messageClass: "alert-danger",
        });
      }
    }
  );
});

//logout
router.get('/logout', (req, res) => {
  res.clearCookie('AuthToken');
  return res.redirect('/login')
});

module.exports = router;
