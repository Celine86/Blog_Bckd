const express = require('express');
const router = express.Router();
const postCtrl = require("../controllers/post");
const auth = require('../middleware/auth');

router.post("/create", auth.signin, postCtrl.createPost);
router.put("/modify/:id", auth.signin, postCtrl.modifyPost);
router.put("/archive/:id", auth.signin, postCtrl.archivePost);
router.get("/all", postCtrl.getAllPosts);
router.get("/:id", postCtrl.getOnePost);


module.exports = router;