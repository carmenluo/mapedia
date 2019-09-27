const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");

router.use(
  cookieSession({
    name: "user_id",
    keys: ["id"]
  })
);


module.exports = db => {
  router.post("/", (req, res) => {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    const values = [userEmail, userPassword];
    db.query(
      `
    SELECT *
    FROM users
    `
    )
      .then(data => {
        const users = data.rows;
        for (let user of users) {
          if (user.email === userEmail && bcrypt.compareSync(userPassword, user.password)) {
            req.session.user_id = user.id;
            let templateVars = {
              user: req.session.user_id
            }
          };
        }
        if (req.session.user_id) {
          res.render("homepage", { name: userEmail, user: req.session.user_id, error: '' });
          return;
        } else {
          res.render("homepage", { name: '', user: '', error: "Please check email or password" });
        }
      })

      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};

