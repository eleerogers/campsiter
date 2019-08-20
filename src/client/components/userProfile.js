import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {
  Col, Container, Row, Button
} from 'react-bootstrap';
import Campground from './campground';
import '../app.css';

class UserProfile extends Component {
  state = {
    campgrounds: [],
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    const { author } = state;

    fetch(`/api/campgrounds/ycuser/${author.id}`)
      .then(res => res.json())
      .then((campgrounds) => {
        this.setState({ campgrounds });
      });
  }

  renderEditButton = () => {
    const { loggedInAs, location } = this.props;
    const { state } = location;
    const { author } = state;
    if (
      (loggedInAs
      && author
      && loggedInAs.id === author.id)
      || loggedInAs.admin
    ) {
      return (
        <React.Fragment>
          <Link to={{
            pathname: '/editUser',
            state: { author }
          }}
          >
            <Button size="sm" variant="warning" className="mr-2">Edit User</Button>
          </Link>
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    const { location } = this.props;
    const { state } = location;
    const { author } = state;
    const { campgrounds } = this.state;
    const campgroundComponents = campgrounds.map(campground => (
      <Col key={campground.id} md={3} sm={6}>
        <Campground campground={campground} />
      </Col>
    ));
    return (
      <div className="row">
        <div className="col-md-4">
          <h2>
            {author.firstName}
            {' '}
            {author.lastName}
          </h2>
          {' '}
          <div className="thumbnail">
            <img className="img-fluid" src={author.image} alt={author.email} />
            <div className="caption float-right">
              <i>
                email:
                {' '}
                <a href={'mailto:{author.email}'}>
                  {author.email}
                </a>
              </i>
            </div>
          </div>
          {this.renderEditButton()}
        </div>
        <div className="col-md-8">
          <Container>
            <Row key={1}>
              {campgroundComponents}
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(UserProfile);
