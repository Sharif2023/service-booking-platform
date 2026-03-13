const pool = require('./src/config/database');
const User = require('./src/models/User');
const crypto = require('crypto');

async function testRegister() {
    try {
        const email = `test_${Date.now()}@example.com`;
        const verificationToken = crypto.randomBytes(32).toString('hex');
        console.log(`Testing registration for: ${email}`);
        
        const user = await User.create(email, 'password123', 'Test User', '1234567890', 'user', verificationToken);
        console.log('Registration SUCCESS:', user);
        
        // Cleanup
        await pool.query('DELETE FROM users WHERE id = $1', [user.id]);
        console.log('Cleanup SUCCESS');
    } catch (error) {
        console.error('Registration FAILED:', error.message);
        if (error.detail) console.error('Detail:', error.detail);
    } finally {
        process.exit();
    }
}

testRegister();
