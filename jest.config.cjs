// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)', // Matches files in __tests__ directory
    '**/?(*.)+(spec|test).[tj]s?(x)', // Matches any .spec.js, .test.js, .spec.ts, .test.ts files
    'src/tests/**/*.[jt]s?(x)', // Matches files in src/tests directory
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
