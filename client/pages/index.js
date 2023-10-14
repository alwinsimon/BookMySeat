import buildClient from "../api/build-client";

const IndexPage = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <>
        <h1>Landing Page</h1>
        <br/>
        <h5>Signed Out</h5>
      </>
    );
  }

  return (
    <>
      <h1>Landing Page</h1>
      <br />
      <h5>Welcome {currentUser.email}</h5>
    </>
  );
};

IndexPage.getInitialProps = async (context) => {
  try {
    const client = buildClient(context);
    const response = await client.get("/api/users/currentuser");
    return response.data;
  } catch (err) {
    console.error("Error in making request to get current user:", err.message);
    return { currentUser: null };
  }
};

export default IndexPage;
