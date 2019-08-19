import React, { Component } from 'react';
import './app.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/header';
import Footer from './components/footer';
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
      image_id: '',
      first_name: '',
      last_name: '',
      username: ''
    },
    errorMessage: null
  }

  componentDidMount() {
    if (localStorage.user_id) {
      fetch(`/api/ycusers/${localStorage.user_id}`)
        .then(res => res.json())
        .then((res) => {
          this.setState({
            loggedInAs: res,
          });
        })
        .then(() => { console.log('loggedInAs1: ', this.state.loggedInAs); });
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

  submitLogin = (event, history) => {
    event.preventDefault();
    const { emailForm, passwordForm } = this.state;
    const data = {
      email: emailForm,
      password: passwordForm
    };
    fetch('/api/ycusers/login/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (
          res.status === 400 || res.status === 404
        ) {
          console.log('status: ', res.status);
          this.setState({
            errorMessage: 'Invalid login'
          });
        } else {
          return res.json();
        }
        throw Error;
      })
      .then((res) => {
        localStorage.user_id = res.id;
        this.setState({
          loggedInAs: res
        });
      })
      .then(() => {
        history.push('/campgrounds');
      })
      .catch((error) => {
        throw error;
      });
  }

  logout = (history) => {
    const { location } = history;
    const { pathname } = location;
    const pathArr = pathname.split('/');
    const pathLast = pathArr.pop();

    fetch('/api/ycusers/logout')
      .then(res => res.json())
      .then(() => {
        localStorage.removeItem('user_id');
        this.setState({
          emailForm: '',
          passwordForm: '',
          loggedInAs: {
            id: '', password: '', email: '', created_at: ''
          },
        });
      })
      .then(() => {
        if (
          pathLast === 'new'
          || pathLast === 'edit'
          || pathLast === 'newCampground'
          || pathLast === 'editCampground'
        ) {
          history.push('/campgrounds');
        }
      })
      .catch(error => console.error('Error:', error));
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
                props => (
                  (props.location.pathname !== '/')
                  && (
                  <Header
                    {...props}
                    loggedInAs={loggedInAs}
                    logout={this.logout}
                  />
                  )
                )}
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
                    props => (
                      <Campgrounds
                        {...props}
                        loggedInAs={loggedInAs}
                      />
                    )}
                />
                <Route
                  path="/newCampground"
                  exact
                  render={
                    props => (
                      <NewCampground
                        {...props}
                        user={loggedInAs}
                      />
                    )}
                />
                <Route
                  path="/editCampground"
                  exact
                  render={
                    props => (
                      <EditCampground
                        {...props}
                        loggedInAs={loggedInAs}
                      />
                    )}
                />
                <Route
                  path="/campgrounds/:id"
                  exact
                  render={
                    props => (
                      <CampgroundPage
                        {...props}
                        loggedInAs={loggedInAs}
                      />
                    )}
                />
                <Route
                  path="/campgrounds/:id/comments/new"
                  exact
                  render={
                    props => (
                      <NewComment
                        {...props}
                        user={loggedInAs}
                      />
                    )
                  }
                />
                <Route
                  path="/campgrounds/:id/comments/edit"
                  exact
                  render={
                    props => (
                      <EditComment
                        {...props}
                        user={loggedInAs}
                      />
                    )
                  }
                />
                <Route
                  path="/login"
                  render={
                    props => (
                      <Login
                        {...props}
                        onFormChange={this.onFormChange}
                        submitLogin={this.submitLogin}
                        emailForm={emailForm}
                        passwordForm={passwordForm}
                        errorMessage={errorMessage}
                      />
                    )
                  }
                />
                <Route
                  path="/ycusers/:id"
                  render={
                    props => (
                      <UserProfile
                        {...props}
                        loggedInAs={loggedInAs}
                      />
                    )}
                />
                <Route
                  path="/signup"
                  exact
                  component={Signup}
                />
                <Route
                  path="/editUser"
                  exact
                  render={
                    props => (
                      <EditUser
                        {...props}
                        loggedInAs={loggedInAs}
                        updateLoggedinasState={this.updateLoggedinasState}
                      />
                    )}
                />
                <Route
                  path="/forgot"
                  exact
                  component={Forgot}
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
