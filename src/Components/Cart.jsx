import axios from "axios";
import React, { useEffect } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const Cart = ({ cart, setter }) => {
  useEffect(() => {
    axios
      .get(`http://localhost:3002/cart`)
      .then((a) => {
        setter(a.data);
        console.log(a.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .delete(`http://localhost:3002/cart/abc`)
      .then(() => {
        axios
          .get(`http://localhost:3002/cart`)
          .then((response) => {
            setter(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setter]);

  const Deleteitem = (id) => {
    axios
      .delete(`http://localhost:3002/cart/${id}`)
      .then(() => {
        axios
          .get(`http://localhost:3002/cart`)
          .then((response) => {
            setter(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateQuantity = (id, newQuantity) => {
    axios
      .patch(`http://localhost:3002/cart/${id}`, { quantity: newQuantity })
      .then(() => {
        axios
          .get(`http://localhost:3002/cart`)
          .then((response) => {
            setter(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  return (
    <>
      <section className="cart-part container">
        {cart.map((item, id) => (
          <div className="row mt-5" key={item.id}>
            <div className="col-md-2 col-lg-2 col-sm-12">
              <img src={item.image} alt="cart-img" className="w-100 h-100" />
            </div>

            <div className="col-md-10 col-lg-10 col-sm-12">
              <div className="item-details">
                <h5>{item.fullname}</h5>
                <h5>Price:- ₹{item.price}/- Only❣</h5>
                <h5>Variant:- {item.storage}</h5>
                <h5 className="d-flex align-items-center">
                  Quantity:-
                  <RemoveCircleOutlineIcon
                    fontSize="small"
                    className="me-2"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  />
                  {item.quantity}
                  <ControlPointIcon
                    fontSize="small"
                    className="ms-2"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  />
                </h5>

                <h4>Total:- ₹{item.price * item.quantity}</h4>

                <button
                  className="btn btn-outline-danger rounded-pill"
                  onClick={() => Deleteitem(item.id)}
                >
                  Remove item
                </button>
              </div>
            </div>
          </div>
        ))}
        <hr />
        <h3 className="text-end">
          Total Amount: ₹
          {cart.reduce(
            (total, item) => total + item?.price * item?.quantity,
            0
          )}
        </h3>
      </section>
    </>
  );
};

export default Cart;
