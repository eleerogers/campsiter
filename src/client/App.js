import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import {
  BrowserRouter as Router, Switch, Route
} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
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
  const loggedInAsInit = {
    id: '',
    password: '',
    email: '',
    created_at: '',
    admin: false,
    image: '',
    imageId: '',
    firstName: '',
    lastName: '',
    username: ''
  };
  const [loggedInAs, setLoggedInAs] = useState(loggedInAsInit);
  const loginInit = {
    emailForm: '',
    passwordForm: '',
  };
  const {
    values: loginFormValues,
    handleChange: loginFormHandleChange,
    reset: loginFormReset
  } = useForm(loginInit);
  const { emailForm, passwordForm } = loginFormValues;

  useEffect(() => {
    if (localStorage.userId) {
      axios.get(`/api/users/${localStorage.userId}`)
        .then(({
          data: {
            user: {
              admin,
              created_at: createdAt,
              email,
              first_name: firstName,
              last_name: lastName,
              id,
              image,
              image_id: imageId,
              password,
              username
            }
          }
        }) => {
          const updatedLoggedInAs = {
            admin,
            createdAt,
            email,
            firstName,
            lastName,
            id,
            image,
            imageId,
            password,
            username
          };
          setLoggedInAs(updatedLoggedInAs);
        })
        .catch((err) => {
          const { response: { status, data: message } } = err;
          toast.error(`${message} (${status})`);
        });
    }
  }, []);

  async function submitLogin(event, goBack) {
    event.preventDefault();
    try {
      const loginInfo = {
        email: emailForm,
        password: passwordForm
      };
      const { data } = await axios.post('/api/users/login/', loginInfo);
      localStorage.userId = data.id;
      setLoggedInAs(data);
      goBack();
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
    }
  }

  async function logout(path, push) {
    try {
      const pathArr = path.split('/');
      const pathLast = pathArr.pop();
      await axios.get('/api/users/logout');
      localStorage.removeItem('userId');
      loginFormReset();
      setLoggedInAs(loggedInAsInit);
      if (
        pathLast === 'new'
        || pathLast === 'edit'
        || pathLast === 'newCampground'
        || pathLast === 'editCampground'
      ) {
        push('/campgrounds');
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
    }
  }

  return (
    <div className="app-outer">
      <Router>
        <div>
          <Route
            path="/"
          >
            <Header
              loggedInAs={loggedInAs}
              logout={logout}
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
                  <Campgrounds
                    loggedInAs={loggedInAs}
                  />
                </ErrorBoundary>
              </Route>
              <Route
                path="/newCampground"
                exact
              >
                <ErrorBoundary>
                  <NewCampground
                    user={loggedInAs}
                  />
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
                  <CampgroundPage
                    loggedInAs={loggedInAs}
                  />
                </ErrorBoundary>
              </Route>
              <Route
                path="/campgrounds/:id/comments/new"
                exact
              >
                <ErrorBoundary>
                  <NewComment
                    user={loggedInAs}
                  />
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
                    submitLogin={submitLogin}
                    loginFormValues={loginFormValues}
                    loggedInAs={loggedInAs}
                  />
                </ErrorBoundary>
              </Route>
              <Route path="/ycusers/:id">
                <ErrorBoundary>
                  <UserProfile
                    loggedInAs={loggedInAs}
                  />
                </ErrorBoundary>
              </Route>
              <Route
                path="/signup"
                exact
              >
                <ErrorBoundary>
                  <Signup
                    loggedInAs={loggedInAs}
                  />
                </ErrorBoundary>
              </Route>
              <Route
                path="/editUser"
                exact
              >
                <ErrorBoundary>
                  <EditUser
                    loggedInAs={loggedInAs}
                    setLoggedInAs={setLoggedInAs}
                  />
                </ErrorBoundary>
              </Route>
              <Route
                path="/forgot"
                exact
              >
                <ErrorBoundary>
                  <Forgot
                    loggedInAs={loggedInAs}
                  />
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
      </Router>
    </div>
  );
}

export default App;
