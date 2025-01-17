const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Candidate = require('../models/candidate.model');
const authMiddleware = require('../middleware/authMiddleware');
const { addToBlacklist } = require('../utils/blacklist');

const router = express.Router();

// Multer configuration for file uploads and storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
}).fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]);

// SignUp route
router.post('/signup', upload, async (req, res) => {
    console.log(req.files);

    const { firstName, lastName, email, password, experienceLevel, jobType, phoneNumber } = req.body;

    // Extract file paths from req.files
    const profilePhoto = req.files && req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;
    const resume = req.files && req.files['resume'] ? req.files['resume'][0].path : null;

    if (!firstName) {
        return res.status(400).json({ msg: 'First name is required' });
    }
    if (!lastName) {
        return res.status(400).json({ msg: 'Last name is required' });
    }
    if (!email) {
        return res.status(400).json({ msg: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }
    if (!experienceLevel) {
        return res.status(400).json({ msg: 'Experience level is required' });
    }
    if (!jobType) {
        return res.status(400).json({ msg: 'Job type is required' });
    }
    if (!phoneNumber) {
        return res.status(400).json({ msg: 'Phone number is required' });
    }
    if (!profilePhoto) {
        return res.status(400).json({ msg: 'Profile photo is required' });
    }
    if (!resume) {
        return res.status(400).json({ msg: 'Resume is required' });
    }

    try {
        let candidate = await Candidate.findOne({ email });
        if (candidate) {
            return res.status(400).json({ msg: 'Candidate already exists' });
        }

        candidate = new Candidate({
            fullName: { firstName, lastName },
            email,
            password,
            experienceLevel,
            jobType,
            phoneNumber,
            profilePhoto,
            resume
        });

        const salt = await bcrypt.genSalt(10);
        candidate.password = await bcrypt.hash(password, salt);

        await candidate.save();

        const payload = {
            user: {
                id: candidate._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                throw err;
            }

            res.json({
                token,
                candidate: {
                    id: candidate._id,
                    fullName: candidate.fullName,
                    email: candidate.email,
                    profilePhoto,
                    resume
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: candidate._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                throw err;
            }

            res.json({
                token,
                candidate: {
                    id: candidate._id,
                    fullName: candidate.fullName,
                    email: candidate.email,
                    profilePhoto: candidate.profilePhoto,
                    resume: candidate.resume
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Profile route
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id).select('-password');
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.decode(token);
    const expiry = decoded.exp;
    addToBlacklist(token, expiry);
    res.json({ msg: 'Logout successful' });
});

module.exports = router;