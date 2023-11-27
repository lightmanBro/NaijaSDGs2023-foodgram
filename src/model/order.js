const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    description:
    {
        type: String,
        required: true
    },
    completed:
    {
        type: Boolean,
        required: true,
        default: false
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