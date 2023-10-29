import axios from "axios";

export default ({ req }) => {
  // Determine the environment from where the network request is made.
  if (typeof window === "undefined") {
    /*
     In the browser environment, there will be a window object. 
     If the window object type is un-defined, then assume that the current environment is not the browser environment.
     Which means that the current environment is The SERVER environment (for SSR) or the current environment is the NodeJs running inside the container.
    */

    /*
     Since this request will be made from inside of the container, 
     Make the request in such a way that it'll be redirected to the ingress-nginx server running in a different namespace in k8s cluster.
    */
   
    return axios.create({
      baseURL:
        "http://bms.alwinsimon.com/",
      headers: req.headers,
    });
  } else {
    // Current environment is the browser environment - use normal request url pattern with axios.
    return axios.create({
      baseURL:
        "/",
    });
  }
};
