const IndexPage = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <>
        <h1>Landing Page</h1>
        <br />
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

IndexPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default IndexPage;
