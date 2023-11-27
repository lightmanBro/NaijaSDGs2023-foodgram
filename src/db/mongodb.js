const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect('mongodb://127.0.0.1:27017/foodgram')
//mongoose.connect(
//`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kbq2c9d.mongodb.net/foodgram?retryWrites=true&w=majority`
//).then(()=> console.log('connected to cluster')).catch((err)=> console.log(err.message))

//const task = new Task({description:'Learn Spring Boot',completed:false});
//task.save().then(()=>{console.log('Task saved')}).catch(err=>{console.log('error saving task')})
