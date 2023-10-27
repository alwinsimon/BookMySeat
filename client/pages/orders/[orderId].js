import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const milliSecondsLeft = new Date(order.expiresAt) - new Date();
      const secondsLeft = Math.round(milliSecondsLeft / 1000);

      setTimeLeft(secondsLeft);
    };

    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div>
        <h3 className="text text-danger">Order Expired !!!</h3>
      </div>
    );
  }

  return (
    <div>
      Time left to complete payment: {timeLeft} seconds.
      <StripeCheckout
        token={(token) => {
          console.log(token);
        }}
        stripeKey="pk_test_51O53zRSJtuYafghXhYNZzaJqYAh6afqRduQ3UAMs6Wm4vkv30ayq09gBPgU3jYkQPXrofQa9aRbIlb4uuCp3FC6O000J86xaKc"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
