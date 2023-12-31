const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    
    orderName:{type:String},
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post'},
    poster: {type: String, required: true},
    unit:{type:Number, required:true},
    price:{type:Number, default:0, required:true},
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



orderSchema.pre('save', async function(next){
    try{
        const post = await mongoose.model('Post').findById(this.postId);
        if(post){
            this.orderName = post.description;
            const remainingOrder = post.orderAvailable - 1;
            post.orderLeft = remainingOrder;
            await post.save();
        }
    } catch(err){
        next(err);
    }
})

orderSchema.pre('remove', async function (next) {
    const post = await mongoose.model('Post').findById(this.postId);
    if(this.status === "active" || this.status === "pending")
    next()
})
const Order = new mongoose.model('Order', orderSchema)
module.exports = Order;

/*
Explanation
This order schema has description which is more like the title of the order the owner posted
the post id is for the specific post the order is made on.
the POSTER is the user that created the post.
the UNIT is the amount the user making the order wants to buy.
the PRICE is the price tag on the order post.
the STATUS is the current condition of the order.
the OWNER is the user that make created the order from the order post.
*/