const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentId: String,
    name: String,
    lastName: String,
    birthDate: String,
    gradeLevel: String
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;