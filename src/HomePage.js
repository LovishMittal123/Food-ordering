import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Shimmer from './Shimmer';

const HomePage = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const apicall = async () => {
    try {
      const response = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7108654&lng=77.20314929999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
      const json = await response.json();
      setData(json);
      console.log(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    apicall();
  }, []);

  let myCards = [];

  if (data && data.data && data.data.cards) {
    myCards = data.data.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];
  }

  return (
    <div>
      <Header/>
    <div className="flex flex-wrap p-4">
      {myCards.length > 0 ? (
        myCards.map((restaurant) => (
          <div
            key={restaurant.info.id}
            onClick={() => handleClick(restaurant.info.id)}
            className="w-64 mx-4 my-4 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-200"
          >
            <img
              src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${restaurant.info.cloudinaryImageId}`}
              alt={restaurant.info.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{restaurant.info.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.info.costForTwo}</p>
              <p className="text-sm text-gray-600">{restaurant.info.cuisines.join(', ')}</p>
              <button className='bg-orange-400 text-white mt-5 rounded-lg px-2 py-2'>Menu</button>
            </div>
          </div>
        ))
      ) : (
        <Shimmer/>
      )}
      
    </div>
    </div>
  );
};

export default HomePage;
