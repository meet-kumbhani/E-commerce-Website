import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const Productdetails = ({ addToCart }) => {
  let { id } = useParams();
  const [productdata, setproductdata] = useState(null);
  const [addcart, setaddcart] = useState(false);
  const [quantity, setquantity] = useState([]);

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
        setquantity(a.data);
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
            setquantity(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [quantity]);

  const updateQuantity = (id, newQuantity) => {
    axios
      .patch(`http://localhost:3002/cart/${id}`, { quantity: newQuantity })
      .then(() => {
        axios
          .get(`http://localhost:3002/cart`)
          .then((response) => {
            setquantity(response.data);
            setaddcart(true);
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
                        {quantity.map((i) => (
                          <>
                            <h5 className="d-flex align-items-center">
                              Quantity:-
                              <RemoveCircleOutlineIcon
                                fontSize="small"
                                className="me-2"
                                onClick={() =>
                                  handleQuantityChange(i.id, i.quantity - 1)
                                }
                              />
                              {i.quantity}
                              <ControlPointIcon
                                fontSize="small"
                                className="ms-2"
                                onClick={() =>
                                  handleQuantityChange(i.id, i.quantity + 1)
                                }
                              />
                            </h5>
                          </>
                        ))}
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
