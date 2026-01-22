/**
 * Simple script to view stored data in a readable format
 * Run: node view_data.js
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function viewData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.log('❌ No data file found. Register a user first!');
            return;
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 STORED DATA VIEWER');
        console.log('='.repeat(60));
        
        // Users
        console.log('\n👥 REGISTERED USERS:');
        console.log('-'.repeat(60));
        if (data.users && data.users.length > 0) {
            data.users.forEach((user, index) => {
                console.log(`\nUser #${index + 1}:`);
                console.log(`  ID: ${user.id}`);
                console.log(`  Name: ${user.name}`);
                console.log(`  Email: ${user.email}`);
                console.log(`  Phone: ${user.phone || 'Not provided'}`);
                console.log(`  Registered: ${new Date(user.created_at).toLocaleString()}`);
                console.log(`  Password: [HASHED - ${user.password_hash.substring(0, 20)}...]`);
            });
        } else {
            console.log('  No users registered yet.');
        }
        
        // Student Details
        console.log('\n📚 STUDENT ACADEMIC DETAILS:');
        console.log('-'.repeat(60));
        if (data.student_details && data.student_details.length > 0) {
            data.student_details.forEach((detail, index) => {
                console.log(`\nDetails #${index + 1} (User ID: ${detail.user_id}):`);
                console.log(`  Roll Number: ${detail.roll_number}`);
                console.log(`  B.Tech Year: ${detail.btech_year}`);
                console.log(`  Gender: ${detail.gender}`);
                console.log(`  Category: ${detail.category}`);
                console.log(`  Quota Type: ${detail.quota_type}`);
                console.log(`  Present CGPA: ${detail.present_cgpa}`);
                console.log(`  Previous CGPA: ${detail.previous_cgpa}`);
                console.log(`  Attendance: ${detail.attendance}%`);
                console.log(`  Active Backlogs: ${detail.active_backlogs}`);
                console.log(`  Last Updated: ${new Date(detail.updated_at).toLocaleString()}`);
            });
        } else {
            console.log('  No academic details saved yet.');
            console.log('  (Users need to fill the Academic Input form)');
        }
        
        console.log('\n' + '='.repeat(60));
        console.log(`📁 Data file location: ${DATA_FILE}`);
        console.log('='.repeat(60) + '\n');
        
    } catch (error) {
        console.error('❌ Error reading data:', error.message);
    }
}

viewData();

