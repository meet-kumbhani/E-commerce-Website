import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const Productdetails = ({ cart, setter }) => {
  let { id } = useParams();
  const [productdata, setproductdata] = useState(null);
  const [addcart, setaddcart] = useState(false);
  const [quantity, setquantity] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:3002/phones/${id}`)
      .then((result) => {
        setproductdata(result.data);
      })
      .catch((err) => {
        console.log("==>", err);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3002/cart`)
      .then((a) => {
        const foundProduct = a.data.find((item) => item.id === parseInt(id));
        if (foundProduct) {
          setaddcart(true);
          setquantity(foundProduct.quantity);
        }
        setter(a.data);
        console.log(a.data);
      })
      .catch(
        (err) => {
          console.log(err);
        },
        [id, setter]
      );
    axios
      .delete(`http://localhost:3002/cart/800`)
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
  }, [id, setter]);

  let handelcart = () => {
    axios
      .post("http://localhost:3002/cart", { ...productdata })
      .then(() => {
        setaddcart(true);
        setquantity(1);
        setter((prev) => [...prev, { ...productdata, quantity }]);
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
            setaddcart(true);
            // setquantity(newQuantity);
          })
          .catch((err) => {
            console.log(err);
          });
        setquantity(newQuantity);
        setter((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let handleQuantityChange = (id, increse) => {
    let cartProduct = cart.find((item) => item.id == id);

    if (cartProduct) {
      let updatedQuantity = cartProduct.quantity + increse;
      if (updatedQuantity < 1) {
        updatedQuantity = 1;
      }
      updateQuantity(id, updatedQuantity);
    }
  };

  return (
    <>
      {productdata ? (
        <>
          <div className="container mb-3">
            <div className="row">
              <div className="col-md-12 col-lg-6 col-sm-12 mt-5">
                <div className="image-part">
                  <img
                    src={productdata.image}
                    alt=""
                    width="70%"
                    height="500px"
                  />
                  <div className="buttons mt-4">
                    {addcart ? (
                      <>
                        <button className="buynow-btn me-2">Buy Now</button>

                        <h5 className="d-flex align-items-center">
                          Quantity:-
                          <RemoveCircleOutlineIcon
                            fontSize="small"
                            className="me-2"
                            onClick={() =>
                              handleQuantityChange(productdata.id, -1)
                            }
                          />
                          {quantity}
                          <ControlPointIcon
                            fontSize="small"
                            className="ms-2"
                            onClick={() =>
                              handleQuantityChange(productdata.id, 1)
                            }
                          />
                        </h5>
                      </>
                    ) : (
                      <>
                        <button className="buynow-btn me-2">Buy Now</button>
                        <button className="cart-btn" onClick={handelcart}>
                          Add To Cart
                        </button>

                        {/* <ControlPointIcon fontSize="small" className="ms-2" /> */}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-6 col-sm-12 mt-5">
                <div className="discription-part">
                  <h2>{productdata.fullname}</h2>
                  <h5>Model: {productdata.model}</h5>
                  <h5>{productdata.review}</h5>
                  <h5>Price: ₹{productdata.price} 10% Off</h5>
                  <h5>PackingFee: ₹{productdata.packaging_fee}</h5>

                  <h2 className="mt-5">Offers</h2>

                  <h5>{productdata.offers}</h5>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>hello</p>
      )}
    </>
  );
};

export default Productdetails;
