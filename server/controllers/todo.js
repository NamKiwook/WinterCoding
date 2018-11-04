let todoSchema = require('../models/todo')

let load = async (req, res) => {
  try {
    let todoList = await todoSchema.find({delete: false}).sort({priority: 1})
    res.status(200).send(todoList)
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

let create = async (req, res) => {
  try {
    if(!req.body.title || !req.body.content) throw new Error('Not Filled')
    let numberDocument = await todoSchema.countDocuments();
    if(!numberDocument) numberDocument = 0;
    let todo = new todoSchema({title: req.body.title, content: req.body.content, deadline: req.body.deadline, priority: (numberDocument + 1)})
    todo = await todo.save()
    res.status(200).send(todo)
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

let complete = async (req, res) => {
  try {
    if(!req.body.todoId) throw new Error('Not Filled')
    let completedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set:{complete: true}});
    if(completedTodo.n === 0) throw new Error('invalid ToDo')
    res.status(200).send();
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

let modifyPriority = async (req, res) => {
  try{
    if(!req.body.todoId) throw new Error('Not Filled')
    let todo = await todoSchema.findOne({_id: req.body.todoId})
    if(!todo) throw new Error('invalid ToDo')
    if(req.body.up) {
      let higherPriority = await todoSchema.find({delete: {$eq: false},priority: {$lt: todo.priority}}).sort({priority: 1})
      if(higherPriority.length > 0) {
        let targetToDo = higherPriority[higherPriority.length - 1];
        await todoSchema.updateOne({_id: targetToDo._id}, {$set: {priority: todo.priority}});
        await todoSchema.updateOne({_id: todo._id}, {$set: {priority: targetToDo.priority}});
      }
    } else {
      let lowerPriority = await todoSchema.find({delete: {$eq: false},priority: {$gt: todo.priority}}).sort({priority: 1})
      if(lowerPriority.length > 0) {
        let targetToDo = lowerPriority[0];
        await todoSchema.updateOne({_id: targetToDo._id}, {$set: {priority: todo.priority}});
        await todoSchema.updateOne({_id: todo._id}, {$set: {priority: targetToDo.priority}});
      }
    }
    res.status(200).send();
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

let modifyDeadline = async (req,res) => {
  try {
    if(!req.body.todoId) throw new Error('Not Filled')
    let modifiedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set: {deadline: req.body.deadline}})
    if(modifiedTodo.n === 0) throw new Error('invalid ToDo')
    res.status(200).send()
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

let modifyContent = async (req, res) => {
  try {
    if(!req.body.todoId || !req.body.content) throw new Error('Not Filled')
    let modifiedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set: {content: req.body.content}})
    if(modifiedTodo.n === 0) throw new Error('invalid ToDo')
    res.status(200).send()
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

let modifyTitle = async (req, res) => {
  try {
    if(!req.body.todoId || !req.body.title) throw new Error('Not Filled')
    let modifiedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set: {title: req.body.title}})
    if(modifiedTodo.n === 0) throw new Error('invalid ToDo')
    res.status(200).send()
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

let remove = async (req, res) => {
  try {
    if(!req.body.todoId) throw new Error('Not Filled')
    let removedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set:{delete: true}});
    if(removedTodo.n === 0) throw new Error('invalid ToDo')
    res.status(200).send();
  } catch(err) {
    if (err.name === 'MongoError') res.status(503).send({errorMessage: err.message})
    else res.status(400).send({errorMessage: err.message})  }
}

module.exports = {load, create, complete, modifyPriority, modifyDeadline, modifyContent, modifyTitle, remove}
