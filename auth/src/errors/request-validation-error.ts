import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  
  constructor(public errors: ValidationError[]) {
    
    // Calling the parent class (Error) constructor as this is a constructor of sub-class
    super();

    // Since we are extending a built-in class (Error) the following line of cade has to be added
    Object.setPrototypeOf(this, RequestValidationError.prototype);
    
  }

}
