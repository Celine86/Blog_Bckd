const db = require("../models");
const bcrypt = require("bcrypt");
require('dotenv').config();

function firstUser(req, res) {
  db.User.findOne({ where: { username: process.env.FIRSTUSERUSERNAME } })
    .then((user) => {
      if (!user) {
        bcrypt.hash(process.env.FIRSTUSERPASSWORD, 10)
          .then((hash) => {
            db.User.create({
              username: process.env.FIRSTUSERUSERNAME,
              email: process.env.FIRSTUSEREMAIL,
              password: hash,
            })
              .then((account) => {
                console.log(`Le compte ${account.username} a été créé!`)
              })
              .catch((error) => { 
                console.log(error);
                res.status(400).json({ error });
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ error });
          });
      } else {
        console.log("le compte existe déjà");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
module.exports = firstUser();