import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Shimmer from './Shimmer';
import Cart from './Cart';

const normalizePrice = (price) => {
  return price > 1500 ? price / 100 : price;
};

const RestaurantMenu = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const { id } = useParams();

  const handleCategoryClick = useCallback((index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  }, [expandedCategory]);

  const handleAddToCart = useCallback((item) => {
    let itemPrice = 0;

    if (item.price && !isNaN(item.price)) {
      itemPrice = normalizePrice(item.price);
    } else if (item.variantsV2 && item.variantsV2.variantGroups) {
      const selectedVariantGroup = item.variantsV2.variantGroups[0];
      const selectedVariant = selectedVariantGroup.variations.find(v => v.default);
      if (selectedVariant && selectedVariant.price) {
        itemPrice = normalizePrice(selectedVariant.price);
      }
    }

    const updatedCart = [...cart, { ...item, price: itemPrice }];
    setCart(updatedCart);
    setCount(updatedCart.length);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }, [cart]);

  const removeFromCart = useCallback((index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setCount(updatedCart.length);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCount(0);
    localStorage.removeItem('cart');
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartVisible(!isCartVisible);
  }, [isCartVisible]);

  const fetchRestaurantData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`
      );
      const json = await response.json();
      setData(json);

      const regularCards = json?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];
      const filteredCategories = regularCards.filter(
        (c) => c.card.card['@type'] === 'type.googleapis.com/swiggy.presentation.food.v2.ItemCategory'
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    setCount(savedCart.length);
  }, []);

  return (
    <div className="">
      <Header count={count} toggleCart={toggleCart} />
      {isCartVisible && <Cart cartItems={cart} removeFromCart={removeFromCart} clearCart={clearCart} />}
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <div key={category.card.card.title} className="w-full mb-4">
            <div
              onClick={() => handleCategoryClick(index)}
              className="cursor-pointer flex justify-between w-1/2 mx-auto my-16 shadow-2xl p-4 bg-gray-200 hover:bg-gray-300"
            >
              <h2 className="text-2xl font-bold">{category.card.card.title}</h2>
              <h2 className="text-2xl font-bold">{expandedCategory === index ? '↑' : '↓'}</h2>
            </div>
            {expandedCategory === index && (
              <div className="p-4">
                {category.card.card.itemCards.map((item) => {
                  let price = normalizePrice(item.card.info.price || 0);

                  if (item.card.info.variantsV2 && item.card.info.variantsV2.variantGroups) {
                    const selectedVariantGroup = item.card.info.variantsV2.variantGroups[0];
                    const selectedVariant = selectedVariantGroup.variations.find(v => v.default);
                    if (selectedVariant && selectedVariant.price) {
                      price = normalizePrice(selectedVariant.price);
                    }
                  }

                  return (
                    <div
                      key={item.card.info.id}
                      className="flex max-w-2xl mx-auto my-4 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-200"
                    >
                      <div className="w-1/3 h-48">
                        <img
                          className="w-full h-full object-cover"
                          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${item.card.info.imageId}`}
                          alt={item.card.info.name}
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="text-lg font-semibold mb-2">{item.card.info.name}</h3>
                        <p className="text-sm">{item.card.info.description}</p>
                        <p className="text-lg font-bold mb-2">₹{price.toFixed(2)}</p>
                        <button
                          onClick={() => handleAddToCart(item.card.info)}
                          className="bg-black text-white my-5 rounded-lg px-4 py-2"
                        >
                          ADD +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      ) : (
        <Shimmer />
      )}
    </div>
  );
};

export default RestaurantMenu;
