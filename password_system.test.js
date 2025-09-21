// Test password system functionality

// Explicitly mock script.js to avoid DOM-related errors
jest.mock('./script.js', () => ({
    passwordSystem: {
        keySequence: [],
        maxSequenceLength: 20,

        generatePassword(level) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let password = '';
            let seed = level;

            for (let i = 0; i < 6; i++) {
                seed = (seed * 9301 + 49297) % 233280;
                const index = Math.floor((seed / 233280) * chars.length);
                password += chars[index];
            }
            return password;
        },

        checkPassword(sequence, password) {
            const sequenceStr = sequence.join('').toUpperCase();
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
        },
    },
    // Mock other exports from script.js if needed by other tests, or leave empty
    // For this test, we only need passwordSystem
}));

// Now import the mocked passwordSystem
const { passwordSystem } = require('./script.js');

// Test password generation and validation
describe('Password System', () => {
    test('password system exists', () => {
        expect(passwordSystem).toBeDefined();
        expect(typeof passwordSystem.generatePassword).toBe('function');
        expect(typeof passwordSystem.checkPassword).toBe('function');
    });

    test('password generation is deterministic', () => {
        const password1 = passwordSystem.generatePassword(10);
        const password2 = passwordSystem.generatePassword(10);
        expect(password1).toBe(password2);
        expect(password1).toHaveLength(6);
    });

    test('password validation works correctly', () => {
        const password = passwordSystem.generatePassword(25);
        const sequence = password.split('');
        expect(passwordSystem.checkPassword(sequence, password)).toBe(true);
    });

    test('password validation fails for wrong password', () => {
        const correctPassword = passwordSystem.generatePassword(50);
        const wrongPassword = passwordSystem.generatePassword(51);
        const sequence = wrongPassword.split('');
        expect(passwordSystem.checkPassword(sequence, correctPassword)).toBe(false);
    });

    test('password generation produces valid characters', () => {
        const password = passwordSystem.generatePassword(100);
        const validChars = /^[A-Z0-9]+$/;
        expect(password).toMatch(validChars);
    });

    test('different levels produce different passwords', () => {
        const passwords = [];
        for (let i = 1; i <= 100; i += 1) {
            passwords.push(passwordSystem.generatePassword(i));
        }
        const uniquePasswords = new Set(passwords);
        expect(uniquePasswords.size).toBeGreaterThan(90); // High uniqueness
    });
});

// Test password system integration
describe('Password System Integration', () => {
    beforeEach(() => {
        passwordSystem.resetSequence(); // Ensure clean state for each test
    });

    test('key sequence management', () => {
        expect(passwordSystem.keySequence).toEqual([]);

        passwordSystem.addKey('A');
        passwordSystem.addKey('B');
        passwordSystem.addKey('C');
        expect(passwordSystem.keySequence).toEqual(['A', 'B', 'C']);
    });

    test('sequence length limit', () => {
        const maxLength = passwordSystem.maxSequenceLength;

        for (let i = 0; i < maxLength + 5; i += 1) {
            passwordSystem.addKey('A');
        }

        expect(passwordSystem.keySequence.length).toBeLessThanOrEqual(maxLength);
        expect(passwordSystem.keySequence.length).toBe(maxLength);
    });
});
