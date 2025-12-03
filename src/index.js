import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PokeTable from './PokeTable';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokeDetails from './PokeDetails';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={      <PokeTable />}/>
        <Route path="/:id" element={      <PokeDetails />}/>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
