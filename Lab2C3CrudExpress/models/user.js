const mongoose = require('mongoose');
const Schema = mongoose.Schema;



// el esquema se asigna a la coleccion de MongoDB
// define el formato de todos los documentos de esa coleccion
// todas las propiedades deben definirse un SchemaType

const userSchema = new Schema({
    fullName: String,
    email: String,
    password: String
});

//crear un modelo
const User = mongoose.model('User', userSchema);

module.exports = User;