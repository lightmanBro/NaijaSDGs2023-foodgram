const express = require('express');
const hbs = require('hbs');
const path = require('path');
const Post = require('../model/posts');
const multer = require('multer');
const sharp = require('sharp');//Resizing of photo
const auth = require('../middleware/auth');
const route = express.Router();


// This will serve as the dashboard where all posts will be displayed
route.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        // res.status(200).json(posts);
        res.render('dashboard')
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


// Create a media post
route.post('/posts/createandupload', auth, upload.single('upload'), async (req, res) => {
    // console.log(req.body, req.file.buffer);
    req.file.buffer ? req.file.buffer : undefined
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() || '';

    const posts = new Post({ ...req.body, owner: req.user.id, file: buffer });

    try {
        await posts.save();
        console.log(posts);
        res.status(200).send(posts);
    } catch (err) {
        res.send(err);
    }
});

//Create a text post
route.post('/posts/create', auth, async (req, res) => {
    const posts = new Post({ ...req.body, owner: req.user.id });
    try {
        await posts.save();
        console.log(posts);
        res.status(200).send(posts);
    } catch (err) {
        res.send(err);
    }
});


//View posts on click
route.get('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const post = await Post.findOne({ _id })
        if (!post) { return res.status(404).send('Not available anymore') }
        res.status(200).send({ post })
    } catch (e) { res.status(404).send }
})

//Edit posts
route.patch('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id;

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

//Delete posts
route.delete('/posts/:id', auth, async (req, res) => {
    try {
        const post = await Order.findByIdAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!post) {
            return res.status(404).send("Post not found or invalid id")
        }
        res.status(200).send(post);
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//Working Perfectly
//List orders associated to a post
route.get('/postsorders/:id', auth, async (req, res) => {
    const id = req.params.id
    const posts = await Post.findById(id);
    try {
        await posts.populate('orders');
        res.status(200).send(posts.orders)
    } catch (err) {
        res.status(404).send(err);
    }
})
module.exports = route;