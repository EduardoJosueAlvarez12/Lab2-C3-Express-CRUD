const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseId: String,
    courseName: String,    
    size: String,
    teacherId: String,    
    textbook: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;