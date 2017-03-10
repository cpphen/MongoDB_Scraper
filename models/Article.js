var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

    //Do these properties have the be the same name has the req body or the object or sending it?
	title: {
		type: String
	},
	link: {
		type: String
	},
	saved: {
		type: Boolean,
		default: false
	},
	img: {
		type: String
	},
	comment: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;