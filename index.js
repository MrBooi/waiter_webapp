const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const Waiter = require('./public/waiter.js');


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
// 
const pool = new Pool({
    connectionString,
    ssl: useSSL
});
let waiter = Waiter(pool);

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/waiters/:username', async (req, res, next) => {
    try {
        let username = req.params.username;
        let weekdays = await waiter.getdays();
        res.render('home', {
            daynames: weekdays , username
        });
    } catch (error) {
        next(error);
    }
})

app.post('/waiters/:username', async (req, res, next) => {
    try {
        let weekdays = await waiter.getdays();
        let username =req.params.username;
        let shift = {
            username:username ,
            days: req.body.dayname
        }
        await waiter.dayShift(shift);
        res.render('home', {
            daynames: weekdays ,username
        });
    } catch (error) {
        next(error);
    }



})

app.get('/days', async (req, res,next) => {
    try {
        let weekdays = await waiter.getdays();
        let storedShifts = await waiter.groupByDay();
        console.log(storedShifts);

        res.render('days',{daynames: weekdays,data:storedShifts});
    } catch (error) {
         next(error);
    }

})

app.listen(PORT, (err) => {
    console.log('App starting on port', PORT)
});