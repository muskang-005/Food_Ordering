// src/components/Headers.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../redux/features/authSlice';

const Headers = () => {
  const { carts } = useSelector((state) => state.allCart);
  const { favorites } = useSelector((state) => state.allCart); // Assuming favorites are stored in Redux
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <Navbar style={{ height: "60px", background: "royalblue", color: "white" }}>
        <Container>
          <NavLink to="/" className="text-decoration-none text-light mx-2">
            <h3 className='text-light'>FOOD CART</h3>
          </NavLink>
          <NavLink to="/orderhistory" className="text-decoration-none text-light mx-2">
            <div className="d-inline-flex align-items-center">
              <i className="fa fa-history fa-2x" style={{ color: "white" }}></i>
              <span className="ms-2 text-light">Order History</span>
            </div>
          </NavLink>
          
          <NavLink to="/cart" className="text-decoration-none text-light mx-2">
            <div id='ex4'>
              <span className='p1 fa-stack fa-2x has-badge' data-count={carts.length}>
                <i className="fa fa-solid fa-cart-shopping"></i>
              </span>
            </div>
          </NavLink>
          <NavLink to="/favorites" className="text-decoration-none text-light mx-2">
            <div id='ex4'>
              <span className='p1 fa-stack fa-2x has-badge' data-count={favorites.length}>
                <i className="fa fa-heart"></i>
              </span>
            </div>
          </NavLink>
          
          <NavLink to="/signup" className="text-decoration-none text-light mx-2">
              <button className="btn btn-primary">Signup</button>
            </NavLink>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          ) : (
            <NavLink to="/login" className="text-decoration-none text-light mx-2">
              <button className="btn btn-primary">Login</button>
            </NavLink>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default Headers;
