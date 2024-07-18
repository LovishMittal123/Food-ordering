import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Header = ({ count, toggleCart }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-lg">
      <h1 className="text-3xl text-red-500 font-bold hover:text-red-900">Restaurant Menu</h1>
      <div className="flex items-center">
        <button
          onClick={toggleCart}
          className="bg-red-500 px-4 py-2 rounded-lg mr-4 flex items-center hover:bg-red-900 transition duration-300"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
          Cart ({count})
        </button>
      </div>
    </header>
  );
};

export default Header;
