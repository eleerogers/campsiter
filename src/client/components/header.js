import React from 'react';
import {
  Nav, Navbar, Container, Button, Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const Header = ({ loggedInAs, logout }) => {
  return (
    <Navbar className="mb-3" bg="light" variant="light">
      <Container className="d-flex justify-content-between">
        <Col>
          <Link to="/">
            <Navbar.Brand>YelpCamp2</Navbar.Brand>
          </Link>
        </Col>
        <Col />
        <Col>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {loggedInAs.email.length > 0
                ? (
                  <div>
                    Logged in as
                    {' '}
                    <Link to={{
                      pathname: `/ycusers/${loggedInAs.id}`,
                      state: {
                        author: loggedInAs
                      }
                    }}
                    >
                      {loggedInAs.email}
                    </Link>
                    {' '}
                    {loggedInAs.admin && '(admin)'}
                    <Button size="sm" className="float-right" onClick={logout}>Logout</Button>
                  </div>
                )
                : (
                  <React.Fragment>
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/signup">Signup</Nav.Link>
                  </React.Fragment>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Col>
      </Container>
    </Navbar>
  );
};


Header.propTypes = {
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;


// class Header extends Component {
//   state = {
//     email: '',
//   }

// componentDidUpdate(prevProps) {
//   const { loggedInAs } = this.props;
//   if (loggedInAs.email !== '' && loggedInAs.email !== prevProps.loggedInAs.email) {
//     fetch(`/api/ycusers/${localStorage.user_id}`)
//       .then(res => res.json())
//       .then((res) => {
//         this.setState({ email: res.email });
//       });
//   }
// }

//   render() {
//     const { email } = this.state;
//     const { loggedInAs, logout } = this.props;
//     return (
//       <Navbar bg="light" variant="light">
//         <Container className="d-flex justify-content-between">
//           <Col>
//             <Link to="/">
//               <Navbar.Brand>YelpCamp</Navbar.Brand>
//             </Link>
//           </Col>
//           <Col />
//           <Col>
//             <Navbar.Collapse id="basic-navbar-nav">
//               <Nav className="mr-auto">
//                 {loggedInAs
//                   ? (
//                     <div>
//                       Logged in as
//                       {' '}
//                       {loggedInAs.email}
//                       <Button onClick={logout}>Logout</Button>
//                     </div>
//                   )
//                   : (
//                     <React.Fragment>
//                       <Nav.Link href="/login">Login</Nav.Link>
//                       <Nav.Link href="/signup">Signup</Nav.Link>
//                     </React.Fragment>
//                   )
//                 }
//               </Nav>
//             </Navbar.Collapse>
//           </Col>
//         </Container>
//       </Navbar>
//     );
//   }
// }