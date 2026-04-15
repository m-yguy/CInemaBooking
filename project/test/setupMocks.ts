// Prevent db singleton from connecting when DATABASE_URL is missing in tests.
jest.mock("@/lib/dbSingleton", () => ({ sql: jest.fn() }));

// Prevent lib/mail.ts from calling sgMail.setApiKey() at import time
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));
