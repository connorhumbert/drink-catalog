import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/Navbar";
import TabBar from "./components/TabBar";
import UpdateBanner from "./components/UpdateBanner";
import DrinksTab from "./screens/drinks/DrinksTab";
import BarTab from "./screens/myBar/BarTab";
import BarBottles from "./screens/myBar/BarBottles";
import EditDrink from "./screens/addEdit/EditDrink";
import AddDrink from "./screens/addEdit/AddDrink";
import DrinkPage from "./screens/drink/DrinkPage";
import { DrinksProvider } from "./database/useDrinks";

const App = () => {
  return (
    <DrinksProvider>
      <UpdateBanner />
      <Navbar />
      <Routes>
        <Route exact path="/" element={<DrinksTab />} />
        <Route path="/bar" element={<BarTab />} />
        <Route path="/bar/bottles" element={<BarBottles />} />
        <Route path="/edit/:id" element={<EditDrink />} />
        <Route path="/create" element={<AddDrink />} />
        <Route path="/drink/:id" element={<DrinkPage />} />
      </Routes>
      <TabBar />
    </DrinksProvider>
  );
};

export default App;
