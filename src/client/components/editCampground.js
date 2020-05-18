import React, { useState, useEffect, useRef } from 'react';
import {
  Link,
  // withRouter,
  useHistory
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
// import PropTypes from 'prop-types';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import '../app.css';
// import getUploadedFileName from '../utils/getUploadedFileName';

function EditCampground() {
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    location: {
      state: {
        campground,
        loggedInAs: {
          admin,
          id: loggedInAsId
        }
      }
    },
    push
  } = useHistory();
  const initBtnMessage = 'Change Campground Image';
  const { imageFile, message, handleFileChange } = useGetFileName(initBtnMessage);
  const { values, handleChange } = useForm(campground);
  const {
    name,
    image,
    image_id: imageId,
    description,
    price,
    id: campgroundId,
    user_id: userId,
    location: campLocation,
  } = values;
  const nameRef = useRef(name);

  useEffect(() => {
    if (loggedInAsId === '') {
      push('/campgrounds');
    }
  }, [loggedInAsId]);

  function renderAlert() {
    if (errorMessage) {
      return (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      );
    }
    return null;
  }

  async function submitForm(event) {
    event.preventDefault();
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    if (imageFile) {
      fd.append('image', imageFile);
    } else {
      fd.append('image', image);
    }
    fd.append('imageId', imageId);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', campLocation);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', userId);
    fd.append('adminBool', admin);
    const url = `/api/campgrounds/${campgroundId}`;

    try {
      const {
        status,
        data: {
          campground: updatedCampground,
          message: putResponseMsg
        }
      } = await axios.put(url, fd, config);
      if (status === 200) {
        push({
          pathname: `/campgrounds/${campgroundId}`,
          state: {
            campground: updatedCampground,
            alertMessage: {
              text: putResponseMsg,
              variant: 'success'
            }
          }
        });
      } else {
        const error = new Error();
        error.response = {
          status: 400,
          data: 'Unsuccessful request'
        };
        throw error;
      }
    } catch (err) {
      console.log('err: ', err);
      const {
        response: {
          status,
          data
        }
      } = err;
      console.log('status: ', status);
      console.log('data: ', data);
      setErrorMessage(`${data} (${status})`);
    }
  }

  return (
    <div className="margin-top-50">
      {renderAlert()}
      <Container>
        <h1 className="text-center">
          Edit Campground:
          {' '}
          {nameRef.current}
        </h1>
        <br />
        <form onSubmit={submitForm}>
          <div className="entryBox centered">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={name}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={description}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="campLocation"
                placeholder="Location"
                onChange={handleChange}
                value={campLocation}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="price"
                placeholder="Price ($/night)"
                onChange={handleChange}
                value={price}
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
                  data-multiple-caption={message}
                  onChange={handleFileChange}
                />
                <span>{message}</span>
              </label>
            </div>
            <br />
            <div className="form-group">
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
                size="lg"
              >
                Submit
              </Button>
            </div>
            <Link to={{
              pathname: `/campgrounds/${campgroundId}`,
              state: {
                campground
              }
            }}
            >
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default EditCampground;


// import React, { Component } from 'react';
// import {
//   Link,
//   withRouter
// } from 'react-router-dom';
// import { Button, Container, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// import '../app.css';
// import getUploadedFileName from '../utils/getUploadedFileName';


// class EditCampground extends Component {
//   state = {
//     name: '',
//     image: '',
//     imageId: '',
//     imageFile: null,
//     description: '',
//     campLocation: '',
//     price: '',
//     id: null,
//     userId: null,
//     errorMessage: null,
//     admin: false,
//     message: 'Change Campground Image'
//   }

//   componentDidMount() {
//     const {
//       history,
//       location: {
//         state: {
//           campground,
//           loggedInAs: {
//             admin,
//             id: loggedInAsId
//           }
//         }
//       }
//     } = this.props;
//     if (loggedInAsId === 0) {
//       history.push('/campgrounds');
//     }
//     const {
//       name,
//       image,
//       image_id: imageId,
//       description,
//       price,
//       id,
//       user_id: userId,
//       location: campLocation,
//       lat,
//       lng
//     } = campground;
//     this.setState({
//       name,
//       image,
//       imageId,
//       description,
//       campLocation,
//       price,
//       id,
//       userId,
//       lat,
//       lng,
//       admin
//     });
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
//     const {
//       name,
//       image,
//       imageId,
//       imageFile,
//       description,
//       campLocation,
//       price,
//       id,
//       userId,
//       admin,
//     } = this.state;
//     const priceNoDollarSign = price.replace(/\$/gi, '');
//     const url = `/api/campgrounds/${id}`;
//     const { history } = this.props;

//     const fd = new FormData();
//     const config = {
//       headers: {
//         'content-type': 'multipart/form-data'
//       }
//     };
//     if (imageFile) {
//       fd.append('image', imageFile);
//     } else {
//       fd.append('image', image);
//     }
//     fd.append('imageId', imageId);
//     fd.append('name', name);
//     fd.append('description', description);
//     fd.append('campLocation', campLocation);
//     fd.append('price', priceNoDollarSign);
//     fd.append('userId', userId);
//     fd.append('adminBool', admin);

//     try {
//       const {
//         status,
//         data: {
//           campground, message
//         }
//       } = await axios.put(url, fd, config);
//       if (status === 200) {
//         history.push({
//           pathname: `/campgrounds/${id}`,
//           state: {
//             campground,
//             alertMessage: {
//               text: message,
//               variant: 'success'
//             }
//           }
//         });
//       }
//     } catch (err) {
//       const {
//         response: {
//           status,
//           data: message
//         }
//       } = err;
//       this.setState({
//         errorMessage: `${message} (${status})`
//       });
//     }
//   }

//   render() {
//     const {
//       name,
//       image,
//       imageId,
//       description,
//       campLocation,
//       price,
//       id,
//       userId,
//       message,
//       lat,
//       lng
//     } = this.state;
//     const campground = {
//       name,
//       image,
//       image_id: imageId,
//       description,
//       location: campLocation,
//       price,
//       id,
//       user_id: userId,
//       lat,
//       lng
//     };
//     return (
//       <div className="margin-top-50">
//         {this.renderAlert()}
//         <Container>
//           <h1 className="text-center">
//             Edit Campground:
//             {' '}
//             {name}
//           </h1>
//           <br />
//           <form onSubmit={this.submitForm}>
//             <div className="entryBox centered">
//               <div className="form-group">
//                 <input
//                   className="form-control"
//                   type="text"
//                   name="name"
//                   value={name}
//                   onChange={this.onChange}
//                   placeholder="Name of Campground"
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   className="form-control"
//                   type="text"
//                   name="description"
//                   value={description}
//                   onChange={this.onChange}
//                   placeholder="Description"
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   className="form-control"
//                   type="text"
//                   name="campLocation"
//                   value={campLocation}
//                   onChange={this.onChange}
//                   placeholder="Location"
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   className="form-control"
//                   type="text"
//                   name="price"
//                   value={price}
//                   onChange={this.onChange}
//                   placeholder="Price"
//                 />
//               </div>
//               <div className="form-group">
//                 <label
//                   htmlFor="file-upload"
//                   className="btn btn-outline-primary btn-block"
//                 >
//                   <input
//                     id="file-upload"
//                     type="file"
//                     name="image"
//                     data-multiple-caption={message}
//                     onChange={this.getFileName}
//                   />
//                   <span>{message}</span>
//                 </label>
//               </div>
//               <br />
//               <div className="form-group">
//                 <Button
//                   className="btn-block"
//                   variant="primary"
//                   type="submit"
//                   size="lg"
//                 >
//                   Submit
//                 </Button>
//               </div>
//               <Link to={{
//                 pathname: `/campgrounds/${id}`,
//                 state: {
//                   campground
//                 }
//               }}
//               >
//                 <Button size="sm" variant="link">Go Back</Button>
//               </Link>
//             </div>
//           </form>
//         </Container>
//       </div>
//     );
//   }
// }

// EditCampground.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired
//   }).isRequired,
//   location: PropTypes.shape({
//     state: PropTypes.shape({
//       campground: PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         user_id: PropTypes.number.isRequired,
//         name: PropTypes.string.isRequired,
//         image: PropTypes.string.isRequired,
//         image_id: PropTypes.string.isRequired,
//         description: PropTypes.string.isRequired,
//         price: PropTypes.string.isRequired,
//         location: PropTypes.string.isRequired,
//         lat: PropTypes.number.isRequired,
//         lng: PropTypes.number.isRequired
//       }),
//       alertMessage: PropTypes.shape({
//         text: PropTypes.string,
//         variant: PropTypes.string
//       }),
//       loggedInAs: PropTypes.shape({
//         id: PropTypes.string,
//         password: PropTypes.string,
//         email: PropTypes.string,
//         created_at: PropTypes.string,
//         admin: PropTypes.bool,
//       }),
//     }),
//   }),
//   loggedInAs: PropTypes.shape({
//     id: PropTypes.string,
//     password: PropTypes.string,
//     email: PropTypes.string,
//     created_at: PropTypes.string,
//     admin: PropTypes.bool,
//   }).isRequired,
// };

// EditCampground.defaultProps = {
//   location: {
//     state: {
//       campground: {
//         id: NaN,
//         user_id: NaN,
//         name: '',
//         image: '',
//         image_id: '',
//         description: '',
//         price: '',
//         location: '',
//         lat: NaN,
//         lng: NaN
//       }
//     }
//   }
// };

// export default withRouter(EditCampground);
