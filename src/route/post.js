const express = require('express');
const Post = require('../model/posts');
const multer = require('multer');
const sharp = require('sharp');//Resizing of photo
const auth = require('../middleware/auth');
const route = express.Router();

route.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts)
    } catch (err) {
        res.send(err);
    }
})


const upload = multer({
    // dest: 'uploads', this needs to be removed so the file can be seen as a buffer
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mov|webm)$/)) {
            return cb(new Error('Please upload a valid image or video'))
        }
        cb(null, true);
    }
});

route.post('/posts/create', auth, upload.single('upload'), async (req, res) => {
    console.log(req.body, req.file.buffer);
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
   
    const posts = new Post({ ...req.body, owner: req.user.id, file:buffer });

    try {
        await posts.save();
        console.log(posts);
        res.status(200).send(posts);
    } catch (err) {
        res.send(err);
    }
});



route.get('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const post = await Post.findOne({ _id })
        if (!posts) { return res.status(404).send('Not available anymore') }
        res.status(200).send({ post })
    } catch (e) { res.status(404).send }
})

route.patch('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id;
    console.log(req.params.id, req.user.id)
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'orderAvailable', 'orderLeft'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) { return res.status(400).send("Invalid updates") };
    try {
        const order = await Post.findOne({ _id: req.params.id, owner: req.user.id });
        if (!order) {
            return res.status(404).send("Task not found or invalid id")
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);

    } catch (err) { res.status(400).send(err.message) }
})

module.exports = route;