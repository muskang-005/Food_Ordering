// FavoriteItems.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromFavorites } from '../redux/features/cartSlice';
import toast from 'react-hot-toast';
import './favoriteStyle.css';

const FavoriteItems = () => {
    const { favorites } = useSelector((state) => state.allCart);
    const dispatch = useDispatch();

    const handleRemoveFavorite = (itemId) => {
        dispatch(removeFromFavorites(itemId));
        toast.success("Item removed from favorites");
    };

    return (
        <div className='favorites-container'>
            <h2>Favorite Items {favorites.length > 0 ? `(${favorites.length})` : ""}</h2>
            {favorites.length === 0 ? (
                <div className='favorites-empty'>
                    <p>Your Favorites List is Empty</p>
                </div>
            ) : (
                <div className='favorites-list'>
                    {favorites.map((item) => (
                        <div key={item.id} className='favorite-item'>
                            <div className='favorite-item-info'>
                                <img src={item.imgdata} alt={item.dish} />
                                <div>
                                    <h5>{item.dish}</h5>
                                    <p>Price: ₹ {item.price}</p>
                                </div>
                            </div>
                            <button 
                                className='remove-favorite-btn' 
                                onClick={() => handleRemoveFavorite(item.id)}
                            >
                                Remove from Favorites
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteItems;
