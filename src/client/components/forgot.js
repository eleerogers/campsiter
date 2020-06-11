import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import '../app.css';

function Forgot() {
  const [email, setEmail] = useState('');
  const { push } = useHistory();
  const {
    loggedInAs: {
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext);

  useEffect(() => {
    if (loggedInAsId.length > 0) {
      push('/campgroundsHome');
    }
  }, [loggedInAsId, push]);

  function onEmailFormChange(event) {
    setEmail(event.target.value);
  }

  async function submitEmailReset(event) {
    event.preventDefault();
    try {
      const { data, status } = await axios.post('api/users/forgot', { email });
      if (status === 200) {
        toast.success(data);
        push('/campgroundsHome');
      }
    } catch (err) {
      const { response: { status, statusText } } = err;
      toast.error(`${statusText} (${status})`);
    }
  }

  return (
    <div className="margin-top-50 marginBtm">
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
            <Button
              size="sm"
              variant="link"
              className="float-left"
            >
              Go Back
            </Button>
          </Link>
        </form>
      </Container>
    </div>
  );
}

export default Forgot;
