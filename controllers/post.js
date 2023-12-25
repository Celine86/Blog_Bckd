const db = require("../models"); 
const { Op } = require("sequelize"); 
const auth = require("../middleware/auth")
const cxss = require("c-xss");
const messages = require('../messages');

// CREER UN POST
exports.createPost = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const user = await db.User.findOne({ where: { id: userId } });
        if(user !== null) { 
            if(!req.body.title || !req.body.content){
                res.status(403).json({ message: messages.POST_ADDMISSINGTITLEORCONTENT });
            } else {
                const myPost = await db.Post.create({
                    title: cxss(req.body.title),
                    content: cxss(req.body.content),
                    createdBy: user.username,
                    UserId: user.id,
                }); 
                res.status(200).json({ post: myPost, message: messages.POST_ADDOK });
            }
        }
        else {
            return res.status(403).json({ error: messages.POST_ADDNOK });
        }
    } catch (error) {
        return res.status(500).json({ error: messages.SERVEUR_ERROR });
    }
};

// MODIFIER UN POST


// ARCHIVER UN POST


// AFFICHER UN POST


// AFFICHER TOUS LES POSTS
exports.getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await db.Post.findAll({
            limit: 50, order: [["id", "DESC"]], 
            where: { is_archived: 0 },
            include: [
                {model: db.User, attributes: ["username"]},
            ],
        })
        res.status(200).json({ allPosts });
    } catch {
        return res.status(500).json({ error: messages.SERVEUR_ERROR });
    }
};


