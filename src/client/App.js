import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import { Switch, Route } from 'react-router-dom';
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
import useForm from './hooks/useForm';

toast.configure();

function App() {
  const loginInit = {
    emailForm: '',
    passwordForm: '',
  };
  const {
    values: loginFormValues,
    handleChange: loginFormHandleChange,
    reset: loginFormReset
  } = useForm(loginInit);

  return (
    <div className="app-outer">
      <div>
        <Route
          path="/"
        >
          <Header
            loginFormReset={loginFormReset}
          />
        </Route>
        <Container>
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
              <ErrorBoundary>
                <Campgrounds />
              </ErrorBoundary>
            </Route>
            <Route
              path="/newCampground"
              exact
            >
              <ErrorBoundary>
                <NewCampground />
              </ErrorBoundary>
            </Route>
            <Route
              path="/editCampground"
              exact
            >
              <ErrorBoundary>
                <EditCampground />
              </ErrorBoundary>
            </Route>
            <Route
              path="/campgrounds/:id"
              exact
            >
              <ErrorBoundary>
                <CampgroundPage />
              </ErrorBoundary>
            </Route>
            <Route
              path="/campgrounds/:id/comments/new"
              exact
            >
              <ErrorBoundary>
                <NewComment />
              </ErrorBoundary>
            </Route>
            <Route
              path="/campgrounds/:id/comments/edit"
              exact
            >
              <ErrorBoundary>
                <EditComment />
              </ErrorBoundary>
            </Route>
            <Route
              path="/login"
            >
              <ErrorBoundary>
                <Login
                  onFormChange={loginFormHandleChange}
                  loginFormValues={loginFormValues}
                />
              </ErrorBoundary>
            </Route>
            <Route path="/ycusers/:id">
              <ErrorBoundary>
                <UserProfile />
              </ErrorBoundary>
            </Route>
            <Route
              path="/signup"
              exact
            >
              <ErrorBoundary>
                <Signup />
              </ErrorBoundary>
            </Route>
            <Route
              path="/editUser"
              exact
            >
              <ErrorBoundary>
                <EditUser />
              </ErrorBoundary>
            </Route>
            <Route
              path="/forgot"
              exact
            >
              <ErrorBoundary>
                <Forgot />
              </ErrorBoundary>
            </Route>
            <Route
              path="/reset/:reset_password_token"
              exact
            >
              <ErrorBoundary>
                <Reset />
              </ErrorBoundary>
            </Route>
          </Switch>
        </Container>
      </div>
    </div>
  );
}

export default App;
