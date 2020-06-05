import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button, Col, Container, Row, Spinner
} from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import MapContainer from './map';
import DeleteModal from './deleteModal';
import useLoading from '../hooks/useLoading';
import Comments from './comments';

function CampgroundPage() {
  const [loading, setLoadingFalse] = useLoading();
  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin,
      email: loggedInAsEmail
    }
  } = useContext(LoggedInAsContext);
  const {
    location: {
      state: {
        campground,
        mapKey
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
    email: authorEmail,
    lat,
    lng
  } = campground;

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
        push('/campgroundsHome');
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
    }
  }

  function renderEditDeleteBtns(adminBool) {
    if (
      loggedInAsId === String(userId)
      || loggedInAsAdmin
    ) {
      return (
        <>
          <Link to={{
            pathname: '/editCampground',
            state: {
              campground
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

  const spinnerStyle = loading
    ? {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
    : { display: 'none' };

  return (
    <div className="container">
      <div className="row my-3">
        <div className="col-md-3">
          <div className="map col-md-12 d-none d-md-block">
            <MapContainer
              lat={lat}
              lng={lng}
              mapKey={mapKey}
            />
          </div>
        </div>
        <div className="col-md-9">
          <div className="card mb-3">
            <div className="test-div">
              <div
                style={{ display: 'flex' }}
                className="test-image"
              >
                <Container
                  className="d-flex justify-content-center"
                >
                  <Row
                    style={spinnerStyle}
                    key={1}
                  >
                    <Col
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      <Spinner
                        animation="border"
                        variant="primary"
                        size="xl"
                      />
                    </Col>
                  </Row>
                </Container>
              </div>
              <img
                className={`test-image img-responsive cover transition ${loading ? 'loading' : 'done'}`}
                alt={name}
                src={image}
                onLoad={setLoadingFalse}
              />
            </div>
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampgroundPage;
