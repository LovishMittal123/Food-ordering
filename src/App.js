import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage';
import RestaurantMenu from './RestaurantMenu';
import Cart from './Cart';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantMenu />
  }
  ,{
    path:"/cart",
    element:<Cart/>
  }
]);

const App = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};

export default App;
