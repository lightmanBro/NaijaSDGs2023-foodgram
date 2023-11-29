const Order = require('../model/order');
const User = require('../model/user')
const express = require('express');
const auth = require('../middleware/auth');
const route = express.Router();

//When the order button is clicked on the client side
// will get the datails and also the post id.
//The owner of the order will be the req.user._id;
//The poster id will be on the body object
route.post('/order/:postId', auth, async (req, res) => {
  const postId = req.params.postId
  console.log(req.body)
  //const {description} = req.body;
  const order = new Order({ ...req.body, postId, owner: req.user._id })
  try {
    await order.save()
    res.status(201).send(order);
  } catch (err) {
    res.status(400).send(err.message)
  }
})


//List order by id and status
route.get('/order/:id', auth, async (req, res) => {
  const _id = req.params.id;
  console.log(req.user.id);
  try {
    const order = await Order.findOne({ _id: _id, owner: req.user.id });
    if (!order) { return res.status(404).send("Order not found") }

    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err.message)
  }
});


//Get all orders associated with this user
route.get('/order', auth, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user.id });
    await user.populate('orders');
    console.log(user.orders)
    // if(!user.orders){return res.status(404).send("Order list is empty")}
    res.status(200).send(user.orders);
  } catch (err) {
    res.status(500).send(err.message)
  }
});


//Edit order if the status is not completed
route.patch('/order/:id', auth, async (req, res) => {
  console.log(req.params.id, req.user.id)
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) { return res.status(400).send("Invalid updates") };
  try {
    const order = await Order.findOne({ _id: req.params.id, owner: req.user.id });
    if (!order) {
      return res.status(404).send("Task not found or invalid id")
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await order.save();
    res.send(order);

  } catch (err) { res.status(400).send(err.message) }
})

//Delete order if status is not completed or in progress.
route.delete('/order/:id', auth, async (req, res) => {
  try {
    const task = await Order.findByIdAndDelete({ _id: req.params.id, owner: req.user.id })
    if (!task) {
      return res.status(404).send("Task not found or invalid id")
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err.message)
  }
})

module.exports = route;