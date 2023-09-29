export class DatabaseConnectionError extends Error {
  reason = "Error connecting to database!!!";

  constructor() {
    // Calling the parent class (Error) constructor as this is a constructor of sub-class
    super();

    // Since we are extending a built-in class (Error) the following line of cade has to be added
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
