import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment-mini';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import MapContainer from './map';
import DeleteModal from './deleteModal';
import useLoading from '../hooks/useLoading';
import useGetCGs from '../hooks/useGetCGs';
import Comments from './comments';

function CampgroundPage() {
  const emptyCGObj = {
    id: 0,
    user_id: '',
    image_id: '',
    name: '',
    image,
    description: '',
    price: '',
    created_at: '',
    username: '',
    lat: 0,
    lng: 0
  };
  const [campground, setCampground] = useState(emptyCGObj)

  const [loading, setLoadingFalse] = useLoading();

  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext);

  const {
    location: {
      state
    },
    push,
  } = useHistory();

  const { id } = useParams();
  const fetchCGUrl = `/api/campgrounds/${id}`;
  const { data: { campground: fetchedCG }, errMsg, isLoading } = useGetCGs(fetchCGUrl, !!state, emptyCGObj);

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  useEffect(() => {
    if (state) {
      const { campground: cGFromHomePage } = state;
      setCampground(cGFromHomePage);
    } else {
      if (!isLoading) {
        setCampground(fetchedCG);
      }
    }
  }, [state, id, isLoading, fetchedCG]);

  const {
    id: campgroundId,
    user_id: userId,
    image_id: imageId,
    name,
    image,
    description,
    price,
    created_at: createdAt,
    username: authorUsername,
    lat,
    lng
  } = campground;

  async function deleteCampgroundAndRedirect() {
    try {
      const delUrl = `/api/campgrounds/${campgroundId}`;
      const data = {
        adminBool: loggedInAsAdmin,
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

  function renderEditDeleteBtns() {
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
              className="mr-2 btn-square"
            >
              Edit
            </Button>
          </Link>
          <DeleteModal
            itemType="campground"
            itemObj={campground}
            handleDelete={deleteCampgroundAndRedirect}
            loggedInAsAdminBool={loggedInAsAdmin}
          >
            Delete
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
    <div>
      <div className="row flex-dir-col-rev">
        <div className="col-md-3">
          <div className="map col-md-12 d-flex d-md-block">
            <MapContainer
              lat={lat}
              lng={lng}
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
              <h4 className="color-dark-blue">
                {name}
              </h4>
              <p className="keepTextSpacing">{description}</p>
              <p>
                <em>
                  Submitted by:
                  {' '}
                  <Link className="text-primary font-weight-600" to={`/ycusers/${userId}`}>
                    {authorUsername}
                  </Link>
                  {' '}
                  {moment(createdAt).fromNow()}
                </em>
              </p>
              {renderEditDeleteBtns()}
            </div>
          </div>
          <div className="card card-body bg-light mb-3">
            <div className="text-right">
            <Link to={{
              pathname: `/campgrounds/${campgroundId}/comments/new`,
              state: {
                campground
              }
            }}
            >
              <Button
                size="sm"
                className="btn-square"
                variant="success"
              >
                Add New Comment
              </Button>
            </Link>
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
