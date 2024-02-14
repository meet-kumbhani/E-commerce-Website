import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const Productdetails = ({ addToCart, cart, setter }) => {
  let { id } = useParams();
  const [productdata, setproductdata] = useState([]);
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

  let handelcart = () => {
    axios.post("http://localhost:3002/cart", { ...productdata }).then(() => {
      if (!addcart) {
        setaddcart(true);
        addToCart(productdata);
      }
    });
  };

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
  }, [setter]);

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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let handleQuantityChange = (id) => {
    let cartProduct = cart.find((item) => item.id == id);

    if (cartProduct) {
      let updatedQuantity = cartProduct.quantity + 1;
      setaddcart(true);
      updateQuantity(id, updatedQuantity);
      setquantity(updatedQuantity);
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
                  <img src={productdata.image} alt="" className=" w-70 h-70" />
                  <div className="buttons mt-4">
                    {!addcart ? (
                      <>
                        <button className="buynow-btn me-2">Buy Now</button>
                        <button className="cart-btn" onClick={handelcart}>
                          Add To Cart
                        </button>
                      </>
                    ) : (
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
