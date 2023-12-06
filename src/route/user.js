const express = require('express');
const route = express.Router();
const User = require('../model/user');
const auth = require('../middleware/auth');
const multer = require('multer');// Uploading files
const sharp = require('sharp');//Resizing of photo
const mailer = require('../mailer/mail');// Sending mail


route.post('/users/register', async (req, res) => {
    const { name, email, password, age } = req.body;
    const user = await new User({ name, email, password, age });
    const token = await user.generateAuthToken();
    //Call the mailer function and pass the needed parameters;
    // pass in the email, subject and message as text or html string.
    //    mailer({})
    res.send({ user, token });
    try {
        await user.save();
    } catch (err) {
        console.log(err)
    }
});

route.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });

    } catch (err) {
        res.status(400).send(err);
    }

})

route.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        res.send(req.user.tokens);

    } catch (err) {
        res.status(500).send(err)
    }
})

route.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send("You have logged out from all active sessions");
    } catch (err) {
        res.status(500).send(err)
    }
})

route.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(401).send(e.message);
    }
})

//Uploading and filtering file based on type.
const upload = multer({
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image'))
        }
        cb(null, true);
    }
})
//Passed in many middleware to be run before the final upload is done.
route.post('/users/me/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
    //Using sharp to compress and modify the image.
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    // save the file as an array buffer file type.
    req.user.avatar = buffer;
    await req.user.save();
    res.send('Avatar is uploaded successfully');
}, (err, req, res, next) => {
    //Error handling middleware.
    res.status(400).send({ error: err.message });
})


route.patch('/users/me/update', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) { return res.status(400).send("Invalid updates") };
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

route.delete('/users/me/delete', auth, async (req, res) => {
    const _id = req.user._id;
    console.log(_id);
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).send("User not found or invalid id")
        }
        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

route.delete('/users/me/remove-avatar', auth, async (req, res) => {
    try {
        req.user.avatar = null || undefined || "";
        await req.user.save();
        res.send()
    } catch (err) {
        res.status(400).send(err.message);
    }
})

route.get('/users/:id/show-avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            return res.status(404).send("User not found or invalid id")
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (err) {
        res.status(400).send(err.message);
    }

})

// Your API endpoint for username suggestions
route.get('/users/suggestions', async (req, res) => {
    const query = req.query.query;

    try {
        // Find users whose usernames match the partial input
        const suggestions = await User.find({ username: { $regex: `^${query}`, $options: 'i' } }, 'username');

        res.json({ suggestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Endpoint to follow a user
route.post('/users/:userId/follow', async (req, res) => {
    const userId = req.params.userId;
    const followerId = req.body.followerId; // Assuming you send the follower's ID in the request body

    try {
        // Check if the user to be followed exists
        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the follower exists
        const follower = await User.findById(followerId);
        if (!follower) {
            return res.status(404).json({ error: 'Follower not found' });
        }

        // Check if the follower is not already following the user
        if (!userToFollow.followers.includes(followerId)) {
            // Add the follower to the user's followers array
            userToFollow.followers.push(followerId);
            await userToFollow.save();

            res.json({ message: 'User followed successfully' });
        } else {
            res.status(400).json({ error: 'User is already being followed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to unfollow a user
route.post('/users/:userId/unfollow', async (req, res) => {
    const userId = req.params.userId;
    const followerId = req.body.followerId;

    try {
        // Check if the user to be unfollowed exists
        const userToUnfollow = await User.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the follower exists
        const follower = await User.findById(followerId);
        if (!follower) {
            return res.status(404).json({ error: 'Follower not found' });
        }

        // Check if the follower is following the user
        if (userToUnfollow.followers.includes(followerId)) {
            // Remove the follower from the user's followers array
            userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== followerId);
            await userToUnfollow.save();

            res.json({ message: 'User unfollowed successfully' });
        } else {
            res.status(400).json({ error: 'User is not being followed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to fetch notifications
route.get('/users/:userId/notifications', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
      const unreadNotifications = user.notifications.filter((notification) => notification.status === 'unread');
  
      // Mark notifications as read
      user.notifications.forEach(async (notification) => {
        if (notification.status === 'unread') {
          notification.status = 'read';
        }
      });
  
      await user.save();
  
      res.json({ notifications: unreadNotifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = route;