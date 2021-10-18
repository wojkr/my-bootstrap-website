const express = require('express');
const app = express();
const path = require('path');
const projectsData = require('../projects-data.json');


app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates/views'));


app.get('/', (req, res) => {
    const message = 'hey!';
    res.render("home.ejs", { message })
});

app.get('/projects', (req, res) => {
    res.render("projects.ejs", { projectsData })
});


for (let project of projectsData) {
    app.get(`/projects/${project.link}`, (req, res) => {
        res.render(`project.ejs`, { project })
    })
}

app.get('/contact', (req, res) => {
    res.render("contact.ejs")
});

app.get('/about', (req, res) => {
    res.render("about.ejs")
});

app.get('*', (req, res) => {
    res.send("wrong url")
})


app.listen(3000, () => {
    console.log("Listening on port 3000")
});