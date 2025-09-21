// Test password system functionality
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
  test('key sequence management', () => {
    passwordSystem.resetSequence();
    expect(passwordSystem.keySequence).toEqual([]);

    passwordSystem.addKey('A');
    passwordSystem.addKey('B');
    passwordSystem.addKey('C');
    expect(passwordSystem.keySequence).toEqual(['A', 'B', 'C']);
  });

  test('sequence length limit', () => {
    passwordSystem.resetSequence();
    const maxLength = passwordSystem.maxSequenceLength;

    for (let i = 0; i < maxLength + 5; i += 1) {
      passwordSystem.addKey('A');
    }

    expect(passwordSystem.keySequence.length).toBeLessThanOrEqual(maxLength);
  });
});
