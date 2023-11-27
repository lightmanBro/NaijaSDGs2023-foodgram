const express = require('express');
const route = express.Router();
const User = require('../model/user');
const auth = require('../middleware/auth');
const multer = require('multer');// Uploading files
const sharp = require('sharp');//Resizing of photo
const mailer = require('../mailer/mail');// Sending mail


route.post('/users',async (req, res) => {
    const {name,email,password,age} = req.body;
    const user = await new User({name,email,password,age});
    const token = await user.generateAuthToken();
    //Call the mailer function and pass the needed parameters;
    // pass in the email, subject and message as text or html string.
//    mailer({})
    res.send({ user,token });
    try{
        await user.save();
    }catch(err){
        console.log(err)
    }
 });

route.post('/users/login', async (req,res)=> {
    const { email, password } = req.body;
    try{
        const user = await User.findByCredentials( email, password );
        const token = await user.generateAuthToken();
        res.send({ user ,token });

    }catch(err){
        res.status(400).send(err);
    }

})

route.post('/users/logout',auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token !== req.token
        });
        await req.user.save();
        res.send(req.user.tokens);

    }catch(err){
        res.status(500).send(err)
    }
})

route.post('/users/logoutAll',auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send("You have logged out from all active sessions");
    }catch(err){
        res.status(500).send(err)
    }
})

route.get('/users/me',auth,async (req, res)=>{
    try{
        res.send(req.user);
    }catch(e){
        res.status(401).send(e.message);
    }
  })

//Uploading and filtering file based on type.
const upload = multer({
    limits: { fileSize:1000000 },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a valid image'))
        }
        cb(null,true); }
    })
//Passed in many middleware to be run before the final upload is done.
route.post('/users/me/avatar',auth,upload.single('avatar'),async (req, res)=>{
    //Using sharp to compress and modify the image.
    const buffer =await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
            // save the file as an array buffer file type.
            req.user.avatar = buffer;
            await req.user.save();
    res.send('Avatar is uploaded successfully');
},(err, req, res,next) =>{
    //Error handling middleware.
    res.status(400).send({error: err.message});
  })


route.patch('/users/me', auth ,async (req, res) =>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation){ return res.status(400).send("Invalid updates") };
    try{
        updates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }catch(err){
        res.status(400).send(err.message);
    }
});

route.delete('/users/me',auth,async (req, res)=>{
    const _id = req.user._id;
    console.log(_id);
    try{
        const user = await User.findByIdAndDelete(_id);
    if(!user){
        return res.status(404).send("User not found or invalid id")
    }
        res.status(200).send(req.user);
    }catch(err){
        res.status(400).send(err.message);
    }
  })

route.delete('/users/me/avatar',auth, async (req, res)=>{
    try{
        req.user.avatar = null||undefined||"";
        await req.user.save();
        res.send()
    }catch(err){
        res.status(400).send(err.message);
    }
})

route.get('/user/:id/avatar', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            return res.status(404).send("User not found or invalid id")
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    }catch(err){
        res.status(400).send(err.message);
    }

})
module.exports = route;