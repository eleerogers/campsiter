import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Header from './components/header';
import Landing from './components/landing';
import Campgrounds from './components/campgrounds';
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
import Reset from './components/resetPassword';
import ErrorBoundary from './components/errorBoundary';

toast.configure();


function App() {
  // keeping track of path to update errorBoundary key so it will reset when you click a link
  const [path, setPath] = useState('');
  const { listen } = useHistory();
  useEffect(() => {
    listen(({ pathname }) => {
      setPath(pathname);
    });
  }, [path, listen]);

  return (
    <div className="app-outer">
      <div>
        <Route
          path="/"
        >
          <Header />
        </Route>
        <Container>
          <ErrorBoundary key={path}>
            <Switch>
              <Route
                path="/"
                exact
                component={Landing}
              />
              <Route
                path="/campgrounds"
                exact
              >
                <Campgrounds />
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
                <CampgroundPage />
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
                path="/reset/:reset_password_token"
                exact
              >
                <Reset />
              </Route>
            </Switch>
          </ErrorBoundary>
        </Container>
      </div>
    </div>
  );
}

export default App;
