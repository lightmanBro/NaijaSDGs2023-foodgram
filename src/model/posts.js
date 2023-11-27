const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description:
    {
        type: String,
        required: true
    },
    price:{type:Number,default:0},
    file:{ type: Buffer },
    likes: {type:Number ,default:0 },
    orderAvailable: {type:Number, default:0},
    orderLeft: {type:Number,default:0},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})

const Task = new mongoose.model('Order', postSchema)
module.exports = Post;