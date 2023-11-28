const mongoose = require('mongoose');
const validator = require('validator');// Validator for validating input values
const bcrypt = require('bcrypt');// Password encryption
const jwt = require('jsonwebtoken'); // web token for authentication
const Order = require('./order')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }, email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        },
    },
    age: {
        type: Number,
        required: true,
        validate() {
            if (this.age < 18) {
                throw new Error('Age must be greater than 18')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6 || value.toLowerCase().includes('password')) {
                throw new Error('Password must be at least 6 characters or password contain the word Password');
            }
        }
    },
    tokens: [{ token: { type: String, required: true } }],
    avatar: { type: Buffer }
},
    {
        timestamps: true
    })

//Virtual method to connect the user to the tasks its created on another table so the task can be loaded as an array.
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'owner'
})

// Turning the data to string and excluding specific fields.
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.__v;
    delete userObject.avatar;
    return userObject;
}


//Generate a unique token for individual user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thistokensecretkey');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

// this function is attached to the user model itself because its a static method;
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}

// Method to be called when a password change happens
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        //    const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

//To delete all the tasks of a user when the user delete own account
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema);

module.exports = User;