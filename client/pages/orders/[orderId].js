import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState("");

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

  return <div>Time left to complete payment: {timeLeft} seconds.</div>;
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
