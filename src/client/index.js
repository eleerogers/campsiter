import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { LoggedInAsContextProvider } from './components/contexts/loggedInAsContext';
import { MapKeyContextProvider } from './components/contexts/mapKeyContext';

ReactDOM.render(
  <MapKeyContextProvider>
    <LoggedInAsContextProvider>
      <Router>
        <App />
      </Router>
    </LoggedInAsContextProvider>
  </MapKeyContextProvider>,
  document.getElementById('root')
);
