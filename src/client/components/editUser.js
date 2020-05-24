import React, { useEffect } from 'react';
import {
  useHistory,
  Link
} from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';


function EditUser({ setLoggedInAs, loggedInAs: { id: loggedInAsId } }) {
  // const [errorMessage, setErrorMessage] = useState(null);
  const {
    push,
    location: {
      state: {
        author
      }
    }
  } = useHistory();
  const { values, handleChange } = useForm({ ...author, adminCode: '' });
  const {
    id,
    username,
    first_name: firstName,
    last_name: lastName,
    email,
    image,
    image_id: imageId,
    admin,
    adminCode
  } = values;
  const initBtnMessage = 'Change Profile Image';
  const {
    imageFile,
    message: btnMessage,
    handleFileChange
  } = useGetFileName(initBtnMessage);

  useEffect(() => {
    if (loggedInAsId.length === 0 || loggedInAsId !== id) {
      push('/campgrounds');
    }
  }, [loggedInAsId]);

  // function renderAlert() {
  //   if (errorMessage) {
  //     return (
  //       <Alert variant="danger">
  //         {errorMessage}
  //       </Alert>
  //     );
  //   }
  //   return null;
  // }

  async function submitForm(event) {
    event.preventDefault();

    const fd = new FormData();
    fd.append('id', id);
    fd.append('username', username);
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('email', email);
    fd.append('admin', admin);
    fd.append('adminCode', adminCode);
    fd.append('imageId', imageId);
    if (imageFile) {
      fd.append('image', imageFile);
    } else {
      fd.append('image', image);
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    try {
      const {
        status,
        data: {
          message,
          admin: updatedAdmin,
          image: newImageLink,
          image_id: newImageId
        }
      } = await axios.put('/api/users', fd, config);
      if (status === 201) {
        console.log('status 201!');
        setLoggedInAs({
          admin: updatedAdmin,
          id,
          username,
          firstName,
          lastName,
          email,
          image: newImageLink,
          imageId: newImageId,
        });
        toast.success(message);
        push(`/ycusers/${id}`);
        // push({
        //   pathname: `/ycusers/${id}`,
        //   state: {
        //     alertMessage: {
        //       text: message,
        //       variant: 'success'
        //     }
        //   }
        // });
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
      // setErrorMessage(`${message} (${status})`);
    }
  }

  function renderAdminBox() {
    if (!admin) {
      return (
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            name="adminCode"
            placeholder="Admin Code (if applicable)"
            value={adminCode}
            onChange={handleChange}
          />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="margin-top-50">
      {/* {renderAlert()} */}
      <Container>
        <h1 className="text-center">
          Edit account details:
          {' '}
          {username}
        </h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="first_name"
              value={firstName}
              placeholder="First Name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="last_name"
              value={lastName}
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="email"
              value={email}
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="file-upload"
              className="btn btn-outline-primary btn-block"
            >
              <input
                id="file-upload"
                type="file"
                name="image"
                data-multiple-caption={btnMessage}
                onChange={handleFileChange}
              />
              <span>{btnMessage}</span>
            </label>
          </div>
          {renderAdminBox()}
          <div className="form-group">
            <Button
              className="btn-block"
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </div>
          <Link to={{
            pathname: `/ycusers/${id}`,
            state: {
              author
            }
          }}
          >
            <Button size="sm" variant="link">Go Back</Button>
          </Link>
        </form>
      </Container>
    </div>
  );
}


// class EditUser extends Component {
//   state = {
//     id: null,
//     username: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     image: '',
//     imageId: '',
//     imageFile: null,
//     admin: '',
//     adminCode: '',
//     errorMessage: null,
//     message: 'Change Profile Image'
//   }

//   componentDidMount() {
//     const {
//       history,
//       loggedInAs: {
//         id: idFromState
//       },
//       location: {
//         state: {
//           author: {
//             id,
//             username,
//             first_name: firstName,
//             last_name: lastName,
//             email,
//             image,
//             image_id: imageId,
//             admin
//           }
//         }
//       }
//     } = this.props;
//     if (idFromState.length === 0 || idFromState !== id) {
//       history.push('/campgrounds');
//     }
//     this.setState({
//       id,
//       username,
//       firstName,
//       lastName,
//       email,
//       image,
//       imageId,
//       admin
//     });
//   }

//   componentDidUpdate() {
//     const {
//       history,
//       loggedInAs: {
//         id
//       }
//     } = this.props;

//     if (id.length === 0) {
//       history.push('/campgrounds');
//     }
//   }

//   onChange = (event) => {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   }

//   renderAlert = () => {
//     const { errorMessage } = this.state;
//     if (errorMessage) {
//       return (
//         <Alert variant="danger">
//           {errorMessage}
//         </Alert>
//       );
//     }
//     return null;
//   }

//   getFileName = (e) => {
//     getUploadedFileName(e, this.setState.bind(this));
//   }

//   submitForm = async (event) => {
//     event.preventDefault();
//     const { history, updateLoggedinasState } = this.props;
//     const {
//       id,
//       username,
//       firstName,
//       lastName,
//       email,
//       image,
//       imageFile,
//       imageId,
//       adminCode
//     } = this.state;

//     const fd = new FormData();
//     fd.append('id', id);
//     fd.append('username', username);
//     fd.append('firstName', firstName);
//     fd.append('lastName', lastName);
//     fd.append('email', email);
//     fd.append('adminCode', adminCode);
//     fd.append('imageId', imageId);
//     if (imageFile) {
//       fd.append('image', imageFile);
//     } else {
//       fd.append('image', image);
//     }

//     const config = {
//       headers: {
//         'content-type': 'multipart/form-data'
//       }
//     };
//     try {
//       const {
//         status,
//         data: {
//           message,
//           admin,
//           image: newImageLink,
//           image_id: newImageId
//         }
//       } = await axios.put('/api/users', fd, config);
//       if (status === 201) {
//         updateLoggedinasState({
//           admin,
//           id,
//           username,
//           firstName,
//           lastName,
//           email,
//           image: newImageLink,
//           imageId: newImageId,
//         });
//         history.push({
//           pathname: `/ycusers/${id}`,
//           state: {
//             alertMessage: {
//               text: message,
//               variant: 'success'
//             }
//           }
//         });
//       }
//     } catch (err) {
//       const { response: { status, data: message } } = err;
//       this.setState({
//         errorMessage: `${message} (${status})`
//       });
//     }
//   }


//   renderAdminBox = () => {
//     const { admin } = this.state;
//     if (!admin) {
//       return (
//         <div className="form-group">
//           <input
//             className="form-control"
//             type="text"
//             name="adminCode"
//             placeholder="Admin Code (if applicable)"
//             onChange={this.onChange}
//           />
//         </div>
//       );
//     }
//     return null;
//   }

//   render() {
//     const {
//       id,
//       username,
//       firstName,
//       lastName,
//       email,
//       image,
//       imageId,
//       originalImage,
//       admin,
//       message
//     } = this.state;
//     const author = {
//       id,
//       username,
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       image,
//       image_id: imageId,
//       originalImage,
//       admin,
//       message
//     };
//     return (
//       <div className="margin-top-50">
//         {this.renderAlert()}
//         <Container>
//           <h1 className="text-center">
//             Edit account details:
//             {' '}
//             {username}
//           </h1>
//           <br />
//           <form
//             className="entryBox centered"
//             onSubmit={this.submitForm}
//           >
//             <div className="form-group">
//               <input
//                 className="form-control"
//                 type="text"
//                 name="firstName"
//                 value={firstName || ''}
//                 placeholder="First Name"
//                 onChange={this.onChange}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 className="form-control"
//                 type="text"
//                 name="lastName"
//                 value={lastName || ''}
//                 placeholder="Last Name"
//                 onChange={this.onChange}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 className="form-control"
//                 type="text"
//                 name="email"
//                 value={email}
//                 placeholder="Email"
//                 onChange={this.onChange}
//               />
//             </div>
//             <div className="form-group">
//               <label
//                 htmlFor="file-upload"
//                 className="btn btn-outline-primary btn-block"
//               >
//                 <input
//                   id="file-upload"
//                   type="file"
//                   name="image"
//                   data-multiple-caption={message}
//                   onChange={this.getFileName}
//                 />
//                 <span>{message}</span>
//               </label>
//             </div>
//             {this.renderAdminBox()}
//             <div className="form-group">
//               <Button
//                 className="btn-block"
//                 variant="primary"
//                 type="submit"
//               >
//                 Submit
//               </Button>
//             </div>
//             <Link to={{
//               pathname: `/ycusers/${id}`,
//               state: {
//                 author
//               }
//             }}
//             >
//               <Button size="sm" variant="link">Go Back</Button>
//             </Link>
//           </form>
//         </Container>
//       </div>
//     );
//   }
// }


EditUser.propTypes = {
  loggedInAs: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  setLoggedInAs: PropTypes.func.isRequired
};

export default EditUser;
