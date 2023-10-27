import Link from 'next/link';

const IndexPage = ({ currentUser, tickets }) => {
  if (!currentUser) {
    return (
      <>
        <h1>Landing Page</h1>
        <br />
        <h5>Signed Out</h5>
      </>
    );
  }

  let ticketList;
  if (currentUser) {
    ticketList = tickets.map((ticket) => {
      return (
        <tr key={ticket.id}>
          <td>{ticket.title}</td>
          <td>{ticket.price}</td>
          <td>
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
              View
            </Link>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <h5>Welcome {currentUser.email}</h5>

      <h1>Tickets</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>{currentUser && ticketList}</tbody>
      </table>
    </>
  );
};

IndexPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default IndexPage;
