import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Col, Container, Row, Spinner
} from 'react-bootstrap';
import '../app.css';
import useCampgrounds from '../hooks/useCampgrounds';
import Campgrounds from './campgrounds';
import UserPicDisplay from './userPicDisplay';

function UserProfile() {
  const { id: userId } = useParams();
  const { data: { campgrounds, user: author, mapKey }, error, isPending } = useCampgrounds(userId);

  const campgroundsDisplayConfig = {
    campClass: 'campgroundUserThumb',
    sm: 6,
    md: 4,
    lg: 3,
    mapKey
  };

  const spinnerStyle = isPending ? { left: '50%' } : { display: 'none' };
  const loadedDisplay = isPending ? { display: 'none' } : {};

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="row">
      <Container>
        <Row
          style={spinnerStyle}
          key={1}
        >
          <Col
            style={{
              textAlign: 'center',
              top: '5em'
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
      <div
        className="col-md-4"
        style={loadedDisplay}
      >
        <UserPicDisplay
          userId={userId}
          author={author}
        />
      </div>
      <div className="user-cg-box col-md-8">
        <Container>
          <Row key={2} style={loadedDisplay}>
            <Campgrounds
              campgrounds={campgrounds}
              configObj={campgroundsDisplayConfig}
            />
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UserProfile;
