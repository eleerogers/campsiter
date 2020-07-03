import React from 'react';
import importedComponent from 'react-imported-component';
import Loading from './components/loading';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.colors.css';
import './app.css';
import { Switch, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
const Landing = importedComponent(
  () => import('./components/landing'),
  { LoadingComponent: Loading }
);
// import Landing from './components/landing';
const CampgroundsHome = importedComponent(
  () => import('./components/campgroundsHome'),
  { LoadingComponent: Loading }
);
// import CampgroundsHome from './components/campgroundsHome';
const NewCampground = importedComponent(
  () => import('./components/newCampground'),
  { LoadingComponent: Loading }
);
// import NewCampground from './components/newCampground';
const CampgroundPage = importedComponent(
  () => import('./components/campgroundPage'),
  { LoadingComponent: Loading }
);
// const CampgroundPage = React.lazy(() => import('./components/campgroundPage'));
// import CampgroundPage from './components/campgroundPage';
const NewComment = importedComponent(
  () => import('./components/newComment'),
  { LoadingComponent: Loading }
);
// import NewComment from './components/newComment';
const EditComment = importedComponent(
  () => import('./components/editComment'),
  { LoadingComponent: Loading }
);
// import EditComment from './components/editComment';
const Login = importedComponent(
  () => import('./components/login'),
  { LoadingComponent: Loading }
);
// import Login from './components/login';
const Signup = importedComponent(
  () => import('./components/signup'),
  { LoadingComponent: Loading }
);
// import Signup from './components/signup';
const EditCampground = importedComponent(
  () => import('./components/editCampground'),
  { LoadingComponent: Loading }
);
// import EditCampground from './components/editCampground';
const UserProfile = importedComponent(
  () => import('./components/userProfile'),
  { LoadingComponent: Loading }
);
// import UserProfile from './components/userProfile';
const EditUser = importedComponent(
  () => import('./components/editUser'),
  { LoadingComponent: Loading }
);
// import EditUser from './components/editUser';
const Forgot = importedComponent(
  () => import('./components/forgot'),
  { LoadingComponent: Loading }
);
// import Forgot from './components/forgot';
const Contact = importedComponent(
  () => import('./components/contact'),
  { LoadingComponent: Loading }
);
// import Contact from './components/contact';
const Reset = importedComponent(
  () => import('./components/resetPassword'),
  { LoadingComponent: Loading }
);
// import Reset from './components/resetPassword';
import { LoadScriptNext } from '@react-google-maps/api';
import Layout from './components/layout';

toast.configure();


function App() {
  return (
    <div className="app-outer">
      <Switch>
        <Route
          path="/"
          exact
          component={Landing}
        />
        <Layout>
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
        </Layout>
      </Switch>
    </div>
  );
}

export default App;
