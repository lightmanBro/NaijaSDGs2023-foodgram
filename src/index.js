require('./db/mongodb')
const express = require('express')
const app = express()
const multer = require('multer');
require('dotenv').config()


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
const errorMiddleware = (req, res, next) =>{
    throw new Error('Error from mddleware')
}


app.post('/upload',upload.single('images'),(req, res) => {res.send(200)},(err, req, res,next) =>{
res.status(400).send({error: err.message});
});


const taskRoute = require('./route/task')
const userRoute = require('./route/user');

const PORT = process.env.PORT;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(PORT,()=>console.log(`server listening on ${PORT}`));
