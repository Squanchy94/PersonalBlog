//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "My name is Oswaldo and this is my Blog! Stay tuned for more posts about coding and art!";
const aboutContent = "My name is Oswaldo Castro but I often go by Ozzy.I'm an aspiring software developer and recently graduated from the University of Houston with a degree in computer science. I love to learn new technologies and code. When I'm not coding I'm usually doing something art related. I like to draw and I also to sculpt! This blog was created using fornt-end and back-end technologies such as javascript, node, mongoose, Express, HTML, CSS, Bootstrap, and other libraries.";
const contactContent = "You can reach me through Email: oswaldocast94@gmail.com";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blog", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

    Post.find({}, function(err, posts) {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });


    post.save(function(err) {
        if (!err) {
            res.redirect("/");
        }
    });
});

app.get("/posts/:postId", function(req, res) {

    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, function(err, post) {
        res.render("post", {
            postTitle: post.title,
            postBody: post.content
        });
    });

});

app.get("/about", function(req, res) {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});