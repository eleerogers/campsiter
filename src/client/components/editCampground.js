import React, { useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';


function EditCampground() {
  const {
    loggedInAs: { admin }
  } = useContext(LoggedInAsContext);
  const {
    location: {
      state: {
        campground
      }
    },
    push,
    goBack
  } = useHistory();

  const initBtnMessage = 'Change Campground Image';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);

  const { values, handleChange } = useForm(campground);
  const {
    name,
    image,
    image_id: imageId,
    description,
    price,
    id: campgroundId,
    user_id: userId,
    location
  } = values;

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  // so the name at the top of the page doesn't change while you're editing the form:
  const nameRef = useRef(name);

  useEffect(() => {
    if (!localStorage.userId) {
      push('/campgroundsHome');
    }
  }, [push]);

  async function submitForm(event) {
    event.preventDefault();
    setLoadingTrue();
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    if (imageFile) {
      fd.append('image', imageFile);
    } else {
      fd.append('image', image);
    }
    fd.append('imageId', imageId);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', location);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', userId);
    fd.append('adminBool', admin);
    const url = `/api/campgrounds/${campgroundId}`;

    try {
      const {
        status,
        data: {
          campground: updatedCampground,
          message: putResponseMsg
        }
      } = await axios.put(url, fd, config);
      if (status === 200) {
        toast.success(putResponseMsg);
        push({
          pathname: `/campgrounds/${campgroundId}`,
          state: {
            campground: updatedCampground,
          }
        });
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
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="margin-top-50 marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">
          Edit Campground:
          <br />
          {nameRef.current}
        </h1>
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
              <textarea
                className="form-control inputTextBox"
                type="text"
                name="description"
                placeholder="Description"
                rows="5"
                onChange={handleChange}
                value={description}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleChange}
                value={location}
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
              <LoadingButton
                isLoading={loading}
                className="btn-block loading-button btn-orange btn-square"
                variant="primary"
                type="submit"
                size="lg"
              >
                Submit
              </LoadingButton>
            </div>
            <Button
              onClick={goBack}
              size="sm"
              variant="link"
              className="float-left text-primary text-primary-hover"
            >
              Go Back
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default EditCampground;
