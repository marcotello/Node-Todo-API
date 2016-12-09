var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		// Adding validation
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		// Adding validation
		allowNull: false,
		defaultValue: false
	}
});

// Force the database re created from the ground
// sequelize.sync({force:true}).then(function () {
// 	console.log('Everything is synced');

// 	Todo.create({
// 		//description: 'Walk my dog',
// 		completed: false
// 	}).then(function (todo){
// 		console.log('Finished');
// 		console.log(todo);
// 	});
// });

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);

User.hasMany(Todo);



sequelize.sync(
	//{force:true}
	).then(function () {
	console.log('Everything is synced');

	// Todo.findById(3).then(function (todo) {
	// 	if(todo){
	// 		console.log(todo.toJSON());
	// 	}else{
	// 		console.log('Not data found');
	// 	}
	// }).catch( function (e) {
	// 	console.log(e);
	// });

	// Todo.create({
	// 	description: 'Make the test',
	// 	//completed: false
	// }).then(function (todo){
	// 	//console.log('Finished');
	// 	//console.log(todo);
	// 	return Todo.create({
	// 		description: 'Clean the office'
	// 	});
	// }).then( function () {
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: '%office%'
	// 			}
	// 		}
	// 	});
	// }).then( function (todos){
	// 	if(todos){
	// 		todos.forEach( function (todo){
	// 			console.log(todo.toJSON());
	// 		});
	// 	}else{
	// 		console.log('No todo finded');
	// 	}
	// }).catch( function (e) {
	// 	console.log(e);
	// });

	// User.create({
	// 	email: 'marco@example.com'
	// }).then( function () {
	// 	return Todo.create({
	// 		description: 'Go out at 6 PM'
	// 	});
	// }).then( function (todo) {
	// 	User.findById(1).then( function(user) {
	// 		user.addTodo(todo);
	// 	});
	// });

	User.findById(1).then(function(user){
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function (todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		});
	});

});