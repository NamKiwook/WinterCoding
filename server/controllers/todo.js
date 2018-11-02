let todoSchema = require('../models/todo')

let load = async (req, res) => {
  try {
    let todoList = await todoSchema.find({delete: false}).sort({priority: 1})
    res.status(200).send(todoList)
  } catch(err) {
    console.log(err)
  }
}

let create = async (req, res) => {
  try {
    let numberDocument = await todoSchema.countDocuments();
    if(!numberDocument) numberDocument = 0;
    let todo = new todoSchema({title: req.body.title, content: req.body.content, deadline: req.body.deadline, priority: (numberDocument + 1) * 10})
    todo = await todo.save()
    res.status(200).send(todo)
  } catch(err) {
    console.log(err)
  }
}

let complete = async (req, res) => {
  try {
    let completedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set:{complete: true}});
    res.status(200).send(completedTodo);
  } catch(err) {
    console.log(err)
  }
}

let modifyPriority = async (req, res) => {
  try {
    let highPriority = await todoSchema.find({_id:{$ne: req.body.todoId}, priority: {$lt: req.body.targetPriority}})
    let priority = 0;
    if(highPriority[highPriority.length - 1]) {
      priority = (Number(highPriority[highPriority.length - 1].priority) + Number(req.body.targetPriority)) / 2
    } else {
      priority = Number(req.body.targetPriority) / 2
    }
    let modifiedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set: {priority: priority}})
    res.status(200).send(modifiedTodo)
  } catch(err) {
    console.log(err)
  }
}

let modifyContent = async (req, res) => {
  try {
    let modifiedTodo = await todoSchema.updateOne({_id: req.body.todoId}, {$set: {content: req.body.content}})
    res.status(200).send(modifiedTodo)
  } catch(err) {
    console.log(err)
  }
}

let remove = async (req, res) => {
  try {
    let removedTodo =await todoSchema.updateOne({_id: req.body.todoId}, {$set:{delete: true}});
    res.status(200).send(removedTodo);
  } catch(err) {
    console.log(err)
  }
}

module.exports = {load, create, complete, modifyPriority, modifyContent, remove}
