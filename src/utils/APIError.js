class APIError extends Error {
  constructor(message, statusCode, internalMessage) {
    super(message);
    this.statusCode = statusCode;
    if (internalMessage !== undefined) {
      this.internalMessage = internalMessage;
    }
    this.name = this.constructor.name;
  }
}

export default APIError;