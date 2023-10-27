import { useState } from "react";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

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
      <form>
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
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
