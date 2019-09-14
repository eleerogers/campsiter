import React, { Component } from 'react';
import {
  Button, Jumbotron, Container, Row, Col, Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Campground from './campground';

export default class Campgrounds extends Component {
  state = {
    campgrounds: [],
    alertMessage: null,
    search: ''
  };

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;

    if (state) {
      const { alertMessage } = state;
      this.setState({ alertMessage });
    }

    fetch('/api/campgrounds')
      .then(res => res.json())
      .then((campgroundsObj) => {
        const { campgrounds } = campgroundsObj;
        this.setState({ campgrounds });
      });

  }

  renderAlert = () => {
    const space = '    ';
    const { alertMessage } = this.state;
    const { history } = this.props;

    if (alertMessage) {
      const { text, variant } = alertMessage;
      return (
        <Alert variant={variant}>
          <Alert>
            {text}
            {space}
            <Button
              onClick={() => {
                history.replace('/campgrounds', null);
                this.setState({
                  alertMessage: null
                });
              }}
              variant="outline-success"
              size="sm"
            >
            X
            </Button>
          </Alert>
        </Alert>
      );
    }
    return null;
  }

  onFormChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    const { loggedInAs } = this.props;
    const { campgrounds, search } = this.state;
    const searchLC = search.toLowerCase();
    const campgroundComponents = campgrounds.map((campground) => {
      const campgroundName = campground.name.toLowerCase();
      if (search === '' || campgroundName.indexOf(searchLC) !== -1) {
        return (
          <Col key={campground.id} lg={3} md={4} sm={6} className="mb-4">
            <Campground campground={campground} />
          </Col>
        );
      }
      return null;
    });
    return (
      <div>
        <Container>
          <Container>
            {this.renderAlert()}
            <Jumbotron>
              <h1>Welcome to CampSiter!</h1>
              <p>Post and review campsites from around the globe</p>
              {loggedInAs.email.length > 0
                ? (
                  <Link to="/newCampground">
                    <Button variant="primary" size="lg">Add New Campground</Button>
                  </Link>
                )
                : (
                  <Link to="/login">
                    <Button variant="primary" size="lg">Login to Add New Campground</Button>
                  </Link>
                )}
              <br />
              <br />
              <form className="form-inline">
                <input
                  className="form-control col-md-3"
                  type="text"
                  name="search"
                  placeholder="Search campgrounds..."
                  value={search}
                  onChange={this.onFormChange}
                  autoComplete="off"
                />
              </form>
            </Jumbotron>
          </Container>
          <Container>
            <Row key={1}>
              {campgroundComponents}
            </Row>
          </Container>
        </Container>
      </div>
    );
  }
}

Campgrounds.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      alertMessage: PropTypes.shape({
        text: PropTypes.string,
        variant: PropTypes.string
      }),
    })
  }).isRequired,
  loggedInAs: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};
