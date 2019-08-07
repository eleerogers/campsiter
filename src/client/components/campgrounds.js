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

  render() {
    const { loggedInAs } = this.props;
    const { campgrounds } = this.state;
    const campgroundComponents = campgrounds.map(campground => (
      <Col key={campground.id} md={3} sm={6}>
        <Campground campground={campground} />
      </Col>
    ));
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
