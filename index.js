const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public directory for static files
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

// Views directory for EJS files
const viewsPath = path.join(__dirname, '../views');
app.set('views', viewsPath);

app.set('view engine', 'ejs');
app.use(express.static(publicPath));

// Routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking && checking.name === req.body.name && checking.password === req.body.password) {
            res.send("User details already exist");
        } else {
            await LogInCollection.insertMany([data]);
            res.status(201).render("home", { naming: req.body.name });
        }
    } catch {
        res.send("Error in inputs");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });
        } else {
            res.send("Incorrect password");
        }
    } catch (e) {
        res.send("Wrong details");
    }
});

app.get('/home',(req,res)=>{
    res.render('home')
})
app.get('/about-us',(req,res)=>{
    res.render('aboutus');
})
app.get('/pricing',(req,res)=>{
    res.render('pricing');
})
app.get('/contact-us',(req,res)=>{
    res.render('contact-us');
})

app.get('/driver',(req,res)=>{
    res.render('driver');
})
app.listen(port, () => {
    console.log('Port connected');
});
