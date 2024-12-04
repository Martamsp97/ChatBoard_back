const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true, versionKey: false
})

const User = model('user', userSchema)

module.exports = User