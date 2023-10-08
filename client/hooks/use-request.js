import { useState } from "react";
import axios from "axios";

export default ({ url, method, body }) => {
  const [errors, setErrors] = useState(null);

  const makeRequest = async () => {
    try {
      setErrors(null); // Setting error to null initially to prevent errors from being displayed always.

      const response = await axios[method](url, body);
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h5>Oops!!!</h5>
          <ul className="my-0">
            {err.response?.data?.errors?.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return [ makeRequest, errors ]
};
