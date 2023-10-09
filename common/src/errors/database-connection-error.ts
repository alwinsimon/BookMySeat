import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  
  statusCode = 500;
  
  reason = 'Error connecting to database!!!';

  constructor() {
    // Calling the parent class (Error) constructor as this is a constructor of sub-class
    super('Error connecting to database!!!');

    // Since we are extending a built-in class (Error) the following line of cade has to be added
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(){
    return [ { message: this.reason} ]
  }
}
