import React from 'react';
import { lazy, LazyBoundary } from 'react-imported-component';
import Loading from './components/loading';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.colors.css';
import './app.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
const CampgroundsHome = lazy(() => import('./components/campgroundsHome'));
const NewCampground = lazy(() => import('./components/newCampground'));
const CampgroundPage = lazy(() => import('./components/campgroundPage'));
const NewComment = lazy(() => import('./components/newComment'));
const EditComment = lazy(() => import('./components/editComment'));
const Login = lazy(() => import('./components/login'));
const Signup = lazy(() => import('./components/signup'));
const EditCampground = lazy(() => import('./components/editCampground'));
const UserProfile = lazy(() => import('./components/userProfile'));
const EditUser = lazy(() => import('./components/editUser'));
const Forgot = lazy(() => import('./components/forgot'));
const Contact = lazy(() => import('./components/contact'));
const Reset = lazy(() => import('./components/resetPassword'));
import { LoadScriptNext } from '@react-google-maps/api';
import Layout from './components/layout';

toast.configure();


function App() {
  return (
    <div className="app-outer">
      <Layout>
        <LazyBoundary fallback={<Loading />}>
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
        </LazyBoundary>
      </Layout>
    </div>
  );
}

export default App;
