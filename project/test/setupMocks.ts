// Prevent lib/db.ts from calling neon() with no DATABASE_URL at import time
jest.mock("@/lib/db", () => ({ sql: jest.fn() }));

// Prevent lib/mail.ts from calling sgMail.setApiKey() at import time
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));
