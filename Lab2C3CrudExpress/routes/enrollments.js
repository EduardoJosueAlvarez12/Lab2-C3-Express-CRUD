const express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

//llamados a los modelos
const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const Student = require("../models/student");

//ruta de login
const loginRoute = "../views/pages/login";

router.get("/", (req, res) => {
  if (req.user) {
    res.render("pages/enrollment/addEdit", {
      viewTitle: "New Enrollment",
    });
  } else {
    res.render(loginRoute, {
      message: "Please log in to continue",
      messageClass: "alert-danger",
    });
  }
});

router.post("/", (req, res) => {
  //variables para almacenar ids de
  //estudiantes y cursos
  var studentList = new Object();
  var courseList = new Object();

  Course.find((err, doc) => {
    if (!err) {
      for (i = 0; i < doc.length; i++) {
        courseList[i] = doc[i].courseId;
        Student.find((err, doc) => {
          if (!err) {
            for (i = 0; i < doc.length; i++) {
              studentList[i] = doc[i].studentId;
            }

            if (req.user) {
              var existsStudent = false;
              var existsCourse = false;

              //verifica que el estudiante exista
              for (i = 0; i < Object.values(studentList).length; i++) {
                if (studentList[i] == req.body.studentId) {
                  existsStudent = true;
                }
              }

              if (existsStudent) {
                //si el estudiante existe, verifica si existe el curso
                for (i = 0; i < Object.values(courseList).length; i++) {
                  if (courseList[i] == req.body.courseId) {
                    existsCourse = true;
                  }
                }

                if (existsCourse) {
                  //verifica si se va añadir o actualizar
                  if (req.body._id == "") 
                  newEnrollment(req, res);
                  else 
                  updateEnrollment(req, res);
                } else {
                  res.render("pages/enrollment/addEdit", {
                    message: "The course does not exist",
                    messageClass: "alert-danger",
                  });
                }
              } else {
                res.render("pages/enrollment/addEdit", {
                  message: "The student does not exist",
                  messageClass: "alert-danger",
                });
              }
            } else {
              res.render(loginRoute, {
                message: "Please log in to continue",
                messageClass: "alert-danger",
              });
            }
          } else {
            console.log("Error" + err);
          }
        });
      }
    } else {
      console.log("Error" + err);
    }
  });
});

//método para insertar nuevo registro
function newEnrollment(req, res) {
  var enrollment = new Enrollment();
  enrollment.studentId = req.body.studentId;
  enrollment.courseId = req.body.courseId;
  enrollment.date = req.body.date;

  enrollment.save((error) => {
    if (error) console.log("Error" + error);
    else res.redirect("enrollment/list");
  });
}

function updateEnrollment(req, res) {
  Enrollment.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("enrollment/list");
      } else {
        res.render("enrollment/addEdit", {
          viewTitle: "Update Enrollment",
          course: req.body,
        });
      }
    }
  );
}

router.get("/list", (req, res) => {
  if (req.user) {
    Enrollment.find((err, doc) => {
      if (!err) {
        res.render("pages/enrollment/list", {
          list: doc,
          viewTitle: "Enrollments",
        });
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
});

router.get("/:id", (req, res) => {
  if (req.user) {
    Enrollment.findById(req.params.id, (err, doc) => {
      if (!err) {
        res.render("pages/enrollment/addEdit", {
          viewTitle: "Update Enrollment",
          enrollment: doc,
        });
      }
    });
  } else {
    res.render(loginRoute, {
      message: "Please log in to continue",
      messageClass: "alert-danger",
    });
  }
});

router.get("/delete/:id", (req, res) => {
  if (req.user) {
    Enrollment.findByIdAndDelete(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect("/enrollment/list");
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
});

module.exports = router;
