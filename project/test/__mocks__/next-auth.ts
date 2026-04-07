export class AuthError extends Error {
  type: string;
  constructor(type = "AuthError") {
    super(type);
    this.type = type;
  }
}
export default {};
