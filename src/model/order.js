const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    description:
    {
        type: String,
        required: true
    },
    postId: {type: String, required: true},
    poster: {type: String, required: true},
    unit:{type:Number, required:true},
    price:{type:Number, default:0, required:true}
    status:
    {
        type: String,
        required: true,
       enum:['active','pending','completed','rejected'],
       default:'active'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})

const Task = new mongoose.model('Order', orderSchema)
module.exports = Order;

/*
Explanation


*/