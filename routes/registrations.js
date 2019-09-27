const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const cookieSession = require("cookie-session");

router.use(
  cookieSession({
    name: "user_id",
    keys: ["id"]
  })
);

//const app = express();

module.exports = db => {
  router.post("/", (req, res) => {
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 10);
    db.query(
      `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING *;
    `, [email, password])
      .then(user => {
        console.log(user.rows[0].id);
        req.session.user_id = user.rows[0].id;
       // res.json(users);
        // console.log('1');
        // db.query(
        // `
        // SELECT * 
        // FROM users
        // WHERE email = ${email}
        // `    
        // ).then(user =>{
        //   console.log(`2`);
        //   res.json(user);
        res.render("homepage", { name: user.rows[0].email, user: req.session.user_id, error: '' });
        // })
        // res.render("homepage", { name: userEmail, user: req.session.user_id, error: '' });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
