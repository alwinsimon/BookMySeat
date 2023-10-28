const OrderIndex = ({ orders }) => {
  return (
    <>
      <ul>
        {orders.map((order) => {
          return (
            <li key={orders.id}>
              {order.ticket.title} - {order.status}
            </li>
          );
        })}
      </ul>
    </>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const response = await client.get("/api/orders");

  return { orders: response.data };
};

export default OrderIndex;
