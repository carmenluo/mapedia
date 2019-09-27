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
  router.get("/", (req, res) => {
    let user = null;
    if (req.session.user_id) {
      db.query(
        `
      SELECT email
      FROM users
      WHERE users.id = ${req.session.user_id}
      `
      ).then(data => {
        let userEmail = data.rows[0].email;
        let user = req.session.user_id;
        res.render("homepage", { name: userEmail, user: user, error: "" });
      });
    } else {
      res.render("homepage", { name: "", user: user, error: "" });
    }
  });

  router.get("/pins", (req, res) => {
    db.query(
      `
    SELECT *
    FROM pins;
    `
    )
      .then(data => {
        const pins = data.rows;
        console.log(pins);
        res.json({ data: pins });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/pinsCollection", (req, res) => {
    for (coord of req.body.data) {
      console.log("coord: ", coord);
      const values = [`${coord.lat}`, `${coord.lng}`, "2"];
      db.query(
        `
      INSERT INTO pins (latitude, longitude, map_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
        values
      ).then(res => {
        res.rows[0];
      });
    }
  });

  router.post("/getmap", (req, res) => {
    // console.log(req.body.data);
    let values = [`${req.body.data}`];
    db.query(
      `
    SELECT latitude, longitude, description
    FROM pins
    JOIN maps ON map_id = maps.id
    WHERE map_id = $1;
    `,
      values
    )
      .then(pins => {
        const coords = pins.rows;
        res.json({ coords });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  //like

  router.post("/likemap", (req, res) => {
    console.log(req.body.data);
    let values = [`${req.body.data}`];
    db.query(
      `
    UPDATE maps SET liked = liked + 1
    WHERE id = $1;
    `,
      values
    )
      .then(data => {
        //res.render("homepage", { user: req.session["user_id"], error: '' });
        values = [req.session.user_id, parseInt(req.body.data)];
        console.log(values);
        db.query(`
        INSERT into favorites (user_id, map_id)
        VALUES ($1, $2)
        RETURNING *;
        `, values).then(data => {
          res.json(data);
        })
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  //unlike

  router.post("/unlikemap", (req, res) => {
    console.log(req.body.data);
    let values = [`${req.body.data}`];
    db.query(
      `
  UPDATE maps SET liked = liked - 1
  WHERE id = $1;
  `,
      values
    )
      .then(data => {
        let map_id = parseInt(req.body.data);
        let values = [map_id, req.session.user_id];
        console.log(values);
        db.query(
          `
      DELETE from favorites 
      WHERE map_id = $1 and user_id = $2
      returning*;
      `, values).then(data => {
            res.json(data);
          })
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });

  });
  router.get("/checkliked", (req, res) => {
    let map_id = parseInt(req.query.data);
    let values = [map_id, req.session.user_id];
      db.query(
        `
    select id from favorites
    WHERE map_id = $1 and user_id = $2;
    `,
        values
      )
        .then(data => {
          res.json(data.rows.length);
  })
})
router.post("/showmap/:mapID", (req, res) => {
  let mapID = req.params.mapID;
  delete mapID;
  res.redirect("/");
});

router.get("/showmap/:mapID", (req, res) => {
  let mapID = req.params.mapID;

  let templateVars = { mapID };

  res.render("showmap", templateVars);
});

router.get("/newmap", (req, res) => {
  res.render("newmap", { data: [] });
});

router.post("/delete", (req, res) => {
  let mapIdDelete = req.body.delete;
  const values = [mapIdDelete]
  console.log('server: ', values);
  db.query(`
    DELETE FROM maps
    WHERE maps.id = $1;
    `, values)
    .then(data => {

    })
});

return router;
  };
