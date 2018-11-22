import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import User from './authenication/User';

const LocalStrategy = require('passport-local').Strategy;

const app = express();
const port = 3000;

// database setup
mongoose.connect('mongodb://localhost/CatPhotos', { useNewUrlParser: true });
const photoSchema = new mongoose.Schema({
    name: String,
    PhotoUrl: String,
    detail: String,
});

const Photos = mongoose.model('Photos', photoSchema);

// middleware
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: 'CatPhotos is awesome',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//check is login
const isLoggedIn = (req, res, next)=>{
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/CatPhotos/login')
}




// Route

// Home page
app.get('/CatPhotos', (req, res) => {
    console.log(req.user);
    Photos.find({}, (err, data)=>{
        if (err){
            console.log(err);
        } else{

            res.render('./pages/home.ejs', {data: data, user: req.user});
        }
    })
})

// add a photo
app.get('/CatPhotos/new', isLoggedIn, (req, res)=>{
    res.render('./pages/add.ejs', {user: req.user})
})

app.post('/CatPhotos', (req, res)=>{
    Photos.create(req.body, (err, photo)=>{
        if(err){
            console.log(err)
        } else {
            console.log(`New photo is ${photo}`)
        }
    });
    res.redirect('/CatPhotos');
})

//show photos
app.get('/CatPhotos/photos/:id', (req, res)=>{
    Photos.findById(req.params.id, (err, data)=>{
        if (err){
            console.log(err);
        } else{
            console.log(data);
            res.render('./pages/detail.ejs', {data: data, user: req.user});
        }
    })
})

// Authenication route

// login route
app.get('/CatPhotos/login', (req, res)=>{
    res.render('./pages/login.ejs', {user: req.user});
})

app.post('/CatPhotos/login', passport.authenticate('local', { 
    successRedirect: '/CatPhotos',
    failureRedirect: '/CatPhotos/login', 
}))

// register route
app.get('/CatPhotos/register', (req, res)=>{
    res.render('./pages/signUp.ejs', {user: req.user});
})

app.post('/CatPhotos/register', (req, res)=>{
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, user)=>{
            if (err){
                console.log(err)
                return res.render('register', {user: req.user});
            }
            passport.authenticate('local');
            res.redirect('/CatPhotos');
        }
    )
})

//log out
app.get('/CatPhotos/logout', function(req, res){
    req.logout();
    res.redirect('/CatPhotos');
  });

app.listen(port, ()=>{
    console.log('Server is preparing!')
})