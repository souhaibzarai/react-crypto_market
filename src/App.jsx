import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { CoinDetails } from "./pages/CoinDetails";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
