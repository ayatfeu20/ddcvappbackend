class HttpException extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

export default HttpException;
