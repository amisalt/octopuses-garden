import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux'
import {store} from './store/index'
import { AppContainer } from '../components/containers/AppContainer';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContainer/>
      </BrowserRouter>
    </Provider>
  );
}