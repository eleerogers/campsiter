import React from 'react';
import importedComponent from 'react-imported-component';
import Loading from './components/loading';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.colors.css';
import './app.css';
import { Switch, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
// import lazyComponent from './utils/lazyComponent';
// const CampgroundsHome = lazyComponent('../components/campgroundsHome');
const CampgroundsHome = importedComponent(
  () => import('./components/campgroundsHome'),
  { LoadingComponent: Loading }
);
const NewCampground = importedComponent(
  () => import('./components/newCampground'),
  { LoadingComponent: Loading }
);
const CampgroundPage = importedComponent(
  () => import('./components/campgroundPage'),
  { LoadingComponent: Loading }
);
const NewComment = importedComponent(
  () => import('./components/newComment'),
  { LoadingComponent: Loading }
);
const EditComment = importedComponent(
  () => import('./components/editComment'),
  { LoadingComponent: Loading }
);
const Login = importedComponent(
  () => import('./components/login'),
  { LoadingComponent: Loading }
);
const Signup = importedComponent(
  () => import('./components/signup'),
  { LoadingComponent: Loading }
);
const EditCampground = importedComponent(
  () => import('./components/editCampground'),
  { LoadingComponent: Loading }
);
const UserProfile = importedComponent(
  () => import('./components/userProfile'),
  { LoadingComponent: Loading }
);
const EditUser = importedComponent(
  () => import('./components/editUser'),
  { LoadingComponent: Loading }
);
const Forgot = importedComponent(
  () => import('./components/forgot'),
  { LoadingComponent: Loading }
);
const Contact = importedComponent(
  () => import('./components/contact'),
  { LoadingComponent: Loading }
);
const Reset = importedComponent(
  () => import('./components/resetPassword'),
  { LoadingComponent: Loading }
);
import NoMatch from './components/noMatch';
import { LoadScriptNext } from '@react-google-maps/api';
import Layout from './components/layout';

toast.configure();


function App() {
  return (
    <div className="app-outer">
      <Layout>
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
          <Route component={NoMatch} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
