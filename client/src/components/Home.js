//home.js
import React, { useState, useEffect } from 'react';
import './style.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { addToCart, addToFavorites, removeFromFavorites } from '../redux/features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Fuse from 'fuse.js';
import axios from 'axios';

const Home = () => {
    const [cartData, setCartData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");
    const dispatch = useDispatch();
    const { favorites, item, products } = useSelector((state) => state.allCart);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setCartData(response.data);
                // dispatch
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    const fuse = new Fuse(cartData, {
       // keys: ['dish', 'address'],
       keys: [
        {
          name: 'dish',
          weight: 0.3
        },
        {
          name: 'price',
          weight: 0.7
        },
        {
            name: 'somedata',
            weight: 0.3
          }
      ]
        
    });

    const results = searchTerm ? fuse.search(searchTerm).map(({ item }) => item) : cartData;

    const sortedData = results.sort((a, b) => {
        switch (sortOrder) {
            case "default":
                return b.somedata - a.somedata;
            case "low-price":
                return a.price - b.price;
            case "high-price":
                return b.price - a.price;
            case "name":
                return a.dish.localeCompare(b.dish);
            case "rating":
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    const send = (e) => {
        dispatch(addToCart(e));
        toast.success("Item added to your cart");
    };

    const addFavorite = (e) => {
        const isFavorite = favorites.some(item => item.id === e.id);
        if (isFavorite) {
            dispatch(removeFromFavorites(e.id));
            toast.success("Item removed from favorites");
        } else {
            dispatch(addToFavorites(e));
            toast.success("Item added to favorites");
        }
    };

    return (
        <>
            <section className='item_section mt-4 container'>
                <h2 className='px-4' style={{ fontWeight: 600 }}>FOOD MENU</h2>

                <input
                    type="text"
                    placeholder="Search Food Item"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input mb-3"
                />

                <select
                    className="sort-dropdown mb-3"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="default">Sort by Default</option>
                    <option value="name">Sort by Name</option>
                    <option value="low-price">Sort by Low Price</option>
                    <option value="high-price">Sort by High Price</option>
                    <option value="rating">Sort by Rating</option>
                </select>

                {sortedData.length === 0 && (
                    <p className="text-center mt-3 mb-3">Food item not found.</p>
                )}

                <div className='row mt-2 d-flex justify-content-around align-items-center'>
                    {
                        sortedData.map((element) => (
                            <Card style={{ width: "22rem", border: "none" }} className='hove mb-4' key={element.id}>
                                <Card.Img variant='top' className='cd' src={element.imgdata} />
                                <div className="card_body">
                                    <div className="upper_data d-flex justify-content-between align-items-center">
                                        <h4 className='mt-2'>{element.dish}</h4>
                                        <span>{element.rating}&nbsp;★</span>
                                    </div>

                                    <div className="lower_data d-flex justify-content-between ">
                                        <h5>{element.address}</h5>
                                        <span>₹ {element.price}</span>
                                    </div>
                                    <div className="extra"></div>

                                    <div className="last_data d-flex justify-content-between align-items-center">
                                        <img src={element.arrimg} className='limg' alt="" />

                                        <Button style={{ width: "150px", background: "#ff3054db", border: "none" }} variant='outline-light' className='mt-2 mb-2'
                                            onClick={() => send(element)}>
                                            Add to Cart
                                        </Button>

                                        <img src={element.delimg} className='laimg' alt="" />
                                        <Button style={{ background: "transparent", border: "none" }} onClick={() => addFavorite(element)}>
                                            <i className={`fa fa-heart ${favorites.some(item => item.id === element.id) ? 'text-danger' : ''}`} aria-hidden="true" style={{ fontSize: "24px" }}></i>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    }
                </div>
            </section>
        </>
    );
}

export default Home;
