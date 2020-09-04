import React, { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from '../components/header';
import Footer from '../components/footer';
import ErrorBoundary from '../components/errorBoundary';
import PropTypes from 'prop-types';
const Landing = lazy(() => import('./landing'));


function Layout({ children }) {
  // keep track of path to update errorBoundary key so it will reset when you click a link
  const { pathname } = useLocation()
  const pathArr = pathname.split('/');
  const landingPath = pathArr[1] === "";

  return landingPath ? (
    <Suspense fallback={<div />}>
      <Landing />
    </Suspense>
  ) : (
    <div>
      <Header />
      <Container
        className={`min-height-container ${pathArr[1] !== 'campgrounds' && 'mb-5'}`}
      >
        <ErrorBoundary key={pathname}>
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
