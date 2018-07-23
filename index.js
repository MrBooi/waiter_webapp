const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const app = express();

let PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

//database connection 
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiter-availability'

const pool = new Pool({
    connectionString,
    ssl: useSSL
});









app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(bodyParser.json());

app.engine('handlebars', exphbs({
defaultLayout: 'main'
}));

 app.set('view engine', 'handlebars');

app.get('/',(req,res)=>{
 res.send('Working');
})

app.get('/waiters/:username',(req,res)=>{
res.send('working select working days',req.params.username);
})

// app.post('/waiters/:username',(req,res) =>{
//     res.send(req.params.username);
// })

app.get('/days',(req,res)=>{
    res.send('getting days');
})

app.listen(PORT,(err) => {
    console.log('App starting on port', PORT)
  });
 

