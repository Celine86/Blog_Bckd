const db = require("../models"); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const auth = require("../middleware/auth");
const { sendEmail } = require('../middleware/sendmail');
const messages = require('../messages');

exports.login = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {email: req.body.email},
    });    
  if (user === null) {
    return res.status(401).json({ error: messages.USER_CONNEXIONIMPOSSIBLE });
    } else {
      const hashed = await bcrypt.compare(req.body.password, user.password);
      if (!hashed) {
        return res.status(401).json({ error: messages.USER_MDPINCORRECT });
      } else {
        const { email } = req.body;
        this.otpCode = Math.floor(100000 + Math.random() * 900000);
        const expires = new Date(Date.now() + 30*60*1000);
        user.otp = this.otpCode;
        user.otpcreated = Date.now();
        user.otpexpires = expires;
        await user.save({ fields: ["otp", "otpcreated", "otpexpires"],});
        try {
          sendEmail(email, messages.OTP_TITLE, messages.OTP_MSG + this.otpCode);
          return res.status(200).send({ message: messages.OTP_SENDMAILMSG + email });
          } catch (error) {
            return res.status(500).json({ message: messages.OTP_NOTSENT });
          }
      } 
    } 
  } catch (error) {
    return res.status(500).json({ error: messages.SERVEUR_ERROR });
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
      message: messages.USER_CONNECTED,
      username: user.username,
      email: user.email,
      userId: user.id,
      token: jwt.sign({userId: user.id}, process.env.TOKEN, {expiresIn: '24h'}),
  })
  } else {
    res.status(401).json({ message: messages.OTP_INVALID });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = auth.getUserID(req);
    await db.User.findOne({ attributes: ["id", "username", "email"], where: { id: userId } });
    res.status(200).json({message : messages.USER_CONNECTED});
  } catch (error) {
    return res.status(500).json({ error: messages.SERVEUR_ERROR });
  }
};