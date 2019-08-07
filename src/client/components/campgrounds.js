import React, { Component } from 'react';
import {
  Button, Jumbotron, Container, Row, Col, Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
      .then((campgrounds) => {
        this.setState({ campgrounds });
      });
  }

  renderAlert = () => {
    const space = '    ';
    const { alertMessage } = this.state;
    if (alertMessage) {
      const { text, variant } = alertMessage;
      return (
        <Alert variant={variant}>
          <Alert>
            {text}
            {space}
            <Button
              onClick={() => {
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
          <Col key={campground.id} md={3} sm={6}>
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
              <h1>Welcome to YelpCamp2!</h1>
              <p>View our handpicked campgrounds from all over the world</p>
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
