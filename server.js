var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
var routes = require('./controller/controller.js');


var PORT = process.env.PORT || 7100;

app.use(express.static(process.cwd() + '/public'));

// if(process.env.MONGODB_URI){
// 	mongoose.connect(process.env.MONGODB_URI);
// }else{
// 	mongoose.connect("mongodb://localhost");
// }

// var db = mongoose.connection;

//Show errors in any
// db.on('error', function(err){
// 	console.log("Mongoose Error: ", err);
// });

// //Show connection notification if connected
// db.once('open', function(){
// 	console.log('Successfully connected to mongoose!');
// });

app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.listen(PORT, function(){
	console.log("connected on PORT", PORT);
})