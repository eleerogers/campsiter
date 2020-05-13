import React, { Component } from 'react';
import {
  Link,
  withRouter,
  useState,
  useEffect,
  useHistory,
  useParams
} from 'react-router-dom';
import {
  Col, Container, Row, Button, Alert
} from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import Campground from './campground';
import '../app.css';

function UserProfile({ loggedInAs }) {
  const [uPAuthor, setUPAuthor] = useState({});
  const [uPCampgrounds, setUPCampgrounds] = useState([]);
  const [uPAlertMsg, setUPAlertMsg] = useState(null);

  const {
    location: {
      state: {
        alertMessage,
      }
    },
    replace
  } = useHistory();

  const { id } = useParams();

  useEffect(() => {
    // do I need this if statement?
    if (alertMessage) {
      setUPAlertMsg(alertMessage);
    }
  }, [alertMessage]);

  useEffect(() => {
    axios.get(`/api/campgrounds/user/${id}`)
      .then(({ data: { campgrounds, user } }) => {
        setUPCampgrounds(campgrounds);
        setUPAuthor(user);
      });
  }, []);

  function renderEditButton() {
    if (
      (loggedInAs
      && uPAuthor
      && loggedInAs.id === uPAuthor.id)
      || loggedInAs.admin
    ) {
      return (
        <>
          <Link to={{
            pathname: '/editUser',
            state: { author: uPAuthor }
          }}
          >
            <Button size="sm" variant="warning" className="mr-2">Edit User</Button>
          </Link>
        </>
      );
    }
    return null;
  }

  function renderAlert() {
    if (uPAlertMsg) {
      const { text, variant } = uPAlertMsg;
      return (
        <Alert variant={variant}>
          <Alert>
            {text}
            {'    '}
            <Button
              onClick={() => {
                replace(`/ycusers/${uPAuthor.id}`, {});
                setUPAlertMsg(null);
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

  const {
    first_name: firstName,
    last_name: lastName,
    image,
    email
  } = uPAuthor;
  const mailTo = `mailto:${email}`;
  const campgroundComponents = uPCampgrounds.map((campground) => (
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
        {renderEditButton()}
      </div>
      <div className="col-md-8">
        <Container>
          {renderAlert()}
          <Row key={1}>
            {campgroundComponents}
          </Row>
        </Container>
      </div>
    </div>
  );
}

// class UserProfile extends Component {
//   // isMounted = false;

//   state = {
//     author: {},
//     campgrounds: [],
//     alertMessage: null,
//   }

//   componentDidMount() {
//     // this.isMounted = true;
//     const {
//       location: {
//         state: {
//           alertMessage,
//         }
//       },
//       match: {
//         params: {
//           id
//         }
//       }
//     } = this.props;
//     if (alertMessage) {
//       this.setState({ alertMessage });
//     }
//     axios.get(`/api/campgrounds/user/${id}`)
//       .then(({ data: { campgrounds, user: author } }) => {
//         // if (this.isMounted) {
//           this.setState({ campgrounds, author });
//         // }
//       });
//   }

//   // componentWillUnmount() {
//   //   this.isMounted = false;
//   // }

//   renderEditButton = () => {
//     const {
//       loggedInAs,
//     } = this.props;
//     const { author } = this.state;
//     if (
//       (loggedInAs
//       && author
//       && loggedInAs.id === author.id)
//       || loggedInAs.admin
//     ) {
//       return (
//         <>
//           <Link to={{
//             pathname: '/editUser',
//             state: { author }
//           }}
//           >
//             <Button size="sm" variant="warning" className="mr-2">Edit User</Button>
//           </Link>
//         </>
//       );
//     }
//     return null;
//   }

//   renderAlert = () => {
//     const space = '    ';
//     const { alertMessage } = this.state;
//     const {
//       history,
//     } = this.props;
//     const { author } = this.state;
//     if (alertMessage) {
//       const { text, variant } = alertMessage;
//       return (
//         <Alert variant={variant}>
//           <Alert>
//             {text}
//             {space}
//             <Button
//               onClick={() => {
//                 history.replace(`/ycusers/${author.id}`, {});
//                 this.setState({ alertMessage: null });
//               }}
//               variant="outline-success"
//               size="sm"
//             >
//               X
//             </Button>
//           </Alert>
//         </Alert>
//       );
//     }
//     return null;
//   };

//   render() {
//     const {
//       campgrounds,
//       author: {
//         first_name: firstName,
//         last_name: lastName,
//         image,
//         email
//       }
//     } = this.state;
//     const mailTo = `mailto:${email}`;
//     const campgroundComponents = campgrounds.map((campground) => (
//       <Col key={campground.id} md={3} sm={6}>
//         <Campground campground={campground} />
//       </Col>
//     ));
//     return (
//       <div className="row">
//         <div className="col-md-4">
//           <h2>
//             {firstName}
//             {' '}
//             {lastName}
//           </h2>
//           {' '}
//           <div className="thumbnail">
//             <img className="img-fluid" src={image} alt={email} />
//             <div className="caption float-right">
//               <i>
//                 email:
//                 {' '}
//                 <a href={mailTo}>
//                   {email}
//                 </a>
//               </i>
//             </div>
//           </div>
//           {this.renderEditButton()}
//         </div>
//         <div className="col-md-8">
//           <Container>
//             {this.renderAlert()}
//             <Row key={1}>
//               {campgroundComponents}
//             </Row>
//           </Container>
//         </div>
//       </div>
//     );
//   }
// }

// UserProfile.propTypes = {
//   history: PropTypes.shape({
//     replace: PropTypes.func.isRequired
//   }).isRequired,
//   loggedInAs: PropTypes.shape({
//     id: PropTypes.string,
//     password: PropTypes.string,
//     email: PropTypes.string,
//     created_at: PropTypes.string,
//     admin: PropTypes.bool,
//   }).isRequired,
//   location: PropTypes.shape({
//     state: PropTypes.shape({
//       alertMessage: PropTypes.shape({
//         text: PropTypes.string,
//         variant: PropTypes.string
//       }),
//       author: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         email: PropTypes.string.isRequired,
//         username: PropTypes.string,
//         first_name: PropTypes.string,
//         last_name: PropTypes.string,
//         image: PropTypes.string.isRequired,
//         admin: PropTypes.bool,
//       })
//     })
//   }).isRequired,
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       id: PropTypes.string.isRequired
//     })
//   }).isRequired
// };

UserProfile.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired
  }).isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      alertMessage: PropTypes.shape({
        text: PropTypes.string,
        variant: PropTypes.string
      }),
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
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default UserProfile;
