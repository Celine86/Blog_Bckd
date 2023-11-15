const express = require('express'); 
const router = express.Router();
const ctrl = require("../controllers/user");

router.post("/login", ctrl.login);
router.post("/verify", ctrl.verifyotp );

module.exports = router;