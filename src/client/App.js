import React, { Component } from 'react';
import './app.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Header from './components/header';
// import Footer from './components/footer';
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

export default class App extends Component {
  state = {
    emailForm: '',
    passwordForm: '',
    loggedInAs: {
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
    },
    errorMessage: null
  }

  async componentDidMount() {
    try {
      if (localStorage.userId) {
        const {
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
        } = await axios.get(`/api/users/${localStorage.userId}`);
        const loggedInAs = {
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
        this.setState({
          loggedInAs
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  onFormChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  updateLoggedinasState = (item) => {
    this.setState({
      loggedInAs: item
    });
  }

  submitLogin = async (event, goBack) => {
    try {
      event.preventDefault();
      this.setState({
        errorMessage: null
      });
      const { emailForm, passwordForm } = this.state;
      const loginInfo = {
        email: emailForm,
        password: passwordForm
      };
      const { data } = await axios.post('/api/users/login/', loginInfo);
      localStorage.userId = data.id;
      this.setState({
        loggedInAs: data
      });
      goBack();
    } catch (err) {
      const { response: { status, data: message } } = err;
      this.setState({
        errorMessage: `${message} (${status})`
      });
      console.error(err);
    }
  }

  logout = async (history) => {
    try {
      const { location: { pathname } } = history;
      const pathArr = pathname.split('/');
      const pathLast = pathArr.pop();
      await axios.get('/api/users/logout');
      localStorage.removeItem('userId');
      this.setState({
        emailForm: '',
        passwordForm: '',
        loggedInAs: {
          id: '', password: '', email: '', created_at: ''
        },
      });
      if (
        pathLast === 'new'
        || pathLast === 'edit'
        || pathLast === 'newCampground'
        || pathLast === 'editCampground'
      ) {
        history.push('/campgrounds');
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const {
      loggedInAs,
      emailForm,
      passwordForm,
      errorMessage
    } = this.state;
    return (
      <div className="app-outer">
        <Router>
          <div>
            <Route
              path="/"
              render={
                (props) => (
                  (props.location.pathname !== '/')
                  && (
                  <Header
                    history={props.history}
                    location={props.location}
                    match={props.match}
                    loggedInAs={loggedInAs}
                    logout={this.logout}
                  />
                  )
                )
              }
            />
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
                  render={
                    (props) => (
                      <Campgrounds
                        history={props.history}
                        location={props.location}
                        match={props.match}
                        loggedInAs={loggedInAs}
                      />
                    )
                  }
                />
                <Route
                  path="/newCampground"
                  exact
                >
                  <NewCampground
                    user={loggedInAs}
                  />
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
                  render={
                    (props) => (
                      <CampgroundPage
                        history={props.history}
                        location={props.location}
                        match={props.match}
                        loggedInAs={loggedInAs}
                      />
                    )
                  }
                />
                <Route
                  path="/campgrounds/:id/comments/new"
                  exact
                  // render={
                  //   (props) => (
                  //     <ErrorBoundary history={props.history}>
                  //       <NewComment
                  //         history={props.history}
                  //         location={props.location}
                  //         match={props.match}
                  //         user={loggedInAs}
                  //       />
                  //     </ErrorBoundary>
                  //   )
                  // }
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
                  // render={
                  //   (props) => (
                  //     <ErrorBoundary history={props.history}>
                  //       <EditComment
                  //         history={props.history}
                  //         location={props.location}
                  //         match={props.match}
                  //         user={loggedInAs}
                  //       />
                  //     </ErrorBoundary>
                  //   )
                  // }
                >
                  <ErrorBoundary>
                    <EditComment />
                  </ErrorBoundary>
                </Route>
                <Route
                  path="/login"
                  render={
                    (props) => (
                      <Login
                        history={props.history}
                        location={props.location}
                        match={props.match}
                        onFormChange={this.onFormChange}
                        submitLogin={this.submitLogin}
                        emailForm={emailForm}
                        passwordForm={passwordForm}
                        errorMessage={errorMessage}
                        loggedInAs={loggedInAs}
                      />
                    )
                  }
                />
                <Route path="/ycusers/:id">
                  <UserProfile
                    loggedInAs={loggedInAs}
                  />
                </Route>
                {/* <Route
                  path="/ycusers/:id"
                  render={
                    (props) => (
                      <UserProfile
                        history={props.history}
                        location={props.location}
                        match={props.match}
                        loggedInAs={loggedInAs}
                      />
                    )
                  }
                /> */}
                <Route
                  path="/signup"
                  exact
                  render={
                    () => (
                      <Signup
                        loggedInAs={loggedInAs}
                      />
                    )
                  }
                />
                <Route
                  path="/editUser"
                  exact
                  render={
                    (props) => (
                      <ErrorBoundary history={props.history}>
                        <EditUser
                          history={props.history}
                          location={props.location}
                          match={props.match}
                          loggedInAs={loggedInAs}
                          updateLoggedinasState={this.updateLoggedinasState}
                        />
                      </ErrorBoundary>
                    )
                  }
                />
                <Route
                  path="/forgot"
                  exact
                  render={
                    (props) => (
                      <Forgot
                        history={props.history}
                        loggedInAs={loggedInAs}
                      />
                    )
                  }
                />
                <Route
                  path="/reset/:reset_password_token"
                  exact
                  component={Reset}
                />
              </Switch>
            </Container>
          </div>
        </Router>
      </div>
    );
  }
}
