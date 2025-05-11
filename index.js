const express = require('express');
const bodyParser = require('body-parser');
const qr_code = require('qrcode');
const path = require("path");
const port = 3000


const app = express();
app.use(express.static(path.resolve('static')));

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/', function(req, res){
	res.render('index',{QR_code:''});
});

app.post('/', function(req, res){
	const url = req.body.url;
	if(url){
		qr_code.toDataURL(url, function(err, src){
			if(err){res.send(err); console.log(err);}
			let file_path = "store/"+ Date.now() +".png";
			qr_code.toFile(file_path,url, {
			  color: {
			    dark: '#000',  // Black dots
			    light: '#0000' // Transparent background
			  }
			});
			res.render('index',{QR_code:src,img_src:file_path}); 
		});

	}else{
		res.send('URL Not Set!');
	}

});

app.get('/download',function(req,res){
	res.download(req.query.file_path);
})

app.listen(port,function(){
	console.log(`Server listing  http://localhost:${port}`);
});