class CustomValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomValidationException";
  }
}

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
  }
}

module.exports = { CustomValidationException, NotFoundException };
