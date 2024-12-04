const { Schema, model } = require('mongoose');

const msgSchema = new Schema({
    name: String,
    message: String,
    userId: String
}, {
    timestamps: true, versionKey: false
})

const ChatMessage = model('chat_msg', msgSchema)

module.exports = ChatMessage