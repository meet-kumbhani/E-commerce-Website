import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

let ProductDetail = ({ kcart, setcart }) => {
    let { id } = useParams();
    let [product, setproduct] = useState(null);
    let [addtocart, setaddtocart] = useState(false);
    let [quantity, setquantity] = useState(1);

    useEffect(() => {
        axios
            .get(`http://localhost:3001/productsdata/${id}`)
            .then((response) => {
                setproduct(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/cart")
            .then((response) => {
                let foundproduct = response.data.find((item) => item.id === parseInt(id));
                if (foundproduct) {
                    setaddtocart(true);
                    setquantity(foundproduct.quantity);
                }
                setcart(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id, setcart]);

    let addcart = () => {
        axios
            .post(`http://localhost:3001/cart`, { ...product })
            .then(() => {
                setaddtocart(true);
                setquantity(1);
                setcart(prev => [...prev, { ...product, quantity }]);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    let updatequantity = (id, newqty) => {
        axios
            .patch(`http://localhost:3001/cart/${id}`, { quantity: newqty })
            .then(() => {
                setquantity(newqty);
                setcart(prev => prev.map(item => item.id === id ? { ...item, quantity: newqty } : item));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let quantitychange = (id, change) => {
        let cartproduct = kcart.find((item) => item.id === id);
        if (cartproduct) {
            let nqt = cartproduct.quantity + change;
            if (nqt < 1) {
                nqt = 1;
            }
            updatequantity(id, nqt);
        }
    };

    return (
        <>
            <div>
                {product ? (
                    <div className="container mt-5 mb-3">
                        <div className="row">
                            <div className="col-md-12 col-lg-6 col-sm-12 mt-5 mb-5">
                                <div>
                                    <img
                                        src={product.image}
                                        alt="Not Found"
                                        width={"70%"}
                                        height={"400px"}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-6 col-sm-12 mt-5">
                                <div>
                                    <h2>{product.type}</h2>
                                    <h6>Brand : {product.brand}</h6>
                                    <h6>Color : {product.color}</h6>
                                    <h6>Size : {product.size}</h6>
                                    <h6>Price: ₹ {product.price}</h6>
                                    <h6>Description : {product.description}</h6>
                                </div>
                                <div className="mt-5">
                                    {addtocart ? (
                                        <div className="d-flex align-items-center">
                                            <button className="me-5 btn btn-success">
                                                Buy Now
                                            </button>
                                            <button className="btn btn-warning">
                                                Quantity :
                                                <FaMinusCircle className="me-2 ms-2" onClick={() => quantitychange(product.id, -1)}
                                                /> {quantity} <FaPlusCircle className="ms-2" onClick={() => quantitychange(product.id, 1)}
                                                /></button>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center">
                                            <button className="me-5 btn btn-success">
                                                Buy Now
                                            </button>
                                            <button className="me-5 btn btn-warning" onClick={addcart}>
                                                Add To Cart
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default ProductDetail;