var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var bcrypt = require('bcrypt');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

var todoNextId = 1;
// var todos = [{
// 		id: 1,
// 		description: 'Send the email',
// 		completed: false
// 	}, {
// 		id: 2,
// 		description: 'Feed the dogs',
// 		completed: false
// 	}, {
// 		id: 3,
// 		description: 'Check the poll',
// 		completed: true
// 	}, {
// 		id: 4,
// 		description: 'Charge my phone',
// 		completed: true
// 	}];

var todos = [];

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('TODO API Root');
});

app.get('/todos', function (req, res) {
	var queryParams = req.query;
	// var filterTodos = todos;
	//
	// if(queryParams.completed && queryParams.completed === 'true'){
	// 	filterTodos = _.where(todos, {completed: true});
	// }else if(queryParams.completed && queryParams.completed === 'false'){
	// 	filterTodos = _.where(todos, {completed: false});
	// }
	//
	// if(queryParams.description){
	// 	filterTodos = _.filter(filterTodos, function (todo) {
	// 		if(todo.description.toLowerCase().indexOf(queryParams.description.toLowerCase())>-1){
	// 			return true;
	// 		}else{
	// 			return false;
	// 		}
	// 	});
	// }

	var where = {};

  	if(queryParams.completed && queryParams.completed === 'true'){
		where.completed = true;
	}else if(queryParams.completed && queryParams.completed === 'false'){
		where.completed = false;
	}

	if(queryParams.description){
		where.description = {
		  $like: '%' + queryParams.description + '%'
	  }
	}

	db.todo.findAll({ where: where }).then( function (todos) {
		if(!!todos){
			res.json(todos);
		}else{
			res.status(404).send();
		}
	}).catch( function (e) {
		res.status(500).send('Something went wrong');
	});
});

app.get('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	//var todoIndex = 0;

	// var matchedTodo;

	//console.log(typeof todoID);
	//for(idx = 0; idx < todos.length; idx++){
		//console.log('index = ' + idx + ' ..... id = ' + todos[idx].id);
		//if(parseInt(todoID) === todos[idx].id){
			//console.log(todos[idx].id);
			//todoIndex = idx;
			//break;
		//}
	//}

	//console.log(todoIndex);

	//******************
	//Matching the todo in the list with the id on the URL

	// todos.forEach( function (todo) {
	// 	if(todo.id === parseInt(todoID, 10)){
	// 		matchedTodo = todo;
	// 	}
	// });

	//*********************************
	//Using underscore library to match the todo by ID
	//matchedTodo = _.findWhere(todos, {id: todoID});
	db.todo.findById(todoID).then( function (matchedTodo) {
		if(matchedTodo){
			res.json(matchedTodo);
		}else{
			res.status(404).send();
		}
	}).catch( function (e) {
		res.status(500).send('Something went wrong');
	});
	//res.json(todos[todoIndex]);
	//res.send('ID = ' + req.params.id);
});

app.post('/todos', function (req, res) {
	var body = req.body;
	console.log('description: ' + body.description);

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	// if(!_.has(body, 'description') || !_.has(body, 'completed')){
	// 	return res.status(400).send();
	// }

	// if((_.keys(body)).length > 2){
	// 	return res.status(400).send();
	// }

	body = _.pick(body, 'description', 'completed');

	// var todo = {};

	// todo.id = todoNextId;
	// todo.description = body.description.trim();
	// todo.completed = body.completed;

	// todos.push(todo)

	// todoNextId++;

	// ***************************************
	// Adding databse support
	// ****************************************

	body.description = body.description.trim();

	db.todo.create(body).then(function (todo){
		console.log('Finished');
		res.json(todo.toJSON());
	}).catch( function (e) {
		res.status(404).json(e);
	});

});

app.delete('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10); 
	
	var where = {
		id: todoID
	}; 

	var fetchedTodo;

	// var matchedTodo = _.findWhere(todos, {id: todoID});

	// if(matchedTodo){
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// }else{
	// 	res.status(404).send({"error":"no todo found with that id"});
	// }

	// Fetching the todo
	db.todo.findById(todoID).then( function (matchedTodo) {
		if(matchedTodo){
			// Deleting the todo
			db.todo.destroy({where: where}).then( function (rowsDeleted) {
				if(rowsDeleted===1){
					res.json(matchedTodo);
				}
			}).catch( function (e) {
				res.status(500).send('Something went wrong');
			});
		}else{
			res.status(404).send();
		}
	}).catch( function (e) {
		res.status(500).send('Something went wrong');
	});
});

app.put('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');

	var attributes = {};

	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	}

	if(body.hasOwnProperty('description')){
		attributes.description = body.description;
	}

	db.todo.findById(todoID).then( function (todo) {
		if(todo){
			return todo.update(attributes).then( function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).send();
			});
		}else{
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});

});

app.post('/users', function (req, res) {
	var body = req.body;

	body = _.pick(body, 'email', 'password');

	body.email = body.email.trim();

	db.user.create(body).then(function (user){
		console.log('User Created');
		res.json(user.toPublicJSON());
	}).catch( function (e) {
		res.status(404).json(e);
	});

});

app.post('/users/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');
	
	db.user.authenticate(body).then( function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(401).send();
	});
});

db.sequelize.sync().then( function () {
	app.listen(PORT, function () {
		console.log('Express listening on port ' + PORT + '!');
	});
});
