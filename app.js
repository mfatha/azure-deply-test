var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var multer  = require('multer')
var fs = require('fs');
var upload = multer({ dest: 'uploads/' })

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;



app.post('/upload', upload.single("picture"), function (req,res) {
	console.log("Received file" + req.file.originalname);
	var src = fs.createReadStream(req.file.path);
	var dest = fs.createWriteStream('/public/uploads/' + req.file.originalname);
	src.pipe(dest);
	src.on('end', function() {
		fs.unlinkSync(req.file.path);
		res.json('OK: received ' + req.file.originalname);
	});
	src.on('error', function(err) { res.json('Something went wrong!'); });

});