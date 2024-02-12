import React, { useEffect, useState } from "react";
import { FormControl, Form, Pagination } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import axios from "axios";

const Productlist = () => {
  const [itemdata, setItemdata] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/phones")
      .then((result) => {
        setItemdata(result.data);
      })
      .catch((err) => {
        console.log("==>", err);
      });
  }, []);

  const filteredItems = itemdata.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchInput.toLowerCase()) &&
      (selectedFilter === "All" || item.storage === selectedFilter)
    );
  });

  const lastitemindex = currentPage * itemsPerPage;
  const firstitemindex = lastitemindex - itemsPerPage;
  const currentphones = filteredItems.slice(firstitemindex, lastitemindex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (filteredItems.length === 0) {
    return (
      <center className="page_404 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center ">404</h1>
                </div>

                <div className="contant_box_404">
                  <h3 className="h2">Look like you're lost</h3>

                  <p>the page you are looking for not avaible!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </center>
    );
  }

  return (
    <>
      <div className="container-fluid bg-dark">
        <div className="py-3 d-flex justify-content-between align-items-center count-search">
          <h3 className="text-white">
            Showing {firstitemindex + 1} to{" "}
            {Math.min(lastitemindex, filteredItems.length)} of{" "}
            {filteredItems.length} Results For "Phone"
          </h3>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Form.Select
              className="me-2"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="2GB">2GB</option>
              <option value="4GB">4GB</option>
              <option value="6GB">6GB</option>
              <option value="8GB">8GB</option>
              <option value="16GB">16GB</option>
              <option value="32GB">32GB</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
            </Form.Select>
          </Form>
        </div>

        <div className="row">
          {currentphones.map((item) => (
            <div className="col-md-4 col-lg-3 col-sm-6 mb-4" key={item.id}>
              <Link className="nav-link" to={`/productdetails/${item.id}`}>
                <Card className="w-100 h-100">
                  <Card.Img
                    variant="top"
                    src={item.image}
                    width="100%"
                    height="350px"
                    className="p-1"
                  />
                  <Card.Body>
                    <Card.Title>
                      <p>{item.name}</p>
                      <p>{item.model}</p>
                      <p>{item.storage}</p>
                    </Card.Title>
                    <Card.Text>
                      <h3>Price: ₹{item.price}</h3>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center">
          <Pagination className="mt-3">
            {[...Array(Math.ceil(filteredItems.length / itemsPerPage))].map(
              (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default Productlist;
