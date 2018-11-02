let todoSchema = require('../models/todo')

let list = async (req, res) => {
  try {
    let todoList = await todoSchema.find({delete: false}).sort({priority: 1});
    res.status(200).send(todoList);
  } catch(err) {
    console.log(err);
  }
}

let create = async (req, res) => {
  try {
    let todo = new todoSchema({title: req.body.title, content: req.body.content, deadline: req.body.deadline, priority: await todoSchema.countDocuments()})
    todo = await todo.save();
    res.status(200).send(todo);
  } catch(err) {
    console.log(err);
  }
}

let load = async (req, res) => {
  try {

  } catch(err) {
    console.log(err);
  }
}

let update = async (req, res) => {
  try {

  } catch(err) {
    console.log(err);
  }
}

let remove = async (req, res) => {
  try {

  } catch(err) {
    console.log(err);
  }
}

module.exports = {list, load, create, update, remove}
