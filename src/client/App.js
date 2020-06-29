import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.colors.css';
import './app.css';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Header from './components/header';
import Landing from './components/landing';
import CampgroundsHome from './components/campgroundsHome';
import NewCampground from './components/newCampground';
import CampgroundPage from './components/campgroundPage';
import NewComment from './components/newComment';
import EditComment from './components/editComment';
import Login from './components/login';
import Signup from './components/signup';
import EditCampground from './components/editCampground';
import UserProfile from './components/userProfile';
import EditUser from './components/editUser';
import Forgot from './components/forgot';
import Contact from './components/contact';
import Reset from './components/resetPassword';
import Footer from './components/footer';
import ErrorBoundary from './components/errorBoundary';
import useListenPath from './hooks/useListenPath';
import { LoadScriptNext } from '@react-google-maps/api';

toast.configure();


function App() {
  // keeping track of path to update errorBoundary key so it will reset when you click a link
  const [path] = useListenPath();

  return (
    <div className="app-outer">
      <div>
        <Route
          path="/"
        >
          <Header />
        </Route>
        <Container className="min-height-container mb-5">
          <ErrorBoundary key={path}>
            <Switch>
              <Route
                path="/"
                exact
                component={Landing}
              />
              <Route
                path="/campgroundsHome"
                exact
              >
                <CampgroundsHome />
              </Route>
              <Route
                path="/newCampground"
                exact
              >
                <NewCampground />
              </Route>
              <Route
                path="/editCampground"
                exact
              >
                <EditCampground />
              </Route>
              <Route
                path="/campgrounds/:id"
                exact
              >
                <LoadScriptNext
                  googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                >
                  <CampgroundPage />
                </LoadScriptNext>
              </Route>
              <Route
                path="/campgrounds/:id/comments/new"
                exact
              >
                <NewComment />
              </Route>
              <Route
                path="/campgrounds/:id/comments/edit"
                exact
              >
                <EditComment />
              </Route>
              <Route
                path="/login"
              >
                <Login />
              </Route>
              <Route path="/ycusers/:id">
                <UserProfile />
              </Route>
              <Route
                path="/signup"
                exact
              >
                <Signup />
              </Route>
              <Route
                path="/editUser"
                exact
              >
                <EditUser />
              </Route>
              <Route
                path="/forgot"
                exact
              >
                <Forgot />
              </Route>
              <Route
                path="/contact"
                exact
              >
                <Contact />
              </Route>
              <Route
                path="/reset/:reset_password_token"
                exact
              >
                <Reset />
              </Route>
            </Switch>
          </ErrorBoundary>
        </Container>
        <Route
          path="/"
        >
          <Footer />
        </Route>
      </div>
    </div>
  );
}

export default App;
