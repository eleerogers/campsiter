import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import MapContainer from './map';
import DeleteModal from './deleteModal';

function CampgroundPage({ loggedInAs }) {
  // const [alertMessage, setAlertMessage] = useState(null);
  const [author, setAuthor] = useState({});
  const [comments, setComments] = useState([]);
  const {
    location: {
      state: {
        campground,
        // alertMessage: incomingAlertMessage
      }
    },
    push,
  } = useHistory();
  const {
    id: campgroundId,
    user_id: userId,
    image_id: imageId,
    name,
    image,
    description,
    price,
    created_at: createdAt
  } = campground;
  const {
    id: loggedInAsId,
    admin: loggedInAsAdmin,
    email: loggedInAsEmail
  } = loggedInAs;

  // useEffect(() => {
  //   if (incomingAlertMessage) {
  //     setAlertMessage(incomingAlertMessage);
  //   }
  // }, [incomingAlertMessage]);

  useEffect(() => {
    axios.get(`/api/comments/${campgroundId}`)
      .then(({ data: { comments: incomingComments } }) => {
        setComments(incomingComments);
      })
      .catch((err) => { console.error(err); });
  }, []);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(({ data: { user } }) => {
        setAuthor(user);
      })
      .catch((err) => { console.error(err); });
  }, []);

  async function deleteCampgroundAndRedirect(adminBool) {
    try {
      const delUrl = `/api/campgrounds/${campgroundId}`;
      const data = {
        adminBool,
        userId,
        imageId,
        delete: true
      };
      const {
        status,
        data: message
      } = await axios.delete(delUrl, { data });

      if (status === 200) {
        toast.success(message);
        push('/campgrounds');
        // push({
        //   pathname: '/campgrounds',
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
      // setAlertMessage({
      //   text: `${message} (${status})`,
      //   variant: 'danger'
      // });
    }
  }

  function renderEditDeleteBtns(adminBool) {
    if (
      (loggedInAs
      && author
      && loggedInAsId === author.id)
      || loggedInAsAdmin
    ) {
      return (
        <>
          <Link to={{
            pathname: '/editCampground',
            state: {
              campground,
              loggedInAs
            }
          }}
          >
            <Button
              size="sm"
              variant="warning"
              className="mr-2"
            >
              Edit Campground
            </Button>
          </Link>
          {/* <Button
            size="sm"
            variant="danger"
            onClick={() => deleteCampgroundAndRedirect(loggedInAsAdmin)}
          >
            Delete Campground
          </Button> */}
          <DeleteModal
            itemType="campground"
            itemObj={campground}
            handleDelete={deleteCampgroundAndRedirect}
            loggedInAsAdminBool={adminBool}
          >
            Delete Campground
          </DeleteModal>
        </>
      );
    }
    return null;
  }

  async function deleteComment(commentObj, loggedInAsAdminBool) {
    // event.preventDefault();
    try {
      const url = `/api/comments/${campgroundId}`;
      const {
        comment_id: commentId,
        user_id: commentUserId
      } = commentObj;
      const commentData = {
        adminBool: loggedInAsAdminBool,
        commentId,
        userId: commentUserId
      };
      const {
        data: text
      } = await axios.delete(url, { data: commentData });
      toast.success(text);
      // setAlertMessage({
      //   text,
      //   variant: 'success'
      // });

      const {
        data: {
          comments: updatedComments
        }
      } = await axios.get(`/api/comments/${campgroundId}`);
      setComments(updatedComments);
    } catch (err) {
      const { response: { status, statusText } } = err;
      toast.error(`${statusText} (${status})`);
      // setAlertMessage({
      //   text: `${statusText} (${status})`,
      //   variant: 'danger'
      // });
    }
  }

  function renderCommentButtons(commentObj, adminBool) {
    const loggedInAsIdInteger = parseInt(loggedInAsId, 10);
    const commentUserId = parseInt(commentObj.user_id, 10);
    if (
      (loggedInAs
      && loggedInAsIdInteger === commentUserId)
      || loggedInAsAdmin
    ) {
      return (
        <div className="float-right">
          <Link to={{
            pathname: `/campgrounds/${campgroundId}/comments/edit`,
            state: {
              commentObj, campground, adminBool
            }
          }}
          >
            <Button
              size="sm"
              variant="warning"
              className="mr-2"
            >
              Edit Comment
            </Button>
          </Link>
          {/* <Button
            size="sm"
            variant="danger"
            onClick={(e) => deleteComment(e, commentObj, adminBool)}
          >
            Delete Comment
          </Button> */}
          <DeleteModal
            itemType="comment"
            itemObj={commentObj}
            handleDelete={deleteComment}
            loggedInAsAdminBool={adminBool}
          >
            Delete Comment
          </DeleteModal>
        </div>
      );
    }
    return null;
  }

  // function renderAlert() {
  //   if (alertMessage) {
  //     const { text, variant } = alertMessage;
  //     const btnVariant = `outline-${alertMessage.variant}`;
  //     return (
  //       <Alert variant={variant}>
  //         <span>{text}</span>
  //         <span className="float-right">
  //           <Button
  //             onClick={() => {
  //               replace(
  //                 `${campgroundId}`,
  //                 { campground, alertMessage: null }
  //               );
  //               setAlertMessage(null);
  //             }}
  //             variant={btnVariant}
  //             size="sm"
  //           >
  //             X
  //           </Button>
  //         </span>
  //       </Alert>
  //     );
  //   }
  //   return null;
  // }

  const commentsDisplay = comments.map((comment) => (
    <div className="col-md-12 mb-2" key={comment.comment_id}>
      <div className="card">
        <div className="card-body">
          <p className="card-title">
            <strong>{comment.email}</strong>
            <span className="float-right">
              {moment(comment.created_at).fromNow()}
            </span>
          </p>
          <p className="card-text float-left">{comment.comment}</p>
          <div className="float-right">
            {renderCommentButtons(comment, loggedInAsAdmin)}
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container">
      <div className="row my-3">
        <div className="col-md-3">
          <div className="map col-md-12 d-none d-md-block">
            <MapContainer campground={campground} />
          </div>
        </div>
        <div className="col-md-9">
          {/* {renderAlert()} */}
          <div className="card mb-3">
            <img
              className="img-responsive cover"
              alt={name}
              src={image}
            />
            <div className="card-body">
              <h6 className="float-right">
                $
                {price}
                /night
              </h6>
              <h4>
                <a href="#campground">{name}</a>
              </h4>
              <p>{description}</p>
              <p>
                <em>
                  Submitted by:
                  {' '}
                  <Link to={{
                    pathname: `/ycusers/${author.id}`,
                    state: {
                      author
                    }
                  }}
                  >
                    {author.email}
                  </Link>
                  {' '}
                  {moment(createdAt).fromNow()}
                </em>
              </p>
              {renderEditDeleteBtns(loggedInAsAdmin)}
            </div>
          </div>
          <div className="card card-body bg-light">
            <div className="text-right">
              {loggedInAsEmail && loggedInAsEmail.length > 0
                ? (
                  <Link to={{
                    pathname: `/campgrounds/${campgroundId}/comments/new`,
                    state: {
                      campground
                    }
                  }}
                  >
                    <Button
                      size="sm"
                      variant="success"
                    >
                      Add New Comment
                    </Button>
                  </Link>
                )
                : (
                  <Link to={{
                    pathname: '/login',
                  }}
                  >
                    <Button
                      size="sm"
                      variant="success"
                    >
                      Login to Comment
                    </Button>
                  </Link>
                )}
            </div>
            <hr />
            <div className="row">
              {commentsDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// class CampgroundPage extends React.Component {
//   state = {
//     comments: [],
//     author: {},
//     campground: {},
//     history: [],
//     alertMessage: null
//   }

//   async componentDidMount() {
//     try {
//       const {
//         location: {
//           state: {
//             campground,
//             alertMessage
//           }
//         }, history
//       } = this.props;

//       const { id, user_id: userId } = campground;

//       this.setState({ campground, history, alertMessage });

//       const { data: { comments } } = await axios.get(`/api/comments/${id}`);
//       this.setState({ comments });

//       const { data: { user } } = await axios.get(`/api/users/${userId}`);
//       this.setState({ author: user });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   deleteCampgroundAndRedirect = async (adminBool) => {
//     try {
//       const {
//         campground: {
//           id, user_id: userId, image_id: imageId
//         },
//         history
//       } = this.state;

//       const data = {
//         adminBool,
//         userId,
//         imageId,
//         delete: true
//       };
//       const { status, data: message } = await axios.delete(`/api/campgrounds/${id}`, { data });
//       if (status === 200) {
//         history.push({
//           pathname: '/campgrounds',
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
//         alertMessage: {
//           text: `${message} (${status})`,
//           variant: 'danger'
//         }
//       });
//     }
//   }

//   renderEditDeleteBtns = () => {
//     const { campground, author } = this.state;
//     const { loggedInAs } = this.props;
//     if (
//       (loggedInAs
//       && author
//       && loggedInAs.id === author.id)
//       || loggedInAs.admin
//     ) {
//       return (
//         <>
//           <Link to={{
//             pathname: '/editCampground',
//             state: {
//               campground,
//               loggedInAs
//             }
//           }}
//           >
//             <Button size="sm" variant="warning" className="mr-2">Edit Campground</Button>
//           </Link>
//           <Button size="sm" variant="danger" onClick={() => this.deleteCampgroundAndRedirect(loggedInAs.admin)}>Delete Campground</Button>
//         </>
//       );
//     }
//     return null;
//   }

//   renderCommentButtons = (commentObj, adminBool) => {
//     const { loggedInAs } = this.props;
//     const { campground } = this.state;
//     const { id } = campground;
//     const loggedInAsId = parseInt(loggedInAs.id, 10);
//     const commentUserId = parseInt(commentObj.user_id, 10);
//     if (
//       (loggedInAs
//       && loggedInAsId === commentUserId)
//       || loggedInAs.admin
//     ) {
//       return (
//         <div className="float-right">
//           <Link to={{
//             pathname: `/campgrounds/${id}/comments/edit`,
//             state: {
//               commentObj, campground, adminBool
//             }
//           }}
//           >
//             <Button size="sm" variant="warning" className="mr-2">Edit Comment</Button>
//           </Link>
//           <Button size="sm" variant="danger" onClick={(e) => this.deleteComment(e, commentObj, adminBool)}>Delete Comment</Button>
//         </div>
//       );
//     }
//     return null;
//   }

//   deleteComment = async (event, commentObj, adminBool) => {
//     try {
//       event.preventDefault();
//       const { campground: { id } } = this.state;
//       const url = `/api/comments/${id}`;
//       const { comment_id: commentId, user_id: userId } = commentObj;
//       const commentData = {
//         adminBool,
//         commentId,
//         userId
//       };

//       const { data: text } = await axios.delete(url, { data: commentData });

//       this.setState({
//         alertMessage: {
//           text,
//           variant: 'success'
//         }
//       });

//       const { data: { comments } } = await axios.get(`/api/comments/${id}`);

//       this.setState({ comments });
//     } catch (err) {
//       const { response: { status, statusText } } = err;
//       this.setState({
//         alertMessage: {
//           text: `${statusText} (${status})`,
//           variant: 'danger'
//         }
//       });
//     }
//   }

//   renderAlert = () => {
//     const { history } = this.props;
//     const { alertMessage, campground } = this.state;
//     const { id } = campground;
//     if (alertMessage) {
//       const { text, variant } = alertMessage;
//       const btnVariant = `outline-${alertMessage.variant}`;
//       return (
//         <Alert variant={variant}>
//           <span>{text}</span>
//           <span className="float-right">
//             <Button
//               onClick={() => {
//                 history.replace(`${id}`, { campground, alertMessage: null });
//                 this.setState({
//                   alertMessage: null
//                 });
//               }}
//               variant={btnVariant}
//               size="sm"
//             >
//               X
//             </Button>
//           </span>
//         </Alert>
//       );
//     }
//     return null;
//   }

//   render() {
//     const { loggedInAs } = this.props;
//     const {
//       campground, comments, author
//     } = this.state;
//     const {
//       name, image, description, price, id, created_at: createdAt
//     } = campground;
//     return (
//       <div className="container">
//         <div className="row my-3">
//           <div className="col-md-3">
//             <div className="map col-md-12 d-none d-md-block">
//               <MapContainer campground={campground} />
//             </div>
//           </div>
//           <div className="col-md-9">
//             {this.renderAlert()}
//             <div className="card mb-3">
//               <img className="img-responsive cover" alt={name} src={image} />
//               <div className="card-body">
//                 <h6 className="float-right">
//                   $
//                   {price}
//                   /night
//                 </h6>
//                 <h4>
//                   <a href="#campground">{name}</a>
//                 </h4>
//                 <p>{description}</p>
//                 <p>
//                   <em>
//                     Submitted by:
//                     {' '}
//                     <Link to={{
//                       pathname: `/ycusers/${author.id}`,
//                       state: {
//                         author
//                       }
//                     }}
//                     >
//                       {author.email}
//                     </Link>
//                     {' '}
//                     {moment(createdAt).fromNow()}
//                   </em>
//                 </p>
//                 {this.renderEditDeleteBtns()}
//               </div>
//             </div>
//             <div className="card card-body bg-light">
//               <div className="text-right">
//                 {loggedInAs.email && loggedInAs.email.length > 0
//                   ? (
//                     <Link to={{
//                       pathname: `/campgrounds/${id}/comments/new`,
//                       state: {
//                         campground
//                       }
//                     }}
//                     >
//                       <Button size="sm" variant="success">Add New Comment</Button>
//                     </Link>
//                   )
//                   : (
//                     <Link to={{
//                       pathname: '/login',
//                     }}
//                     >
//                       <Button size="sm" variant="success">Login to Comment</Button>
//                     </Link>
//                   )}
//               </div>
//               <hr />
//               <div className="row">
//                 {comments.map((comment) => (
//                   <div className="col-md-12 mb-2" key={comment.comment_id}>
//                     <div className="card">
//                       <div className="card-body">
//                         <p className="card-title">
//                           <strong>{comment.email}</strong>
//                           <span className="float-right">
//                             {moment(comment.created_at).fromNow()}
//                           </span>
//                         </p>
//                         <p className="card-text float-left">{comment.comment}</p>
//                         <div className="float-right">
//                           {this.renderCommentButtons(comment, loggedInAs.admin)}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

CampgroundPage.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  //   replace: PropTypes.func.isRequired
  // }).isRequired,
  // location: PropTypes.shape({
  //   state: PropTypes.shape({
  //     campground: PropTypes.shape({
  //       id: PropTypes.number.isRequired,
  //       user_id: PropTypes.number.isRequired
  //     }).isRequired,
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
  }).isRequired,
};

export default CampgroundPage;
