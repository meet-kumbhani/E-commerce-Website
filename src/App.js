import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Mynavbar from './Components/Mynavbar';
import Productlist from './Components/Productlist';
import Cart from './Components/Cart';
import Productdetails from './Components/Productdetails';

function App() {

  const [cart, setCart] = useState([]);

  const addToCart = (productdata) => {
    setCart([...cart, productdata]);
  };

  return (
    <>
      <BrowserRouter>
        <Mynavbar totalitems={cart.length} />
        <Routes>
          <Route path='/' element={<Productlist />}></Route>
          <Route path='/cart' element={<Cart cart={cart} setter={setCart} />}></Route>
          <Route path='/productdetails/:id' element={<Productdetails addToCart={addToCart} productdata={cart} update={setCart} />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
