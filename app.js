var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var routes = require('./controller/controller.js');

var PORT = process.env.PORT || 7100;

app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.listen(PORT, function(){
	console.log("connected on PORT", PORT);
})