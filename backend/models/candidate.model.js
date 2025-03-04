const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['Fresher', 'Mid-Level', 'Senior-Level', 'Entry-Level']
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
    },
    profilePhoto: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Candidate = mongoose.model('candidates', candidateSchema);

module.exports = Candidate;