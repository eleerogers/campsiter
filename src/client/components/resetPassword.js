import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import useForm from '../hooks/useForm';
import '../app.css';


function Reset() {
  const [rPEmail, setRPEmail] = useState();
  const { push } = useHistory();
  const { reset_password_token: resetPasswordToken } = useParams();

  useEffect(() => {
    axios.get(`/api/users/token/${resetPasswordToken}`)
      .then(({ data: { user: { email } } }) => {
        setRPEmail(email);
      });
  }, []);

  const { values, handleChange } = useForm({ password1: '', password2: '' });
  const { password1, password2 } = values;

  async function submitEmailReset(event) {
    event.preventDefault();
    try {
      if (password1 !== '') {
        if (password1 === password2) {
          const pwData = {
            password: password1,
            reset_password_token: resetPasswordToken
          };
          const { data, status } = await axios.post('/api/users/reset', pwData);
          if (status === 201) {
            toast.success(data);
            push('/login');
            // push({
            //   pathname: '/login',
            //   state: {
            //     alertMessage: {
            //       text: data,
            //       variant: 'success'
            //     }
            //   }
            // });
          } else {
            console.log(`${data} (${status})`);
          }
        } else {
          toast.error('Password fields do not match');
          // setAlertMessage({
          //   text: 'Passwords do not match',
          //   variant: 'danger'
          // });
        }
      } else {
        toast.error('Password cannot be blank');
        // setAlertMessage({
        //   text: 'Password cannot be blank',
        //   variant: 'danger'
        // });
      }
    } catch (err) {
      const { response: { status, data } } = err;
      toast.error(`${data} (${status})`);
      // if (status === 410) {
      //   setAlertMessage({
      //     text: data,
      //     variant: 'danger'
      //   });
      // }
    }
  }

  // function renderAlert() {
  //   if (alertMessage) {
  //     const { text, variant } = alertMessage;
  //     if (text.length > 0) {
  //       return (
  //         <Alert variant={variant}>
  //           {text}
  //         </Alert>
  //       );
  //     }
  //   }
  //   return null;
  // }

  return (
    <div className="margin-top-50">
      {/* {renderAlert()} */}
      <Container>
        <h2 className="text-center">
          Reset Password:
        </h2>
        <h4 className="text-center">{ rPEmail }</h4>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitEmailReset}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password1"
              placeholder="New Password"
              value={password1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={password2}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <Button
              className="btn-block"
              variant="primary"
              type="submit"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

// class Rset extends Component {
//   state = {
//     alertMessage: null,
//     variant: null,
//     password1: '',
//     password2: '',
//     email: ''
//   }

//   componentDidMount() {
//     const {
//       match: {
//         params: {
//           reset_password_token: resetPasswordToken
//         }
//       }
//     } = this.props;
//     const url = `/api/users/token/${resetPasswordToken}`;
//     axios.get(url)
//       .then(({ data: { user: { email } } }) => {
//         this.setState({
//           email
//         });
//       });
//   }

//   onFormChange = (event) => {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   }

//   submitEmailReset = async (event) => {
//     event.preventDefault();
//     const {
//       history,
//       match: {
//         params: {
//           reset_password_token: resetPasswordToken
//         }
//       }
//     } = this.props;
//     const { password1, password2 } = this.state;
//     try {
//       if (password1 !== '') {
//         if (password1 === password2) {
//           const pwData = {
//             password: password1,
//             reset_password_token: resetPasswordToken
//           };
//           const { data, status } = await axios.post('/api/users/reset', pwData);
//           if (status === 201) {
//             history.push({
//               pathname: '/login',
//               state: {
//                 alertMessage: {
//                   text: data,
//                   variant: 'success'
//                 }
//               }
//             });
//           }
//         } else {
//           this.setState({
//             alertMessage: 'Passwords do not match',
//             variant: 'danger'
//           });
//         }
//       } else {
//         this.setState({
//           alertMessage: 'Password cannot be blank',
//           variant: 'danger'
//         });
//       }
//     } catch (err) {
//       const { response: { status, data } } = err;
//       if (status === 410) {
//         this.setState({
//           alertMessage: data,
//           variant: 'danger'
//         });
//       }
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
//     const { password1, password2, email } = this.state;
//     return (
//       <div className="margin-top-50">
//         {this.renderAlert()}
//         <Container>
//           <h2 className="text-center">
//             Reset Password:
//           </h2>
//           <h4 className="text-center">{ email }</h4>
//           <br />
//           <form
//             className="entryBox centered"
//             onSubmit={(e) => this.submitEmailReset(e)}
//           >
//             <div className="form-group">
//               <input
//                 className="form-control"
//                 type="password"
//                 name="password1"
//                 placeholder="New Password"
//                 value={password1}
//                 onChange={this.onFormChange}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 className="form-control"
//                 type="password"
//                 name="password2"
//                 placeholder="Confirm Password"
//                 value={password2}
//                 onChange={this.onFormChange}
//               />
//             </div>
//             <div className="form-group">
//               <Button
//                 className="btn-block"
//                 variant="primary"
//                 type="submit"
//               >
//                 Reset Password
//               </Button>
//             </div>
//           </form>
//         </Container>
//       </div>
//     );
//   }
// }

// Reset.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired
//   }).isRequired,
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       reset_password_token: PropTypes.string.isRequired
//     })
//   }).isRequired
// };

// Reset.propTypes = {
//   alertMessage: PropTypes.shape({
//     text: PropTypes.string,
//     variant: PropTypes.string
//   }),
//   setAlertMessage: PropTypes.func.isRequired
// };

// Reset.defaultProps = {
//   alertMessage: {
//     text: '',
//     variant: ''
//   }
// };

export default Reset;
