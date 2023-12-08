const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    storeName:{type:String},
    description:
    {
        type: String,
        required: true
    },
    price:{type:Number,default:0},

    ingredients:[{type:String,required:true}],

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
});

postSchema.pre('save', async function (next) {
    try {
        const owner = await mongoose.model('User').findById(this.owner);
        if (owner) {
            this.storeName = owner.storeName;
        }
        next();
    } catch (error) {
        next(error);
    }
});

/*When another user orders from this users post, this user's id on the order will be saved on the poster id
so this user can get the order on its post by checking for any order that has its id as the poster id
*/
postSchema.virtual('orders',{//created a virtual array called orders
ref:'Order',// This is where to fetch the data that will be in the array from
localField: '_id', //Get the order id from the order
foreignField:'postId' // This is the key for finding this user's order from the array on the order table.
})
const Post = new mongoose.model('Post', postSchema)
module.exports = Post;