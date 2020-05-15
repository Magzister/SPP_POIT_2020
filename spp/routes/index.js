var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Task = require('../public/javascripts/task.js');
const fs = require("fs");

var urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET home page. */
router.get('/', function(req, res, next) {
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  res.render('index', { title: 'To Do List', tasks: taskList });
});

router.post('/addTask', urlencodedParser, function(req, res, next) {
  if(!req.body) return res.sendStatus(400);
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  var noteId;

  if (req.body.name != "" || req.body.text != ""){
    if (taskList[0] == null){
      noteId = 1;
    } else {
      var noteId = Math.max.apply(Math, taskList.map(function(o){return o.id;}));
      noteId++;
    }
  
    let task = new Task(noteId, req.body.name, req.body.text);
  
    taskList.push(task);
  
    content = JSON.stringify(taskList);
  
    fs.writeFileSync("data.json", content);
  }
  res.render('index', { title: 'To Do List', tasks: taskList });
});

router.delete('/deleteTask/:id', urlencodedParser, function(req, res, next){
  if(!req.body) return res.sendStatus(400);
  var id = req.params["id"];
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  var index = -1;

  for (var i = 0; i < taskList.length; i++){
    if (taskList[i].id == id){
      index = i;
      break;
    }
  }

  if (index > -1){
    taskList.splice(index, 1);
    content = JSON.stringify(taskList);
    fs.writeFileSync("data.json", content);

    res.render('index', { title: 'To Do List', tasks: taskList });
  }
  else{
    res.status(404).send();
  }
});

router.get('/editTask/:id', urlencodedParser, function(req, res, next){
  if(!req.body) return res.sendStatus(400);
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  var editId = req.params["id"];
  res.render('edit', { title: 'To Do List', tasks: taskList, id: editId });
});

router.put('/applyTask/:id', urlencodedParser, function(req, res, next){
  if(!req.body) return res.sendStatus(400);
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  var id = req.params["id"];
  var index = -1;

  for (var i = 0; i < taskList.length; i++){
    if (taskList[i].id == id){
      index = i;
      break;
    }
  }

  if (index > -1) {
    taskList[index].name = req.body.name;
    taskList[index].text = req.body.text;
    content = JSON.stringify(taskList);
    fs.writeFileSync("data.json", content);

    res.render('index', { title: 'To Do List', tasks: taskList });
  }
  else{
    res.status(404).send();
  }

  res.render('index', { title: 'To Do List', tasks: taskList });
});

module.exports = router;