import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {
  Col, Container, Row, Button
} from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import Campground from './campground';
import '../app.css';

class UserProfile extends Component {
  isMounted = false;

  state = {
    campgrounds: [],
  }

  componentDidMount() {
    this.isMounted = true;
    const {
      location: {
        state: {
          author: {
            id
          }
        }
      }
    } = this.props;
    axios.get(`/api/campgrounds/user/${id}`)
      .then(({ data: { campgrounds } }) => {
        if (this.isMounted) {
          this.setState({ campgrounds });
        }
      });
  }

  componentDidUpdate() {
    this.isMounted = true;
    const {
      location: {
        state: {
          author: {
            id
          }
        }
      }
    } = this.props;
    axios.get(`/api/campgrounds/user/${id}`)
      .then(({ data: { campgrounds } }) => {
        if (this.isMounted) {
          this.setState({ campgrounds });
        }
      });
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  renderEditButton = () => {
    const {
      loggedInAs, location: {
        state: {
          author
        }
      }
    } = this.props;
    if (
      (loggedInAs
      && author
      && loggedInAs.id === author.id)
      || loggedInAs.admin
    ) {
      return (
        <>
          <Link to={{
            pathname: '/editUser',
            state: { author }
          }}
          >
            <Button size="sm" variant="warning" className="mr-2">Edit User</Button>
          </Link>
        </>
      );
    }
    return null;
  }

  render() {
    const {
      location: {
        state: {
          author: {
            first_name: firstName,
            last_name: lastName,
            image,
            email
          }
        }
      }
    } = this.props;
    const mailTo = `mailto:${email}`;
    const { campgrounds } = this.state;
    const campgroundComponents = campgrounds.map((campground) => (
      <Col key={campground.id} md={3} sm={6}>
        <Campground campground={campground} />
      </Col>
    ));
    return (
      <div className="row">
        <div className="col-md-4">
          <h2>
            {firstName}
            {' '}
            {lastName}
          </h2>
          {' '}
          <div className="thumbnail">
            <img className="img-fluid" src={image} alt={email} />
            <div className="caption float-right">
              <i>
                email:
                {' '}
                <a href={mailTo}>
                  {email}
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

UserProfile.propTypes = {
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      author: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        username: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        image: PropTypes.string.isRequired,
        admin: PropTypes.bool,
      })
    })
  }).isRequired
}; 

export default withRouter(UserProfile);
