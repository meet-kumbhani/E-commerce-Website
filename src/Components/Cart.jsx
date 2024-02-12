import axios from "axios";
import React, { useEffect } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const Cart = ({ cart, setter }) => {
  useEffect(() => {
    axios
      .get(`http://localhost:3001/cart`)
      .then((a) => {
        setter(a.data);
        console.log(a.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .delete(`http://localhost:3001/cart/abc`)
      .then(() => {
        axios
          .get(`http://localhost:3001/cart`)
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
      .delete(`http://localhost:3001/cart/${id}`)
      .then(() => {
        axios
          .get(`http://localhost:3001/cart`)
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

  return (
    <>
      <section className="cart-part container">
        {cart.map((item, id) => (
          <div className="row mt-5" key={item.id}>
            <div className="col-md-2 col-lg-2 col-sm-12">
              <img
                src={item?.productdata?.image || item.image}
                alt="cart-img"
                className="w-100 h-100"
              />
            </div>

            <div className="col-md-10 col-lg-10 col-sm-12">
              <div className="item-details">
                <h5>{item?.productdata?.fullname || item.fullname}</h5>
                <h5>
                  Price:- ₹{item?.productdata?.price || item.price}/- Only❣
                </h5>
                <h5>Variant:- {item?.productdata?.storage || item.storage}</h5>

                <h5 className="d-flex align-items-center">
                  Quantity:-
                  <RemoveCircleOutlineIcon fontSize="small" className="me-2" />
                  {item?.productdata?.quantity || item.quantity}
                  <ControlPointIcon fontSize="small" className="ms-2" />
                </h5>

                <h4>Total:- ₹{""}</h4>

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
        <h3 className="text-end">Total Amount: ₹{""}</h3>
      </section>
    </>
  );
};

export default Cart;
