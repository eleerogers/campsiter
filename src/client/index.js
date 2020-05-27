import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LoggedInAsContextProvider } from './components/loggedInAsContext';

ReactDOM.render(
  <LoggedInAsContextProvider>
    <App />
  </LoggedInAsContextProvider>,
  document.getElementById('root')
);
