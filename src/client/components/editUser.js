import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';


function EditUser() {
  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);
  const {
    setLoggedInAs,
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext);
  const {
    push,
    goBack,
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

  const loggedInAsThisUser = loggedInAsId === id

  useEffect(() => {
    if (!localStorage.userId) {
      push('/campgroundsHome');
    }
  }, [push]);

  async function submitForm(event) {
    event.preventDefault();
    setLoadingTrue();
    const lNameNoPeriod = lastName.replace(/\.$/, "");

    const fd = new FormData();
    fd.append('id', id);
    fd.append('username', username);
    fd.append('firstName', firstName);
    fd.append('lastName', lNameNoPeriod);
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
        if (loggedInAsThisUser) {
          setLoggedInAs({
            admin: updatedAdmin,
            id,
            username,
            firstName,
            lastName: lNameNoPeriod,
            email,
            image: newImageLink,
            imageId: newImageId,
          });
        }
        toast.success(message);
        push(`/ycusers/${id}`);
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
    } finally {
      setLoadingFalse();
    }
  }

  function renderAdminBox() {
    if (loggedInAsAdmin) {
      return (
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            name="adminCode"
            placeholder="Enter admin code to toggle admin status"
            value={adminCode}
            onChange={handleChange}
          />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="margin-top-50 marginBtm">
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
              placeholder="Last Name (or initial)"
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
            <LoadingButton
              isLoading={loading}
              className="btn-block loading-button"
              variant="primary"
              type="submit"
            >
              Submit
            </LoadingButton>
          </div>
          <Button
            onClick={goBack}
            size="sm"
            variant="link"
            className="float-left"
          >
            Go Back
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default EditUser;
