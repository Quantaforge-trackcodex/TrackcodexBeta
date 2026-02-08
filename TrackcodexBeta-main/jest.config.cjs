/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testTimeout: 30000,
    setupFilesAfterEnv: [],
    moduleNameMapper: {
        // Handle CSS imports (mock them)
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
        // Handle asset imports
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }]
    }
};
