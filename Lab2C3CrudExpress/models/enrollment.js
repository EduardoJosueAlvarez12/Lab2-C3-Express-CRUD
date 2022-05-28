const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
    studentId: String,
    courseId: String,
    date: String
});


const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;