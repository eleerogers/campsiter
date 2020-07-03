import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import ReactDelayRender from 'react-delay-render';


const Loading = () => (
  <Container className="text-align-center min-height-50vh">
    <Row
      key={1}
    >
      <Col
        style={{
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
)

export default ReactDelayRender({ delay: 300 })(Loading);
