const express = require('express');
// const req = require('express/lib/request');
// const res = require('express/lib/response');
const mongoose = require('mongoose');
var router = express.Router();

//llamado al modelo
const Course = require('../models/course');

//ruta de login
const loginRoute = "../views/pages/login";

router.get('/', (req, res) => {
    if(req.user) {
    res.render('pages/course/addEdit', {
        viewTitle: 'New Course'
    });
        }else {
            res.render(loginRoute, {
                message: "Please log in to continue",
                messageClass: "alert-danger",
        
    });
    }
});

router.post('/', (req, res) =>{
    if (req.user) {
        if(req.body._id == '')
        newCourse(req, res)
        else
        updateCourse(req, res)
      } else {
        res.render(loginRoute, {
          message: "Please log in to continue",
          messageClass: "alert-danger",
        });
      }
});




//método para insertar nuevo registro
function newCourse(req, res){
    var course = new Course();
    course.courseId = req.body.courseId;
    course.courseName = req.body.courseName;
    course.size = req.body.size;
    course.teacherId = req.body.teacherId;
    course.textbook = req.body.textbook;

    course.save((error) => {
        if(error)
        console.log("Error" + error);
        else
        res.redirect('course/list');
    });
}

function updateCourse(req, res){
    Course.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if(!err){
            res.redirect('course/list');
        } else {
            res.render('course/addEdit', {
                viewTitle: "Update Course",
                course: req.body
            })
        }
    })
}

router.get('/list', (req, res)=> {
    if(req.user){
    Course.find((err, doc) => {
        if(!err){
            res.render('pages/course/list', {
                list: doc,
                viewTitle: "Courses"
            })
        } else {
            console.log("Error" + err);
        }
    });
} else {
    res.render(loginRoute, {
      message: "Please log in to continue",
      messageClass: "alert-danger",
    });
  }

    
})

router.get('/:id', (req, res) => {
    if (req.user) {
        Course.findById(req.params.id, (err, doc) => {
            if(!err){
                res.render('pages/course/addEdit', {
                    viewTitle: "Update Course",
                    course: doc
                });
            }
        })
    } else {
        res.render(loginRoute, {
          message: "Please log in to continue",
          messageClass: "alert-danger",
        });
      }
})

router.get('/delete/:id', (req, res) => {
    if (req.user) {
        Course.findByIdAndDelete(req.params.id, (err, doc) =>{
            if(!err){
                res.redirect('/course/list');
            } else {
                console.log("Error" + err);
            }
        })
      } else {
        res.render(loginRoute, {
          message: "Please log in to continue",
          messageClass: "alert-danger",
        });
      }
})

module.exports = router;