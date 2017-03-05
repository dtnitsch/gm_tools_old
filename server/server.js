var express = require('express');
var app = express();
var port = 4000;

function rand(min,max) {
	return Math.floor((Math.random() * ((max + 1) - min)) + min);
}

function key() {
	var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var l = "abcdefghijklmnopqrstuvwxyz";
	output = '';
	while(output.length < 10) {
		r = rand(1,3);
		if(r == 1) { output += u[rand(0,25)]; }
		else if(r == 2) { output += l[rand(0,25)]; }
		else { output += rand(0,9); }
	}
	console.log(output)
	return output;
}


// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

// const client = new pg.Client(connectionString);
// client.connect();
// const query = client.query(
//   'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', () => { client.end(); });


app.get('/', function(req, res) {
  res.send('hello world');
});

app.get('/key', function(req, res) {
  res.send(key());
});

app.listen(port, function() {
  console.log("Express app started on port "+ port +".");
});