import React, { useState } from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";

const App = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <Navbar loading={loading} />
      <Routes>
        <Route exact path="/" element={<RecordList setLoading={setLoading} />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
      </Routes>
      <div style={{ position: "fixed", bottom: 4, right: 8, fontSize: "0.7rem", opacity: 0.4, pointerEvents: "none" }}>
        v{process.env.REACT_APP_VERSION}
      </div>
    </div>
  );
};

export default App;