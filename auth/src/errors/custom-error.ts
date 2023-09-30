export abstract class CustomError extends Error {

  abstract statusCode: number;

  constructor(message: string) {
    // Calling the parent class (Error) constructor as this is a constructor of sub-class
    super(message);

    // Since we are extending a built-in class (Error) the following line of cade has to be added
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
};