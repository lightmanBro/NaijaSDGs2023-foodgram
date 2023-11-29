require('./db/mongodb')
const express = require('express')
const app = express()
const multer = require('multer');
require('dotenv').config()

const taskRoute = require('./route/order')
const userRoute = require('./route/user');
const postRoute = require('./route/post');
const Order = require('./model/order');
const Post = require('./model/posts');
const User = require('./model/user')
const PORT = process.env.PORT;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);
app.use(postRoute);

app.listen(PORT,()=>console.log(`server listening on ${PORT}`));

/*-----------------------------------------------------------------------------------------------------------------*/
//The populate method is used to create a relationship between the Owner of a post and the posts itself,
// more like getting the parent to children relationship
//This function is to find the owner of a post
// const main = async ()=>{
//     const post = await Post.findById('6565c213aacd4547026b7e15');
//     await post.populate('orders')
//     console.log(post.orders)
// }
// main()

//This function is to find the lists of orders made by a user.
const order = async ()=>{
    const posts = await Post.findById('6566df0c9e4f4e4d80db5bc2');
    await posts.populate('orders');
    console.log(posts.orders)
}

// order()

// Uploading a file using multer module. for info check the npm multer documentation.
const upload = multer({
    dest:'images',//if this is removed then express will pass it to another middleware so it can be saved in db.
    limits: {
        fileSize:1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload word document'))
        }
        cb(null,true);
    }
})

app.post('/upload',upload.single('images'),(req, res) => {res.send(200)},(err, req, res,next) =>{
res.status(400).send({error: err.message});
});
