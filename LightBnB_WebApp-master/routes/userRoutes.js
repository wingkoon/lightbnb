const express = require("express");
const bcrypt = require("bcrypt");
const database = require("../db/database");
const cookieSession = require("cookie-session");

const router = express.Router();

// Create a new user
router.post("/", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 12);
  database
    .addUser(user)
    .then((user) => {
      if (!user) {
        return res.send({ error: "error" });
      }

      req.session.userId = user.id;
      cookieSession.id = user.id;
      res.send("🤗");
    })
    .catch((e) => res.send(e));
});

// Log a user in
const login =  function(email, password) {
  return database.getUserWithEmail(email)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
};
exports.login = login;
      
router.post('/login', (req, res) => {
  const {email, password} = req.body;
  login(email, password)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = user.id;
      cookieSession.id = user.id;
      res.send({user: {name: user.name, email: user.email, id: user.id}});
    })
    .catch(e => res.send(e));
});

// Log a user out
router.post("/logout", (req, res) => {
  req.session.userId = null;
  cookieSession.id = null;
  cookieSession.name = null;
  res.send({});
});

// Return information about the current user (based on cookie value)
router.get("/me", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.send({message: "not logged in"});
    return;
  }

  database.getUserWithId(userId)
    .then(user => {
      if (!user) {
        res.send({error: "no user with that id"});
        return;
      }
  
      res.send({user: {name: user.name, email: user.email, id: userId}});
    })
    .catch(e => res.send(e));

});

module.exports = router;
