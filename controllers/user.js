const db = require("../models"); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PSWD
    }
})

exports.login = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {email: req.body.email},
    });    
  if (user === null) {
    return res.status(401).json({ error: "Connexion impossible, merci de vérifier votre login" });
    } else {
      const hashed = await bcrypt.compare(req.body.password, user.password);
      if (!hashed) {
        return res.status(401).json({ error: "Le mot de passe est incorrect !" });
      } else {
        const { email } = req.body;
        this.otpCode = Math.floor(100000 + Math.random() * 900000);
        const expires = new Date(Date.now() + 5*60*1000);
        user.otp = this.otpCode;
        user.otpcreated = Date.now();
        user.otpexpires = expires;
        await user.save({ fields: ["otp", "otpcreated", "otpexpires"],});
          const mailOptions = {
          from: process.env.MAIL_ACCOUNT,
          to: email,
          subject: "OTP",
          text: `Ton code OTP : ${this.otpCode}.`,
        };
        transporter.sendMail(mailOptions, (error, _info) => {
          if (error) {
            res.status(500).send({ message: 'Le code otp n\'a pas pu être envoyé' });
          } else {
            res.status(200).send({ message: 'Code OTP envoyé' });
          }
        });
      } 
    } 
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.verifyotp = async (req, res, next) => {
  const user = await db.User.findOne({ where: {email: req.body.email}, });
  const thisotp = await db.User.findOne({
    attributes: ["otp", "otpcreated", "otpexpires"], 
    where: {email: req.body.email}, 
    raw: true,
  });
  const thisotpverify = thisotp.otp;
  const thisotpexpires = thisotp.otpexpires;
  const dateotp = new Date(thisotpexpires)
  const datenowtocompare = dateotp.getTime();
  const datenow = Date.now();  
  const { otp } = req.body;
  if (otp === thisotpverify && otp!=0 && datenowtocompare > datenow) {
    res.status(200).json({
      message: "Vous êtes connecté !",
      username: user.username,
      email: user.email,
      userId: user.id,
      token: jwt.sign({userId: user.id}, process.env.TOKEN, {expiresIn: '24h'}),
  })
  } else {
    res.status(401).send({ message: 'Code OTP Invalide' });
  }
};