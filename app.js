if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const reviews = require('./routes/review');
const listings = require('./routes/listing');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const users = require('./routes/user');


const MONGO_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/wanderlust';
async function main(){
    console.log(MONGO_URL);
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log('connected to db');
}
).catch((err) => {
    console.log('error connecting to db', err);
}
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));



const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret:process.env.SECRET
    },
    touchAfter: 24*60*60
}
);

store.on('error', function(e){
    console.log('session store error', e);
}
);



const sessionConfig = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
}
};


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
}
);

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'student@gmail.com', username: 'student'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
}
);



app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
app.use('/', users);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
}
);

//Custom error handling middleware
app.use((err, req, res, next) => {
    res.render('error.ejs', {
        err
    });
}
);


app.listen(8000, () => {
    console.log('server is running');
    }
);