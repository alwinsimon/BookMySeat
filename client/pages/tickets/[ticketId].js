import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const [makeRequest, errors] = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (orderData) => {
      Router.push("/orders/[orderId]", `/orders/${orderData.id}`);
    },
  });

  const handleClick = async () => {
    makeRequest();
  };

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price} INR</h4>
      {errors}
      <button className="btn btn-primary" onClick={handleClick}>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
