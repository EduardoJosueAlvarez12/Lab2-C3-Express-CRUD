const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//llamado al modelo
const Student = require('../models/student');

//ruta de login
const loginRoute = "../views/pages/login";

router.get('/', (req, res) => {
    if (req.user) {
        res.render('pages/student/addEdit',{
            viewTitle: 'New Student'
        });
    
      } else {
        res.render(loginRoute, {
          message: "Please log in to continue",
          messageClass: "alert-danger",
        });
      }
});

router.post('/', (req, res) =>{
    if (req.user) {
        if(req.body._id == '')
        newStudent(req, res)
        else
        updateStudent(req, res)
      } else {
        res.render(loginRoute, {
          message: "Please log in to continue",
          messageClass: "alert-danger",
        });
      }
});

//método para insertar nuevo estudiante
function newStudent(req, res){
    var student = new Student();
    student.studentId = req.body.studentId;
    student.name = req.body.name;
    student.lastName = req.body.lastName;
    student.birthDate = req.body.birthDate;
    student.gradeLevel = req.body.gradeLevel;
 

    student.save((error) => {
        if(error)
        console.log("Error" + error);
        else
        res.redirect('student/list');
    });
}



function updateStudent(req, res){
  Student.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
      if(!err){
          res.redirect('student/list');
      } else {
          res.render('student/addEdit', {
              viewTitle: "Update Student",
              student: req.body
          })
      }
  })
}


router.get('/list', (req, res)=> {
  if(req.user){
  Student.find((err, doc) => {
      if(!err){
          res.render('pages/student/list', {
              list: doc,
              viewTitle: "Student"
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
      Student.findById(req.params.id, (err, doc) => {
          if(!err){
              res.render('pages/student/addEdit', {
                  viewTitle: "Update Student",
                  student: doc
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
      Student.findByIdAndDelete(req.params.id, (err, doc) =>{
          if(!err){
              res.redirect('/student/list');
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