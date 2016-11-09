var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
		id: 1,
		description: 'Send the email',
		completed: false
	}, {
		id: 2,
		description: 'Feed the dogs',
		completed: false
	}, {
		id: 3,
		description: 'Check the poll',
		completed: true
	}];

app.get('/', function (req, res) {
	res.send('TODO API Root');
});

app.get('/todos', function (req, res) {
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	var todoID = req.params.id;
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

	todos.forEach( function (todo) {
		if(todo.id === parseInt(todoID, 10)){
			matchedTodo = todo;
		}
	}); 


	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}


	//res.json(todos[todoIndex]);
	//res.send('ID = ' + req.params.id);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});