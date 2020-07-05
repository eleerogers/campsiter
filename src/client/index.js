import React from 'react';
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { LoggedInAsContextProvider } from './components/contexts/loggedInAsContext';
// import { MapKeyContextProvider } from './components/contexts/mapKeyContext';

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(
    <LoggedInAsContextProvider>
      <Router>
        <App />
      </Router>
    </LoggedInAsContextProvider>,
    rootElement);
} else {
  render(
    <LoggedInAsContextProvider>
      <Router>
        <App />
      </Router>
    </LoggedInAsContextProvider>,
    rootElement);
}
