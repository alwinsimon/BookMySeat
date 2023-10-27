import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [makeRequest, errors] = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title: title,
      price: price,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !price) {
      return;
    }

    makeRequest();
  };

  const roundOff = () => {
    const roundedPrice = parseFloat(price);

    if (isNaN(roundedPrice)) {
      // If price is not a number
      return;
    }

    setPrice(roundedPrice.toFixed(2));
  };
  return (
    <div>
      <h1>Create A Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            type="number"
            step="0.01"
            onBlur={roundOff}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
