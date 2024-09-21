const express = require('express'); 
const router = express.Router();
const ctrl = require("../controllers/user");

router.post("/login", ctrl.login);
router.post("/verify", ctrl.verifyotp );
router.get("/loggedIn", ctrl.getUser);

module.exports = router;