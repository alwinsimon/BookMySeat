import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header {currentUser?.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  try {
    const client = buildClient(appContext.ctx);
    const response = await client.get("/api/users/currentuser");

    // If the child component has getInitialProps method, then execute it manually from here.
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return { pageProps, currentUser: response.data.currentUser };
  } catch (err) {
    console.error("Error in making request to get current user:", err.message);
    return { pageProps: {}, currentUser: null };
  }
};

export default AppComponent;
