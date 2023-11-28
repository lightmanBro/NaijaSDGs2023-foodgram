const express = require('express')
const Post = require('../model/posts');
const multer = require('multer');
const sharp = require('sharp');//Resizing of photo
const auth = require('../middleware/auth');
const route = express.Router();

route.get('/posts',async (req, res) => {
	try{
		const posts = await Post.find();
		res.status(200).json(posts)
	}catch(err){
		res.send(err);
	}
})


const upload = multer({
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mov|webm)$/)) {
            return cb(new Error('Please upload a valid image or video'))
        }
        cb(null, true);
    }
});

route.post('/posts/create', auth, async (req, res) => {
    console.log(req.body,req.user.id)
    let filename;
    try {


        const posts = new Post({ ...req.body, owner: req.user.id});
        await posts.save();
        console.log(posts);
        res.status(200).send(posts);
    } catch (err) {
        res.send(err);
    }
});

async function compressVideo(videoBuffer) {
    // Use ffmpeg to compress the video
    // See https://github.com/ffmpegwasm/ffmpeg.wasm for more information
    // on using ffmpeg in JavaScript
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.mp4', videoBuffer);
    await ffmpeg.run('-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '28', '-preset', 'slow', '-y', 'output.mp4');
    const compressedVideo = ffmpeg.FS('readFile', 'output.mp4');
    return compressedVideo;
}

async function compressImage(imageBuffer) {
    // Use canvas and DataTransfer to compress the image
    // See https://pqina.nl/blog/compress-image-before-upload/ for more information
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = URL.createObjectURL(new Blob([imageBuffer]));
    await new Promise((resolve) => {
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.7);
        };
    });
    const compressedImage = await new Response(canvas.toDataURL()).arrayBuffer();
    return compressedImage;
}



route.get('/posts/:id',auth,async (req, res) => {
	const _id = req.params.id
	try{
		const post = await Post.findOne({ _id })
		if(!posts){return res.status(404).send('Not available anymore')}
		res.status(200).send({ post})
	}catch(e){res.status(404).send}
})

route.patch('/posts/:id',auth,async (req, res) =>{
	const _id = req.params.id;
	console.log(req.params.id,req.user.id)
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','orderAvailable','orderLeft'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
	if(!isValidOperation){ return res.status(400).send("Invalid updates") };
    try{
        const order = await Post.findOne({ _id:req.params.id, owner:req.user.id});
        if(!order){
        return res.status(404).send("Task not found or invalid id")
        }
        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();
        res.send(task);

    }catch(err){ res.status(400).send(err.message) }
    })

module.exports = route;