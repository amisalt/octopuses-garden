import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import {Provider} from 'react-redux'
import {store} from './store/index'
import { NavbarGlobal } from '../components/navigation/NavbarGlobal/NavbarGlobal';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter/>
        <NavbarGlobal/>
      </BrowserRouter>
    </Provider>
  );
}