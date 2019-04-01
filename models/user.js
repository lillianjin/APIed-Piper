// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {
        type: String,
        unique: true,
        required: true
    },
    pendingTasks: {
        type: [String],
        defualt: []
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);