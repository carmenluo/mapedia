const express = require("express");
const router = express.Router();
// const cookieSession = require('cookie-session');

// router.use(cookieSession({
//   name: 'user_id',
//   keys: ['id']
// }));

module.exports = db => {
  router.post("/", (req, res) => {
    res.clearCookie('user_id');
    res.clearCookie('user_id.sig');
    res.redirect("/");

    db.query(
    `

    `,
      values
    )
      .then(data => { })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
