import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import {Provider} from 'react-redux'
import {store} from './store/index'

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    </Provider>
  );
}