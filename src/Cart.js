import React from 'react';

// Define the normalizePrice function
const normalizePrice = (price) => {
  return price > 1500 ? price / 100 : price;
};

const Cart = ({ cartItems = [], removeFromCart, clearCart }) => {
  // Calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = item.price && !isNaN(item.price) ? normalizePrice(item.price) : 0;
    return total + itemPrice;
  }, 0);

  return (
    <div className="w-1/2 mx-auto my-16 shadow-2xl p-4 bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between mb-2 p-2 bg-white rounded-lg shadow-md">
              <div className="flex items-center w-3/4">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_100,h_100,c_fit/${item.imageId}`}
                    alt={item.name}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center w-1/4 justify-end">
                <span className="text-md font-bold">Rs. {normalizePrice(item.price).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(index)}
                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-900"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4 p-2 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold">Total</h3>
            <span className="text-md font-bold">Rs. {totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={clearCart}
            className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-900"
          >
            Clear Cart
          </button>
        </>
      ) : (
        <p className="text-center">Your cart is currently empty.</p>
      )}
    </div>
  );
};

export default Cart;
