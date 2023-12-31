const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const imageCtrl = require("../controllers/image");


router.post("/create", auth.signin, multer, imageCtrl.addImage);
router.get("/allimages", auth.signin, imageCtrl.getAllImages);
router.get("/:id", imageCtrl.getOneImage)

module.exports = router;