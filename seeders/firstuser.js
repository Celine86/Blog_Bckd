const db = require("../models");
const bcrypt = require("bcrypt");
require('dotenv').config();

function firstUser(req, res) {
  db.User.findOne({ where: { username: process.env.FIRSTUSERUSERNAME } })
    .then((user) => {
      if (!user) {
          let pswdFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/
          let pswd = process.env.FIRSTUSERPASSWORD
          if(pswd !== '' && pswd.match(pswdFormat)) {
            bcrypt.hash(pswd, 10)
            .then((hash) => {
              db.User.create({
                username: process.env.FIRSTUSERUSERNAME,
                email: process.env.FIRSTUSEREMAIL,
                password: hash,
              })
                .then((account) => {
                  console.log(`Le compte ${account.username} a été créé!`)
                  db.Post.create({
                    title: "First Post",
                    content: "First Post Content",
                    createdBy: account.username,
                    UserId: account.id
                  })
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
          }
          else{
              console.log('Le mot de passe doit contenir au moins 12 caractères avec une majuscule, une minuscule, un chiffre et un caractère spécial');
          }
      } else {
        console.log("le compte existe déjà");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
module.exports = firstUser();