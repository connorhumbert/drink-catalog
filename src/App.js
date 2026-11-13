import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import TabBar from "./components/TabBar";
import RecordList from "./components/recordList";
import BarTab from "./components/BarTab";
import BarBottles from "./components/BarBottles";
import Edit from "./components/edit";
import Create from "./components/create";
import { DrinksProvider } from "./useDrinks";

const App = () => {
  return (
    <DrinksProvider>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/bar" element={<BarTab />} />
        <Route path="/bar/bottles" element={<BarBottles />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
      </Routes>
      <TabBar />
    </DrinksProvider>
  );
};

export default App;
