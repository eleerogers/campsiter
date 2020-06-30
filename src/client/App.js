import React, {Suspense} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.colors.css';
import './app.css';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Landing from './components/landing';
// const Landing = React.lazy(() => import('./components/landing'));
import Header from './components/header';
// const Header = React.lazy(() => import('./components/header'));
const CampgroundsHome = React.lazy(() => import('./components/campgroundsHome'));
const NewCampground = React.lazy(() => import('./components/newCampground'));
const CampgroundPage = React.lazy(() => import('./components/campgroundPage'));
const NewComment = React.lazy(() => import('./components/newComment'));
const EditComment = React.lazy(() => import('./components/editComment'));
const Login = React.lazy(() => import('./components/login'));
const Signup = React.lazy(() => import('./components/signup'));
const EditCampground = React.lazy(() => import('./components/editCampground'));
const UserProfile = React.lazy(() => import('./components/userProfile'));
const EditUser = React.lazy(() => import('./components/editUser'));
const Forgot = React.lazy(() => import('./components/forgot'));
const Contact = React.lazy(() => import('./components/contact'));
const Reset = React.lazy(() => import('./components/resetPassword'));
import Footer from './components/footer';
// const Footer = React.lazy(() => import('./components/footer'));
import ErrorBoundary from './components/errorBoundary';
// const ErrorBoundary = React.lazy(() => import('./components/errorBoundary'));
import useListenPath from './hooks/useListenPath';
import { LoadScriptNext } from '@react-google-maps/api';

toast.configure();


function App() {
  // keeping track of path to update errorBoundary key so it will reset when you click a link
  const [path] = useListenPath();
  const pathArr = path.split('/');

  return (
    <div className="app-outer">
      <div>
        <Route
          path="/"
        >
          <Header />
        </Route>
        <Container className={`min-height-container ${pathArr[1] !== 'campgrounds' && 'mb-5'}`}>
          <ErrorBoundary key={path}>
            <Suspense fallback={<div></div>}>
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
              </Switch>
            </Suspense>
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
