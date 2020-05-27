import React, { useEffect, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import '../app.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';


function EditUser() {
  const {
    setLoggedInAs,
    loggedInAs: {
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext);
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
    btnMessage,
    handleFileChange
  } = useGetFileName(initBtnMessage);

  useEffect(() => {
    if (loggedInAsId.length === 0 || loggedInAsId !== id) {
      push('/campgrounds');
    }
  }, [loggedInAsId, push, id]);

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
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
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

export default EditUser;
