import axios from "axios";

const IndexPage = ({ currentUser }) => {
  return (
    <>
      {!currentUser ? (
        <h1>Landing Page</h1>
      ) : (
        <>
          <h1>Landing Page</h1>
          <br />
          <h5>Welcome {currentUser.email}</h5>
        </>
      )}
    </>
  );
};

IndexPage.getInitialProps = async ({ req }) => {
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
    const response = await axios
      .get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        { headers: req.headers }
      )
      .catch((err) => {
        console.log("Request Failed with Following Error: ", err);
      });

    return response?.data || { currentUser: null };
  } else {
    // Current environment is the browser environment - use normal request url pattern with axios.
    const response = await axios.get("/api/users/currentuser").catch((err) => {
      console.log(err.message);
    });

    return response.data;
  }
};

export default IndexPage;
