function getAppBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export function getVerificationUrl(token: string): string {
  return `${getAppBaseUrl()}/verificationPage?key=${encodeURIComponent(token)}`;
}

export function getResetPasswordUrl(token: string): string {
  return `${getAppBaseUrl()}/resetPassword?token=${encodeURIComponent(token)}`;
}
