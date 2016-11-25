var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	var filterTodos = todos;

	if(queryParams.completed && queryParams.completed === 'true'){
		filterTodos = _.where(todos, {completed: true});
	}else if(queryParams.completed && queryParams.completed === 'false'){
		filterTodos = _.where(todos, {completed: false});
	}

	if(queryParams.description){
		filterTodos = _.filter(filterTodos, function (todo) {
			if(todo.description.toLowerCase().indexOf(queryParams.description.toLowerCase())>-1){
				return true;
			}else{
				return false;
			}
		});
	}

	res.json(filterTodos);
});

app.get('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	//var todoIndex = 0;

	var matchedTodo;

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
	matchedTodo = _.findWhere(todos, {id: todoID});

	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}


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

	var todo = {};

	todo.id = todoNextId;
	todo.description = body.description.trim();
	todo.completed = body.completed;

	todos.push(todo)

	todoNextId++;

	res.json(todo);
});

app.delete('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id: todoID});

	if(matchedTodo){
		todos = _.without(todos, matchedTodo); 
		res.json(matchedTodo);
	}else{
		res.status(404).send({"error":"no todo found with that id"});
	}
});

app.put('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoID});

	var body = _.pick(req.body, 'description', 'completed');

	var validAttributes = {};

	if(!matchedTodo){
		res.status(404).send({"error":"no todo found with that id"});
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();	
	}

	//Everithing is fine
	_.extend(matchedTodo, validAttributes);

	res.json(matchedTodo);

});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});