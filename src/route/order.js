const Order = require('../model/order');
const express = require('express');
const auth = require('../middleware/auth');
const route = express.Router();

//When the order button is clicked on the client side
route.post('/order',auth,async (req, res) =>{
    //const {description} = req.body;
     const order = new Order({
        ...req.body,
        owner: req.user._id
        })
    try{
        await order.save()
        res.status(201).send(task);
    }catch(err){
        res.status(400).send(err.message)
    }
  })


// Get/tasks?completed=false || completed=true
// Get/tasks?completed=false&limit=5&skip=0 || completed=true

route.get('/task',auth,async (req, res) =>{
        const match = {};
        const sort = {};
        if(req.query.completed){
            match.completed = req.query.completed === 'true';
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
        }

    try{
//        const tasks = await Task.find({owner: req.user.id})
        await req.user.populate({
        path:'orders',
        match,
        options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort}
         })
         res.status(200).send(req.user.tasks);
    }catch(err){
    res.status(500).send(err.message)
    }
  });

//List order by id
route.get('/order/:id',auth,async (req, res) =>{
    const _id = req.params.id;
    console.log(req.user.id);
    try{
        const task = await Order.findOne({_id: _id, owner: req.user.id});
        if(!task){return res.status(404).send("Task not found")}

        res.status(200).send(task);
    }catch(err){
        res.status(500).send(err.message)
    }
  });


//Edit order if the status is not completed
route.patch('/order/:id',auth,async (req, res) =>{
console.log(req.params.id,req.user.id)
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation){ return res.status(400).send("Invalid updates") };
    try{
        const order = await Order.findOne({ _id:req.params.id, owner:req.user.id});
        if(!order){
        return res.status(404).send("Task not found or invalid id")
        }

        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();
        res.send(task);

    }catch(err){ res.status(400).send(err.message) }
    })

//Delete order if status is not completed or in progress.
route.delete('/order/:id',auth,async (req, res)=>{
      try{
        const task = await Order.findByIdAndDelete({_id:req.params.id, owner:req.user.id})
        if(!task){
            return res.status(404).send("Task not found or invalid id")
        }
        res.status(200).send(task);
      }catch(err){
        res.status(400).send(err.message)
      }
  })

module.exports = route;