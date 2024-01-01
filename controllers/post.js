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
        if(!req.body.title || !req.body.content){
            res.status(403).json({ message: messages.POST_ADDMISSINGTITLEORCONTENT });
        } else {
            const myPost = await db.Post.create({
                title: cxss(req.body.title),
                content: cxss(req.body.content),
                createdBy: user.username,
                UserId: userId,
            }); 
            res.status(200).json({ post: myPost, message: messages.POST_ADDOK });
        }
    } catch (error) {
        return res.status(500).json({ error: messages.SERVEUR_ERROR });
    }
};

// MODIFIER UN POST
exports.modifyPost = async (req, res, next) => {
    try {
        const thisPost = await db.Post.findOne({ where: { id: req.params.id } });
            if (req.body.title) {
                thisPost.title = cxss(req.body.title);
            }
            if (req.body.content) {
                thisPost.content = cxss(req.body.content);
            }
            const newPost = await thisPost.save({
                fields: ["title", "content"],
            });
            res.status(200).json({ newPost: newPost, message: messages.POST_MODIFIED });
    } catch (error) {
        return res.status(500).json({ error: messages.SERVEUR_ERROR });
    }
};

// ARCHIVER UN POST
exports.archivePost = async (req, res, next) => {
    try {
        const thisPost = await db.Post.findOne({ where: { id: req.params.id } });
            if(thisPost.isArchived === false) {
                thisPost.isArchived = true;
                const newPost = await thisPost.save({ 
                    fields: ["isArchived"],
                });
                res.status(200).json({ newPost: newPost, message: messages.POST_ARCHIVED });
            }
    } catch (error) {
        return res.status(500).json({ error: messages.SERVEUR_ERROR });
    }
};

// AFFICHER UN POST
exports.getOnePost = async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ 
            attributes: ["id", "title", "content"], 
            where: { [Op.and]: [{id: req.params.id}, { is_archived: 0 }] },
            include: [
                {model: db.User, attributes: ["username"]},
            ],
        }); 
        if (post){
            res.status(200).json(post);
        } else {
            res.status(200).json({ message: messages.POST_NOPOST });
        }
    } catch (error) {
        return res.status(500).json({ error: messages.SERVEUR_ERROR });
    }
};

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


