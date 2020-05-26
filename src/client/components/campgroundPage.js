import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import MapContainer from './map';
import DeleteModal from './deleteModal';
import Comments from './comments';

function CampgroundPage({ loggedInAs }) {
  const {
    location: {
      state: {
        campground,
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
    created_at: createdAt,
    email: authorEmail
  } = campground;
  const {
    id: loggedInAsId,
    admin: loggedInAsAdmin,
    email: loggedInAsEmail
  } = loggedInAs;

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
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
    }
  }

  function renderEditDeleteBtns(adminBool) {
    if (
      (loggedInAs
      && loggedInAsId === String(userId))
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

  return (
    <div className="container">
      <div className="row my-3">
        <div className="col-md-3">
          <div className="map col-md-12 d-none d-md-block">
            <MapContainer campground={campground} />
          </div>
        </div>
        <div className="col-md-9">
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
                  <Link to={`/ycusers/${userId}`}>
                    {authorEmail}
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
                  <Link to="/login">
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
              <Comments
                campground={campground}
                loggedInAs={loggedInAs}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


CampgroundPage.propTypes = {
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired,
};

export default CampgroundPage;
