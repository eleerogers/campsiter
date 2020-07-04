import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../components/header';
import Footer from '../components/footer';
import ErrorBoundary from '../components/errorBoundary';
import useListenPath from '../hooks/useListenPath';
import PropTypes from 'prop-types';
import importedComponent from 'react-imported-component';
import Loading from './loading';
const Landing = importedComponent(
  () => import('./landing'),
  { LoadingComponent: Loading }
);


function Layout({ children }) {
  // keeping track of path to update errorBoundary key so it will reset when you click a link
  const [path] = useListenPath();
  const pathArr = path.split('/');
  const landingPath = path === '/';

  return landingPath ? <Landing /> : (
    <div>
      <Header />
      <Container
        className={`min-height-container ${pathArr[1] !== 'campgrounds' && 'mb-5'}`}
      >
        <ErrorBoundary key={path}>
          {children}
        </ErrorBoundary>
      </Container>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
};

export default Layout;