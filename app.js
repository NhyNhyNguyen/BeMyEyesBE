const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const routes = require('./routes/index');
const routesRoom = require('./routes/room');
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

const app = express()
const PORT = process.env.PORT || 3000
const db = mongoose.connection;

dotenv.config()

//connect db
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).then(() => console.log('DB Connected!'));
db.on('error', (err) => {
    console.log('DB connection error:', err.message);
})

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(expressValidator())

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use('/', routes);
app.use('/room', routesRoom);

app.listen(PORT, () => {console.log("Server started on http://localhost:"+PORT)})

module.exports = app;