const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const Waiter = require('./waiter.js');


const app = express();

let PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(session({
    secret: 'keyboard cat',
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
    defaultLayout: 'main',
    helpers: {
        checkedDays: function () {
            if (this.checked) {
                return 'checked';
            }
        }
    }

}));

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('sigin');
})

app.post('/sigin', async (req, res, next) => {
    let username = req.body.siginUsername;
    try {
        let found = await waiter.foundUser(username);
        if (found) {
            res.redirect('/waiters/' + username);
        } else {
            req.flash('error', 'oops unable login please provide correct username');
            res.redirect('/');
        }

    } catch (error) {
        next(error);
    }
})

app.get('/waiters/:username', async (req, res, next) => {
    try {
        let username = req.params.username;
        let foundUser = await waiter.getUsername(username);
        let weekdays = await waiter.getdays(username);
        res.render('home', {
            daynames: weekdays,
            username,
            foundUser
        });
    } catch (error) {
        next(error);
    }
})

app.post('/waiters/:username', async (req, res, next) => {
    try {
        let username = req.params.username;
        let weekdays = await waiter.getdays(username);
        if (weekdays != undefined || weekdays != [] &&
            username != undefined || username != "") {
            let shift = {
                username: username,
                days: Array.isArray(req.body.dayname) ? req.body.dayname : [req.body.dayname]
            }
            req.flash('info', 'Succesfully added shift(s)');
            await waiter.dayShift(shift);
            res.redirect('/waiters/'+username);
        }
      
    } catch (error) {
        next(error);
    }
})

app.get('/days', async (req, res, next) => {
    try {
        await waiter.getdays();
        let storedShifts = await waiter.groupByDay();
        res.render('days', {
            storedShifts
        });
    } catch (error) {
        next(error);
    }
})

app.get('/clear', async (req, res, next) => {
    try {
        await waiter.clearShifts();
        res.redirect('days');
        req.flash('info', 'You have Succesfully deleted shift');
    } catch (error) {
        next(error)
    }
})

app.listen(PORT, (err) => {
    console.log('App starting on port', PORT)
});