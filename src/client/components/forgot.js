import React, { useState, useEffect } from 'react';
import {
  Link,
  useHistory
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import '../app.css';

function Forgot({ loggedInAs: { id: loggedInAsId } }) {
  const [email, setEmail] = useState('');
  // const [alert, setAlert] = useState({ alertMessage: null, variant: null });
  const { push } = useHistory();

  useEffect(() => {
    if (loggedInAsId.length > 0) {
      push('/campgrounds');
    }
  }, [loggedInAsId]);

  function onEmailFormChange(event) {
    setEmail(event.target.value);
  }

  async function submitEmailReset(event) {
    event.preventDefault();
    try {
      const { data, status } = await axios.post('api/users/forgot', { email });
      if (status === 200) {
        toast.success(data);
        push('/campgrounds');
        // push({
        //   pathname: '/campgrounds',
        //   state: {
        //     alertMessage: {
        //       text: data,
        //       variant: 'success'
        //     }
        //   }
        // });
      }
    } catch (err) {
      const { response: { status, statusText } } = err;
      toast.error(`${statusText} (${status})`);
      // setAlert({
      //   alertMessage: `${statusText} (${status})`,
      //   variant: 'danger'
      // });
    }
  }

  // function renderAlert() {
  //   const { alertMessage, variant } = alert;
  //   if (alertMessage) {
  //     return (
  //       <Alert variant={variant}>
  //         {alertMessage}
  //       </Alert>
  //     );
  //   }
  //   return null;
  // }

  return (
    <div className="margin-top-50">
      {renderAlert()}
      <Container>
        <h1 className="text-center">Forgot Password</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={(e) => submitEmailReset(e)}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={onEmailFormChange}
            />
          </div>
          <br />
          <div className="form-group">
            <Button
              className="btn-block"
              variant="primary"
              type="submit"
            >
              Reset Password
            </Button>
          </div>
          <Link to="/login">
            <Button size="sm" variant="link">Go Back</Button>
          </Link>
        </form>
      </Container>
    </div>
  );
}


// class Forgot extends Component {
//   state = {
//     alertMessage: null,
//     variant: null,
//     email: ''
//   }

//   componentDidMount() {
//     const {
//       history,
//       loggedInAs,
//       location: {
//         state
//       }
//     } = this.props;

//     if (loggedInAs.id.length > 0) {
//       history.push('/campgrounds');
//     }

//     if (state) {
//       const { alertMessage } = state;
//       this.setState({ alertMessage });
//     }
//   }

//   componentDidUpdate() {
//     const { history, loggedInAs } = this.props;

//     if (loggedInAs.id.length > 0) {
//       history.push('/campgrounds');
//     }
//   }

//   onFormChange = (event) => {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   }

//   submitEmailReset = async (event) => {
//     event.preventDefault();
//     const { history } = this.props;
//     const { email } = this.state;
//     try {
//       const { data, status } = await axios.post('api/users/forgot', { email });
//       if (status === 200) {
//         history.push({
//           pathname: '/campgrounds',
//           state: {
//             alertMessage: {
//               text: data,
//               variant: 'success'
//             }
//           }
//         });
//       }
//     } catch (err) {
//       const { response: { status, statusText } } = err;
//       this.setState({
//         alertMessage: `${statusText} (${status})`,
//         variant: 'danger'
//       });
//     }
//   }

//   renderAlert = () => {
//     const { alertMessage, variant } = this.state;
//     if (alertMessage) {
//       return (
//         <Alert variant={variant}>
//           {alertMessage}
//         </Alert>
//       );
//     }
//     return null;
//   }

//   render() {
//     const { email } = this.state;
//     return (
//       <div className="margin-top-50">
//         {this.renderAlert()}
//         <Container>
//           <h1 className="text-center">Forgot Password</h1>
//           <br />
//           <form
//             className="entryBox centered"
//             onSubmit={(e) => this.submitEmailReset(e)}
//           >
//             <div className="form-group">
//               <input
//                 className="form-control"
//                 type="text"
//                 name="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={this.onFormChange}
//               />
//             </div>
//             <br />
//             <div className="form-group">
//               <Button
//                 className="btn-block"
//                 variant="primary"
//                 type="submit"
//               >
//                 Reset Password
//               </Button>
//             </div>
//             <Link to="/login">
//               <Button size="sm" variant="link">Go Back</Button>
//             </Link>
//           </form>
//         </Container>
//       </div>
//     );
//   }
// }

Forgot.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired
  // }).isRequired,
  // location: PropTypes.shape({
  //   state: PropTypes.shape({
  //     alertMessage: PropTypes.shape({
  //       text: PropTypes.string,
  //       variant: PropTypes.string
  //     }),
  //   }),
  // }).isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired
};

export default Forgot;
