import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import '../app.css';


function NewCampground() {
  const { push } = useHistory();
  const {
    loggedInAs: {
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext);
  const initBtnMessage = 'Select Campground Image (Required)';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);
  const initData = {
    name: '',
    description: '',
    campLocation: '',
    price: '',
  };
  const { values, handleChange } = useForm(initData);
  const {
    price, name, description, campLocation
  } = values;

  useEffect(() => {
    if (loggedInAsId === '') {
      push('/campgrounds');
    }
  }, [loggedInAsId, push]);

  async function submitForm(event) {
    event.preventDefault();
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    fd.append('image', imageFile);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', campLocation);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', loggedInAsId);
    const url = '/api/campgrounds';

    try {
      const { status, data } = await axios.post(url, fd, config);
      if (status === 201) {
        toast.success(data);
        push('/campgrounds');
      } else {
        const error = new Error();
        error.response = {
          status: 400,
          data: 'Unsuccessful request'
        };
        throw error;
      }
    } catch (err) {
      const {
        response: {
          status,
          data
        }
      } = err;
      toast.error(`${data} (${status})`);
    }
  }

  return (
    <div className="margin-top-50">
      <Container>
        <h1 className="text-center">Create a New Campground</h1>
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
                  data-multiple-caption={btnMessage}
                  onChange={handleFileChange}
                />
                <span>{btnMessage}</span>
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
            <Link to="/campgroundsHome">
              <Button
                size="sm"
                variant="link"
              >
                Go Back
              </Button>
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default NewCampground;
