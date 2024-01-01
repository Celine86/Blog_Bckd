const db = require("../models"); 
const auth = require("../middleware/auth");
const cxss = require("c-xss");
const messages = require('../messages');

// AJOUT d'UNE IMAGE
exports.addImage = async (req, res, next) => {
    try {
        let imageUrl = "";
        const userId = auth.getUserID(req);
        const user = await db.User.findOne({ where: { id: userId } });
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            const myImage = await db.Image.create({
                UserId: user.id,
                imageUrl: imageUrl,
                imageTitle: cxss(req.body.title),
            }); 
            res.status(200).json({ myImage: myImage.imageUrl, message: messages.IMAGE_IMAGEADDED });
        } else {
            res.status(403).json({ message: messages.IMAGE_PLEASEADD });
        }
    } catch (error) {
        return error
    }
};

// AFFICHER TOUTES LES IMAGES
exports.getAllImages = async (req,res, next) => {
    try {
        const allImages = await db.Image.findAll({ attributes: ["id", "imageUrl", "imageTitle"], 
        order: [ ['id', 'ASC'],],
    })
        res.status(200).json({ allImages });
    }
    catch (error) {
        return error
    }
};

// AFFICHER UNE IMAGE
exports.getOneImage = async (req,res, next) => {
    try {
        const image = await db.Image.findOne({ attributes: ["id", "imageUrl", "imageTitle"], 
        where: { id: req.params.id } 
    })
        res.status(200).json({ image });
    }
    catch (error) {
        return error
    }
};