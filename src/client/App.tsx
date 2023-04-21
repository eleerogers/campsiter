import React, { lazy, Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.colors.css';
import './app.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
const CampgroundsHome = lazy(() => import('./components/campgroundsHome'));
const CampgroundPage = lazy(() => import('./components/campgroundPage'));
const UserProfile = lazy(() => import('./components/userProfile'));
import NewCampground from './components/newCampground';
import NewComment from './components/newComment';
import EditComment from './components/editComment';
import Login from './components/login';
import Signup from './components/signup';
import EditCampground from './components/editCampground';
import EditUser from './components/editUser';
import Forgot from './components/forgot';
import Contact from './components/contact';
import Reset from './components/resetPassword';
import Layout from './components/layout';
import { LoadScriptNext } from '@react-google-maps/api';

toast.configure();


function App() {
  return (
    <div className="app-outer">
      <Layout>
        <Suspense fallback={<div />}>
          <main>
            <Switch>
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
                  loadingElement={<div />}
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
                path="/contactAdmin"
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
              <Redirect to={"/campgroundsHome"} />
            </Switch>
          </main>
        </Suspense>
      </Layout>
    </div>
  );
}

export default App;
