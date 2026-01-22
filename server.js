/**
 * Student Academic & Scholarship Advisor - Node.js Backend
 * 
 * Database: JSON file-based (stored in data.json file)
 * Port: 3000
 * 
 * Run: npm install (first time)
 *      npm start (to run server)
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
// Use PORT from environment variable (for cloud deployment) or default to 3000 for local
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors({
    origin: [
        'http://localhost:8000', 
        'http://127.0.0.1:8000', 
        'http://localhost:5500', 
        'http://127.0.0.1:5500'
    ],
    credentials: true
}));
app.use(express.json());

// Session configuration
// Note: MemoryStore warning is normal for development - it works fine for small apps
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        httpOnly: true, // Prevent XSS attacks
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
    }
}));

// Database helper functions
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return { users: [], student_details: [] };
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Initialize database
let db = loadData();
if (!db.users) db.users = [];
if (!db.student_details) db.student_details = [];
saveData(db);

// Helper: Check if user is logged in
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    next();
}

// Helper: Get current user
function getCurrentUser(req) {
    if (!req.session.userId) return null;
    db = loadData();
    return db.users.find(u => u.id === req.session.userId);
}

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is running',
        status: 'healthy'
    });
});

// Register
app.post('/register', (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and password are required' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }

        db = loadData();
        const emailLower = email.toLowerCase().trim();

        // Check if email already exists
        if (db.users.find(u => u.email === emailLower)) {
            return res.status(409).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Check if phone already exists (if provided)
        if (phone && db.users.find(u => u.phone === phone.trim())) {
            return res.status(409).json({ 
                success: false, 
                message: 'User with this phone already exists' 
            });
        }

        // Hash password and create user
        const passwordHash = bcrypt.hashSync(password, 10);
        const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
        
        const newUser = {
            id: newId,
            name: name.trim(),
            email: emailLower,
            phone: phone ? phone.trim() : null,
            password_hash: passwordHash,
            created_at: new Date().toISOString()
        };

        db.users.push(newUser);
        saveData(db);

        // Set session
        req.session.userId = newId;
        req.session.permanent = true;

        res.status(201).json({ 
            success: true, 
            message: 'Registration successful' 
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// Login
app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        db = loadData();
        const user = db.users.find(u => u.email === email.toLowerCase().trim());

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Set session
        req.session.userId = user.id;
        req.session.permanent = true;

        res.json({ 
            success: true, 
            message: 'Login successful' 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ 
        success: true, 
        message: 'Logged out' 
    });
});

// ============================================
// STUDENT DETAILS ROUTES
// ============================================

// Save/Update student details
app.post('/student/details', requireAuth, (req, res) => {
    try {
        const {
            roll_number,
            btech_year,
            gender,
            category,
            quota_type,
            present_cgpa,
            previous_cgpa,
            attendance,
            active_backlogs
        } = req.body;

        // Validation
        const required = ['roll_number', 'btech_year', 'gender', 'category', 'quota_type', 
                         'present_cgpa', 'previous_cgpa', 'attendance', 'active_backlogs'];
        const missing = required.filter(field => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');
        
        if (missing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Missing fields: ${missing.join(', ')}` 
            });
        }

        if (active_backlogs !== 'Yes' && active_backlogs !== 'No') {
            return res.status(400).json({ 
                success: false, 
                message: "active_backlogs must be 'Yes' or 'No'" 
            });
        }

        const userId = req.session.userId;
        db = loadData();

        // Check if details already exist
        const existingIndex = db.student_details.findIndex(d => d.user_id === userId);

        const studentData = {
            user_id: userId,
            roll_number,
            btech_year,
            gender,
            category,
            quota_type,
            present_cgpa: parseFloat(present_cgpa),
            previous_cgpa: parseFloat(previous_cgpa),
            attendance: parseFloat(attendance),
            active_backlogs,
            updated_at: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            // Update existing
            db.student_details[existingIndex] = { ...db.student_details[existingIndex], ...studentData };
        } else {
            // Insert new
            db.student_details.push(studentData);
        }

        saveData(db);

        res.json({ 
            success: true, 
            message: 'Student details saved' 
        });
    } catch (error) {
        console.error('Save details error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error saving details' 
        });
    }
});

// Get student details
app.get('/student/details', requireAuth, (req, res) => {
    try {
        const userId = req.session.userId;
        db = loadData();
        const details = db.student_details.find(d => d.user_id === userId);

        if (!details) {
            return res.status(404).json({ 
                success: false, 
                message: 'No student details found' 
            });
        }

        // Remove user_id from response
        const { user_id, ...studentData } = details;
        res.json({ 
            success: true, 
            data: studentData 
        });
    } catch (error) {
        console.error('Get details error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error getting details' 
        });
    }
});

// ============================================
// SCHOLARSHIP ELIGIBILITY
// ============================================

function computeEligibility(details) {
    const eligible = (
        details.present_cgpa > 7.5 &&
        details.previous_cgpa > 7.5 &&
        details.attendance >= 75 &&
        details.active_backlogs === 'No'
    );

    const reasons = [];
    if (details.present_cgpa <= 7.5) {
        reasons.push(`Present CGPA (${details.present_cgpa}) must be > 7.5`);
    }
    if (details.previous_cgpa <= 7.5) {
        reasons.push(`Previous CGPA (${details.previous_cgpa}) must be > 7.5`);
    }
    if (details.attendance < 75) {
        reasons.push(`Attendance (${details.attendance}%) must be ≥ 75%`);
    }
    if (details.active_backlogs === 'Yes') {
        reasons.push('No active backlogs allowed');
    }

    return {
        eligibility_status: eligible ? 'Eligible' : 'Not Eligible',
        eligible: eligible,
        reasons: reasons
    };
}

app.get('/scholarship/eligibility', requireAuth, (req, res) => {
    try {
        const userId = req.session.userId;
        db = loadData();
        const details = db.student_details.find(d => d.user_id === userId);

        if (!details) {
            return res.status(404).json({ 
                success: false, 
                message: 'No student details found' 
            });
        }

        const eligibility = computeEligibility(details);
        res.json({ 
            success: true, 
            data: eligibility 
        });
    } catch (error) {
        console.error('Eligibility error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error checking eligibility' 
        });
    }
});

// ============================================
// SCHOLARSHIP RECOMMENDATIONS
// ============================================

function buildRecommendations(details) {
    const government = [];
    const privateScholarships = [];
    const merit = [];

    // Base merit scholarships
    merit.push({
        name: 'National Scholarship Portal (NSP)',
        link: 'https://scholarships.gov.in',
        description: 'Central portal for multiple government scholarships'
    });

    // Female + Convener quota
    if (details.gender.toLowerCase() === 'female' && 
        details.quota_type.toLowerCase().includes('convener')) {
        government.push({
            name: 'Pragati Scholarship (Girls)',
            link: 'https://www.aicte-pragati-saksham-gov.in/',
            description: 'AICTE scholarship for female students in technical education'
        });
        government.push({
            name: 'AICTE Saksham',
            link: 'https://www.aicte-pragati-saksham-gov.in/',
            description: 'Support for students with special needs; check eligibility'
        });
    }

    // Category-based
    if (details.category.toUpperCase() === 'SC' || details.category.toUpperCase() === 'ST') {
        government.push({
            name: 'Post-Matric Scholarship (SC/ST)',
            link: 'https://scholarships.gov.in',
            description: 'Financial assistance for SC/ST students'
        });
    }
    if (details.category.toUpperCase() === 'OBC') {
        government.push({
            name: 'Post-Matric Scholarship (OBC)',
            link: 'https://scholarships.gov.in',
            description: 'Financial assistance for OBC students'
        });
    }

    // Merit add-ons
    if (details.present_cgpa >= 8.0) {
        merit.push({
            name: 'UGC Merit Scholarship',
            link: 'https://www.ugc.gov.in/',
            description: 'Merit-based scholarship for high-performing students'
        });
    }
    if (details.present_cgpa >= 8.5) {
        privateScholarships.push({
            name: 'Aditya Birla Scholarship',
            link: 'https://www.adityabirlascholars.net/',
            description: 'Private merit-based scholarship for engineering students'
        });
    }

    // General private options
    privateScholarships.push({
        name: 'Internshala Internships',
        link: 'https://internshala.com',
        description: 'Internship portal to enhance profile and employability'
    });

    return {
        government_scholarships: government,
        private_scholarships: privateScholarships,
        merit_scholarships: merit
    };
}

app.get('/scholarship/recommendations', requireAuth, (req, res) => {
    try {
        const userId = req.session.userId;
        db = loadData();
        const details = db.student_details.find(d => d.user_id === userId);

        if (!details) {
            return res.status(404).json({ 
                success: false, 
                message: 'No student details found' 
            });
        }

        const recommendations = buildRecommendations(details);
        res.json({ 
            success: true, 
            data: recommendations 
        });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error getting recommendations' 
        });
    }
});

// ============================================
// PERFORMANCE ANALYSIS
// ============================================

function analyzePerformance(details) {
    const diff = parseFloat((details.present_cgpa - details.previous_cgpa).toFixed(2));
    
    let trend, message;
    if (diff > 0.1) {
        trend = 'improved';
        message = `CGPA improved by ${diff}`;
    } else if (diff < -0.1) {
        trend = 'declined';
        message = `CGPA declined by ${Math.abs(diff)}`;
    } else {
        trend = 'stable';
        message = 'CGPA is stable';
    }

    const attendanceStatus = details.attendance >= 75 ? 'good' : 'needs-improvement';

    return {
        trend: trend,
        message: message,
        cgpa_difference: diff,
        attendance_status: attendanceStatus,
        attendance: details.attendance
    };
}

app.get('/student/performance', requireAuth, (req, res) => {
    try {
        const userId = req.session.userId;
        db = loadData();
        const details = db.student_details.find(d => d.user_id === userId);

        if (!details) {
            return res.status(404).json({ 
                success: false, 
                message: 'No student details found' 
            });
        }

        const performance = analyzePerformance(details);
        res.json({ 
            success: true, 
            data: performance 
        });
    } catch (error) {
        console.error('Performance error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error analyzing performance' 
        });
    }
});

// ============================================
// REPORT API
// ============================================

app.get('/student/report', requireAuth, (req, res) => {
    try {
        const user = getCurrentUser(req);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const userId = req.session.userId;
        db = loadData();
        const details = db.student_details.find(d => d.user_id === userId);

        if (!details) {
            return res.status(404).json({ 
                success: false, 
                message: 'No student details found' 
            });
        }

        const eligibility = computeEligibility(details);
        const recommendations = buildRecommendations(details);
        const performance = analyzePerformance(details);

        // Remove sensitive data
        const { user_id, ...studentData } = details;

        const report = {
            user_profile: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            academic_details: studentData,
            eligibility: eligibility,
            scholarship_recommendations: recommendations,
            performance: performance
        };

        res.json({ 
            success: true, 
            data: report 
        });
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error generating report' 
        });
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('Node.js Backend Server Starting...');
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log('Database: JSON file (data.json)');
    console.log('Make sure to serve your HTML file from an HTTP server');
    console.log('='.repeat(60));
});
