var express = require('express');
const { removeCourse } = require('../Controller/Course');
var router = express.Router();

router.get('/home',(req,res) =>{
    res.send("Hello there")
})