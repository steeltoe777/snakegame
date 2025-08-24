
// Test password system functionality
console.log("Testing password system...");

// Mock gameState for testing
const gameState = { level: 1 };

// Mock passwordSystem
const passwordSystem = {
    keySequence: [],
    maxSequenceLength: 20,

    generatePassword(level) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        let seed = level;

        for (let i = 0; i < 6; i++) {
            seed = (seed * 9301 + 49297) % 233280;
            const index = Math.floor((seed / 233280) * chars.length);
            password += chars[index];
        }

        return password;
    },

    checkPassword(sequence, password) {
        const sequenceStr = sequence.join("").toUpperCase();
        const passwordStr = password.toUpperCase();
        return sequenceStr === passwordStr;
    },

    resetSequence() {
        this.keySequence = [];
    },

    addKey(key) {
        this.keySequence.push(key.toUpperCase());
        if (this.keySequence.length > this.maxSequenceLength) {
            this.keySequence.shift();
        }
    }
};

// Test password generation for different levels
console.log("Passwords for levels 1-10:");
for (let level = 1; level <= 10; level++) {
    const password = passwordSystem.generatePassword(level);
    console.log(`Level ${level}: ${password}`);

    // Verify password length
    if (password.length !== 6) {
        console.error(`ERROR: Level ${level} password length is ${password.length}, expected 6`);
    }

    // Verify password contains only valid characters
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (const char of password) {
        if (!validChars.includes(char)) {
            console.error(`ERROR: Level ${level} password contains invalid character: ${char}`);
        }
    }
}

// Test password matching
console.log("\nTesting password matching:");
const testLevel = 5;
const testPassword = passwordSystem.generatePassword(testLevel);
console.log(`Test password for level ${testLevel}: ${testPassword}`);

// Test correct sequence
passwordSystem.resetSequence();
for (const char of testPassword) {
    passwordSystem.addKey(char);
}
const correctMatch = passwordSystem.checkPassword(passwordSystem.keySequence, testPassword);
console.log(`Correct sequence match: ${correctMatch}`);

// Test incorrect sequence
passwordSystem.resetSequence();
passwordSystem.addKey('A');
passwordSystem.addKey('B');
passwordSystem.addKey('C');
const incorrectMatch = passwordSystem.checkPassword(passwordSystem.keySequence, testPassword);
console.log(`Incorrect sequence match: ${incorrectMatch}`);

// Test case insensitivity
passwordSystem.resetSequence();
for (const char of testPassword.toLowerCase()) {
    passwordSystem.addKey(char);
}
const caseInsensitiveMatch = passwordSystem.checkPassword(passwordSystem.keySequence, testPassword);
console.log(`Case insensitive match: ${caseInsensitiveMatch}`);

console.log("Password system test completed!");
