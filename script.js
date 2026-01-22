// ====================================
// API CONFIGURATION
// ====================================

const API_BASE_URL = 'http://localhost:3000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        credentials: 'include', // Important for session cookies
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };

    try {
        const response = await fetch(url, config);
        
        // Check if response is JSON before parsing
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // If not JSON, get text response
            const text = await response.text();
            data = { message: text || 'Server returned non-JSON response' };
        }

        // Handle 401 - redirect to login
        // Only show "Session expired" if we were previously logged in
        if (response.status === 401) {
            // Don't show alert during initialization or registration/login attempts
            // Only show if we have a stored session that expired
            const isAuthEndpoint = endpoint === '/login' || endpoint === '/register';
            const isInitialization = endpoint === '/student/details' && !currentUser;
            
            if (!isAuthEndpoint && !isInitialization) {
                // Only show alert if user was logged in before
                showAuth();
                alert('Session expired. Please login again.');
            }
            return { success: false, message: 'Authentication required' };
        }

        return { success: response.ok, data, status: response.status };
    } catch (error) {
        console.error('API Error:', error);
        let errorMessage = 'Network error. Please check if the backend server is running.';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Failed to connect to backend server. Make sure Node.js backend is running on http://localhost:3000\n\nRun: npm start';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS error. Make sure the backend allows your origin.';
        }
        
        return { 
            success: false, 
            message: errorMessage,
            error: error.message
        };
    }
}

// ====================================
// DATA STORAGE
// ====================================

let currentUser = null;
let academicData = null;

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Test backend connection first
    try {
        const testResult = await apiCall('/', { method: 'GET' });
        if (!testResult.success && !testResult.error) {
            console.warn('Backend connection test failed. Make sure Node.js backend server is running on http://localhost:3000');
        }
    } catch (error) {
        console.error('Could not connect to backend:', error);
    }
    
    // Check if user is logged in by trying to get student details
    // Suppress error alerts during initialization
    const result = await apiCall('/student/details', { method: 'GET' });
    
    if (result.success && result.data && result.data.data) {
        // User is logged in and has academic data
        academicData = result.data.data;
        showDashboard();
    } else if (result.status === 404) {
        // User is logged in but no academic details yet - show dashboard
        showDashboard();
    } else {
        // Not logged in (401 or other error) - show auth page silently
        // Don't show any alerts during initialization
        showAuth();
    }

    // Setup event listeners
    setupAuthListeners();
    setupDashboardListeners();
}

// ====================================
// AUTHENTICATION FUNCTIONS
// ====================================

function setupAuthListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Toggle between login and register
    document.getElementById('show-register').addEventListener('click', function(e) {
        e.preventDefault();
        switchToRegister();
    });
    
    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        switchToLogin();
    });
}

function switchToRegister() {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('register-page').classList.add('active');
}

function switchToLogin() {
    document.getElementById('register-page').classList.remove('active');
    document.getElementById('login-page').classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    const result = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    if (result.success) {
        // Load user data and academic details
        await loadUserData();
        showDashboard();
    } else {
        const errorMsg = result.data?.message || result.message || 'Login failed. Please try again.';
        if (result.error && result.error.includes('Failed to fetch')) {
            alert('Cannot connect to backend server.\n\n' +
                  'Please make sure:\n' +
                  '1. Node.js backend is running on http://localhost:3000\n' +
                  '2. You are serving the HTML file from an HTTP server (not opening it directly)\n\n' +
                  'To start backend: npm start\n' +
                  'To serve HTML: python -m http.server 8000\n' +
                  'Then open: http://localhost:8000/index.html');
        } else {
            alert(errorMsg);
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;
    
    const result = await apiCall('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
    });
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    if (result.success) {
        alert('Registration successful! Redirecting to dashboard...');
        await loadUserData();
        showDashboard();
    } else {
        const errorMsg = result.data?.message || result.message || 'Registration failed. Please try again.';
        if (result.error && result.error.includes('Failed to fetch')) {
            alert('Cannot connect to backend server.\n\n' +
                  'Please make sure:\n' +
                  '1. Node.js backend is running on http://localhost:3000\n' +
                  '2. You are serving the HTML file from an HTTP server (not opening it directly)\n\n' +
                  'To start backend: npm start\n' +
                  'To serve HTML: python -m http.server 8000\n' +
                  'Then open: http://localhost:8000/index.html');
        } else {
            alert(errorMsg);
        }
    }
}

async function loadUserData() {
    // Try to get student details to check if logged in
    const detailsResult = await apiCall('/student/details', { method: 'GET' });
    if (detailsResult.success && detailsResult.data && detailsResult.data.data) {
        academicData = detailsResult.data.data;
    }
    
    // For user profile, we'll get it from the report endpoint or store it locally
    // Since backend doesn't have a /user/profile endpoint, we'll use report data
    const reportResult = await apiCall('/student/report', { method: 'GET' });
    if (reportResult.success && reportResult.data && reportResult.data.data) {
        currentUser = reportResult.data.data.user_profile;
        academicData = reportResult.data.data.academic_details;
    }
}

function showAuth() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('dashboard-container').classList.add('hidden');
    currentUser = null;
    academicData = null;
}

async function showDashboard() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    
    // Load user data if not already loaded
    if (!currentUser) {
        await loadUserData();
    }
    
    // Update user greeting
    if (currentUser) {
        document.getElementById('user-name-display').textContent = `Welcome, ${currentUser.name || 'User'}!`;
    } else {
        document.getElementById('user-name-display').textContent = 'Welcome!';
    }
    
    // Update profile display if data exists
    if (academicData) {
        updateProfileDisplay();
    }
}

// ====================================
// DASHBOARD NAVIGATION
// ====================================

function setupDashboardListeners() {
    // Icon cards click handlers
    const iconCards = document.querySelectorAll('.icon-card');
    iconCards.forEach(card => {
        card.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section === 'logout') {
                handleLogout();
            } else {
                showSection(section);
            }
        });
        // Enable keyboard activation (Enter/Space)
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                if (section === 'logout') {
                    handleLogout();
                } else {
                    showSection(section);
                }
            }
        });
    });
    
    // Academic form submit
    document.getElementById('academic-form').addEventListener('submit', handleAcademicSubmit);
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Load section-specific data
        loadSectionData(sectionId);
        focusFirstInput(sectionId);
    }
}

function closeSection() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
}

async function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'user-details':
            await updateProfileDisplay();
            break;
        case 'eligibility':
            await checkEligibility();
            break;
        case 'recommendations':
            await loadRecommendations();
            break;
        case 'internships':
            // Internships section is static, no data loading needed
            break;
        case 'performance':
            await showPerformanceAnalysis();
            break;
        case 'download':
            await generateReportPreview();
            break;
    }
}

// Focus helper to make data entry faster
function focusFirstInput(sectionId) {
    if (sectionId === 'academic-input') {
        const rollInput = document.getElementById('roll-number');
        if (rollInput) rollInput.focus();
    } else if (sectionId === 'user-details') {
        // If user data missing, nudge toward academic input to fill details
        if (!academicData) {
            setTimeout(() => showSection('academic-input'), 300);
        }
    }
}

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        await apiCall('/logout', { method: 'GET' });
        currentUser = null;
        academicData = null;
        showAuth();
        
        // Clear forms
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
    }
}

// ====================================
// ACADEMIC DATA HANDLING
// ====================================

async function handleAcademicSubmit(e) {
    e.preventDefault();
    
    const academicFormData = {
        roll_number: document.getElementById('roll-number').value,
        btech_year: document.getElementById('btech-year').value,
        present_cgpa: parseFloat(document.getElementById('present-cgpa').value),
        previous_cgpa: parseFloat(document.getElementById('previous-cgpa').value),
        attendance: parseFloat(document.getElementById('attendance').value),
        gender: document.getElementById('gender').value,
        category: document.getElementById('category').value,
        quota_type: document.getElementById('quota-type').value,
        active_backlogs: document.getElementById('backlogs').value
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    const result = await apiCall('/student/details', {
        method: 'POST',
        body: JSON.stringify(academicFormData),
    });
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    if (result.success) {
        academicData = academicFormData;
        updateProfileDisplay();
        alert('Academic data saved successfully!');
        closeSection();
    } else {
        alert(result.data?.message || result.message || 'Failed to save academic data. Please try again.');
    }
}

async function updateProfileDisplay() {
    // Load user data if not available
    if (!currentUser) {
        await loadUserData();
    }
    
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.name || '-';
        document.getElementById('profile-email').textContent = currentUser.email || '-';
        document.getElementById('profile-phone').textContent = currentUser.phone || '-';
    }
    
    if (academicData) {
        document.getElementById('profile-roll').textContent = academicData.roll_number || '-';
        document.getElementById('profile-year').textContent = academicData.btech_year || '-';
        document.getElementById('profile-gender').textContent = academicData.gender || '-';
        document.getElementById('profile-category').textContent = academicData.category || '-';
        document.getElementById('profile-quota').textContent = academicData.quota_type || '-';
    }
}

// ====================================
// ELIGIBILITY CHECK
// ====================================

async function checkEligibility() {
    const eligibilityResult = document.getElementById('eligibility-result');
    
    // Show loading
    eligibilityResult.innerHTML = '<div class="eligibility-placeholder"><p>Checking eligibility...</p></div>';
    
    const result = await apiCall('/scholarship/eligibility', { method: 'GET' });
    
    if (!result.success) {
        if (result.data?.message && result.data.message.includes('No student details')) {
            eligibilityResult.innerHTML = `
                <div class="eligibility-placeholder">
                    <p>Please fill in your academic details first to check eligibility.</p>
                    <button class="btn-secondary" onclick="showSection('academic-input')">Go to Academic Input</button>
                </div>
            `;
        } else {
            eligibilityResult.innerHTML = `
                <div class="eligibility-placeholder">
                    <p>Error: ${result.data?.message || result.message || 'Failed to check eligibility'}</p>
                </div>
            `;
        }
        return;
    }
    
    const eligibility = result.data.data;
    const isEligible = eligibility.eligible;
    
    if (isEligible) {
        eligibilityResult.className = 'eligibility-card eligible';
        eligibilityResult.innerHTML = `
            <div class="eligibility-status">✅</div>
            <div class="eligibility-title">Congratulations! You are Eligible</div>
            <div class="eligibility-message">
                You meet all the requirements for scholarship eligibility.
            </div>
            <div class="eligibility-details">
                <h4>Eligibility Criteria Met:</h4>
                <ul>
                    <li><span class="check">✓</span> All requirements met</li>
                </ul>
            </div>
        `;
    } else {
        eligibilityResult.className = 'eligibility-card not-eligible';
        const reasonsList = eligibility.reasons.map(reason => 
            `<li><span class="cross">✗</span> ${reason}</li>`
        ).join('');
        
        eligibilityResult.innerHTML = `
            <div class="eligibility-status">❌</div>
            <div class="eligibility-title">Not Eligible</div>
            <div class="eligibility-message">
                You need to meet the following requirements to be eligible for scholarships.
            </div>
            <div class="eligibility-details">
                <h4>Requirements Not Met:</h4>
                <ul>
                    ${reasonsList}
                </ul>
            </div>
        `;
    }
}

// ====================================
// SCHOLARSHIP RECOMMENDATIONS
// ====================================

async function loadRecommendations() {
    const governmentDiv = document.getElementById('government-scholarships');
    const privateDiv = document.getElementById('private-scholarships');
    const meritDiv = document.getElementById('merit-scholarships');
    
    // Clear existing content
    governmentDiv.innerHTML = '<p style="color: #6b7280; padding: 20px;">Loading recommendations...</p>';
    privateDiv.innerHTML = '';
    meritDiv.innerHTML = '';
    
    const result = await apiCall('/scholarship/recommendations', { method: 'GET' });
    
    if (!result.success) {
        if (result.data?.message && result.data.message.includes('No student details')) {
            governmentDiv.innerHTML = '<p style="color: #6b7280; padding: 20px;">Please fill in your academic details to get personalized recommendations.</p>';
        } else {
            governmentDiv.innerHTML = `<p style="color: #ef4444; padding: 20px;">Error: ${result.data?.message || result.message || 'Failed to load recommendations'}</p>`;
        }
        return;
    }
    
    const recommendations = result.data.data;
    
    // Render government scholarships
    if (recommendations.government_scholarships && recommendations.government_scholarships.length > 0) {
        governmentDiv.innerHTML = recommendations.government_scholarships.map(scholarship => `
            <a href="${scholarship.link}" target="_blank" class="scholarship-link">
                <span class="link-icon">🔗</span>
                <div class="internship-info">
                    <span class="internship-name">${scholarship.name}</span>
                    <span class="internship-desc">${scholarship.description || ''}</span>
                </div>
            </a>
        `).join('');
    } else {
        governmentDiv.innerHTML = '<p style="color: #6b7280; padding: 20px;">No specific government scholarships match your profile. Check the Merit-Based section for general scholarships.</p>';
    }
    
    // Render private scholarships
    if (recommendations.private_scholarships && recommendations.private_scholarships.length > 0) {
        privateDiv.innerHTML = recommendations.private_scholarships.map(scholarship => `
            <a href="${scholarship.link}" target="_blank" class="scholarship-link">
                <span class="link-icon">🔗</span>
                <div class="internship-info">
                    <span class="internship-name">${scholarship.name}</span>
                    <span class="internship-desc">${scholarship.description || ''}</span>
                </div>
            </a>
        `).join('');
    } else {
        privateDiv.innerHTML = '<p style="color: #6b7280; padding: 20px;">No specific private scholarships match your profile at this time.</p>';
    }
    
    // Render merit scholarships
    if (recommendations.merit_scholarships && recommendations.merit_scholarships.length > 0) {
        meritDiv.innerHTML = recommendations.merit_scholarships.map(scholarship => `
            <a href="${scholarship.link}" target="_blank" class="scholarship-link">
                <span class="link-icon">🔗</span>
                <div class="internship-info">
                    <span class="internship-name">${scholarship.name}</span>
                    <span class="internship-desc">${scholarship.description || ''}</span>
                </div>
            </a>
        `).join('');
    } else {
        meritDiv.innerHTML = '<p style="color: #6b7280; padding: 20px;">No merit-based scholarships available at this time.</p>';
    }
}

// ====================================
// PERFORMANCE ANALYSIS
// ====================================

async function showPerformanceAnalysis() {
    const performanceContent = document.getElementById('performance-content');
    
    // Show loading
    performanceContent.innerHTML = '<div class="performance-placeholder"><p>Loading performance analysis...</p></div>';
    
    const result = await apiCall('/student/performance', { method: 'GET' });
    
    if (!result.success) {
        if (result.data?.message && result.data.message.includes('No student details')) {
            performanceContent.innerHTML = `
                <div class="performance-placeholder">
                    <p>Please fill in your academic details first to view performance analysis.</p>
                    <button class="btn-secondary" onclick="showSection('academic-input')">Go to Academic Input</button>
                </div>
            `;
        } else {
            performanceContent.innerHTML = `
                <div class="performance-placeholder">
                    <p>Error: ${result.data?.message || result.message || 'Failed to load performance data'}</p>
                </div>
            `;
        }
        return;
    }
    
    const performance = result.data.data;
    const { trend, message, cgpa_difference, attendance_status, attendance } = performance;
    
    const attendanceColor = attendance >= 75 ? '#10b981' : '#ef4444';
    
    // Get academic data for CGPA values
    let presentCGPA = academicData?.present_cgpa || 0;
    let previousCGPA = academicData?.previous_cgpa || 0;
    
    // If we don't have academic data locally, try to get it
    if (!academicData) {
        const detailsResult = await apiCall('/student/details', { method: 'GET' });
        if (detailsResult.success && detailsResult.data && detailsResult.data.data) {
            academicData = detailsResult.data.data;
            presentCGPA = academicData.present_cgpa;
            previousCGPA = academicData.previous_cgpa;
        }
    }
    
    performanceContent.innerHTML = `
        <div class="performance-card">
            <h3>CGPA Comparison</h3>
            <div class="cgpa-comparison">
                <div class="cgpa-item">
                    <div class="cgpa-label">Previous Year</div>
                    <div class="cgpa-value">${previousCGPA.toFixed(2)}</div>
                </div>
                <div class="cgpa-item">
                    <div class="cgpa-label">Present Year</div>
                    <div class="cgpa-value">${presentCGPA.toFixed(2)}</div>
                </div>
            </div>
            <div class="improvement-message ${trend}">
                ${message}
            </div>
        </div>
        
        <div class="performance-card">
            <h3>Attendance Status</h3>
            <div class="attendance-status">
                <p><strong>Current Attendance:</strong> ${attendance}%</p>
                <div class="attendance-bar">
                    <div class="attendance-fill" style="width: ${attendance}%; background: ${attendanceColor};">
                        ${attendance}%
                    </div>
                </div>
                <p style="margin-top: 10px; color: ${attendanceColor}; font-weight: 600;">
                    ${attendance >= 75 ? '✓ Good attendance! Maintain this level.' : '⚠ Attendance below 75%. Please improve to maintain eligibility.'}
                </p>
            </div>
        </div>
    `;
}

// ====================================
// REPORT GENERATION
// ====================================

async function generateReportPreview() {
    const reportContent = document.getElementById('report-content');
    const reportDate = document.getElementById('report-date');
    
    // Set current date
    const today = new Date();
    reportDate.textContent = `Generated on: ${today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })}`;
    
    // Show loading
    reportContent.innerHTML = '<div class="report-section"><p>Loading report data...</p></div>';
    
    const result = await apiCall('/student/report', { method: 'GET' });
    
    if (!result.success) {
        if (result.data?.message && result.data.message.includes('No student details')) {
            reportContent.innerHTML = `
                <div class="report-section">
                    <p>Please fill in your user details and academic information to generate a complete report.</p>
                </div>
            `;
        } else {
            reportContent.innerHTML = `
                <div class="report-section">
                    <p>Error: ${result.data?.message || result.message || 'Failed to generate report'}</p>
                </div>
            `;
        }
        return;
    }
    
    const report = result.data.data;
    const { user_profile, academic_details, eligibility, performance } = report;
    
    // Update current user and academic data
    currentUser = user_profile;
    academicData = academic_details;
    
    const isEligible = eligibility.eligible;
    
    reportContent.innerHTML = `
        <div class="report-section">
            <h4>Student Profile</h4>
            <p><strong>Name:</strong> ${user_profile.name}</p>
            <p><strong>Email:</strong> ${user_profile.email}</p>
            <p><strong>Phone:</strong> ${user_profile.phone || '-'}</p>
            <p><strong>Roll Number:</strong> ${academic_details.roll_number}</p>
            <p><strong>B.Tech Year:</strong> ${academic_details.btech_year}</p>
            <p><strong>Gender:</strong> ${academic_details.gender}</p>
            <p><strong>Category:</strong> ${academic_details.category}</p>
            <p><strong>Quota Type:</strong> ${academic_details.quota_type}</p>
        </div>
        
        <div class="report-section">
            <h4>Academic Performance</h4>
            <p><strong>Present Year CGPA:</strong> ${academic_details.present_cgpa.toFixed(2)}</p>
            <p><strong>Previous Year CGPA:</strong> ${academic_details.previous_cgpa.toFixed(2)}</p>
            <p><strong>Attendance Percentage:</strong> ${academic_details.attendance}%</p>
            <p><strong>Active Backlogs:</strong> ${academic_details.active_backlogs}</p>
        </div>
        
        <div class="report-section">
            <h4>Scholarship Eligibility Status</h4>
            <p><strong>Status:</strong> <span style="color: ${isEligible ? '#10b981' : '#ef4444'}; font-weight: 700;">
                ${isEligible ? 'ELIGIBLE ✓' : 'NOT ELIGIBLE ✗'}
            </span></p>
            ${!isEligible && eligibility.reasons && eligibility.reasons.length > 0 ? 
                `<p style="color: #6b7280; font-size: 14px;">Reasons: ${eligibility.reasons.join(', ')}</p>` : ''}
        </div>
        
        <div class="report-section">
            <h4>Scholarship Recommendations</h4>
            <p>Based on your profile, you may be eligible for various scholarships. Please check the Scholarship Recommendations section for personalized links.</p>
        </div>
        
        <div class="report-section">
            <h4>Performance Summary</h4>
            <p><strong>CGPA Trend:</strong> ${performance.trend.charAt(0).toUpperCase() + performance.trend.slice(1)}</p>
            <p><strong>CGPA Change:</strong> ${performance.cgpa_difference > 0 ? '+' : ''}${performance.cgpa_difference.toFixed(2)}</p>
            <p><strong>Attendance Status:</strong> ${performance.attendance_status === 'good' ? 'Good' : 'Needs Improvement'}</p>
        </div>
    `;
}

function downloadReport() {
    // Since this is frontend-only, we'll create a simple text report
    if (!currentUser || !academicData) {
        alert('Please fill in your details first to download a report.');
        return;
    }
    
    const reportText = generateReportText();
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Report_${currentUser.name.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Report downloaded successfully!');
}

function generateReportText() {
    const { present_cgpa, previous_cgpa, attendance, active_backlogs } = academicData;
    const isEligible = 
        present_cgpa > 7.5 &&
        previous_cgpa > 7.5 &&
        attendance >= 75 &&
        active_backlogs === 'No';
    
    return `
STUDENT ACADEMIC & SCHOLARSHIP REPORT
=====================================
Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

STUDENT PROFILE
---------------
Name: ${currentUser.name}
Email: ${currentUser.email}
Phone: ${currentUser.phone || 'N/A'}
Roll Number: ${academicData.roll_number}
B.Tech Year: ${academicData.btech_year}
Gender: ${academicData.gender}
Category: ${academicData.category}
Quota Type: ${academicData.quota_type}

ACADEMIC PERFORMANCE
--------------------
Present Year CGPA: ${present_cgpa.toFixed(2)}
Previous Year CGPA: ${previous_cgpa.toFixed(2)}
Attendance Percentage: ${attendance}%
Active Backlogs: ${active_backlogs}

SCHOLARSHIP ELIGIBILITY
-----------------------
Status: ${isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}

PERFORMANCE SUMMARY
-------------------
CGPA Trend: ${present_cgpa > previous_cgpa ? 'Improving' : present_cgpa < previous_cgpa ? 'Declining' : 'Stable'}
Attendance Status: ${attendance >= 75 ? 'Good' : 'Needs Improvement'}

RECOMMENDATIONS
--------------
Please visit the Scholarship Recommendations section in the application
for personalized scholarship links based on your profile.

=====================================
End of Report
=====================================
    `.trim();
}

// Make functions globally accessible for onclick handlers
window.showSection = showSection;
window.closeSection = closeSection;
window.downloadReport = downloadReport;
