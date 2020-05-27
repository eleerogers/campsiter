import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { LoggedInAsContextProvider } from './components/loggedInAsContext';

ReactDOM.render(
  <LoggedInAsContextProvider>
    <Router>
      <App />
    </Router>
  </LoggedInAsContextProvider>,
  document.getElementById('root')
);
