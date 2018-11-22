const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/restful_blog_app');


const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now},
})

const Blog = mongoose.model('Blog', blogSchema);



app.use(express.urlencoded({extended:true}))


app.listen(port, ()=>{
    console.log('Server is preparing')
})