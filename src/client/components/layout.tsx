import React from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from './header';
import Footer from './footer';
import ErrorBoundary from './errorBoundary';
import Landing from './landing';


interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  // keep track of path to update errorBoundary key so it will reset when you click a link
  const { pathname } = useLocation()
  const pathArr = pathname.split('/');
  const landingPath = pathArr[1] === "";

  return landingPath ? (
    <Landing />
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

export default Layout;
