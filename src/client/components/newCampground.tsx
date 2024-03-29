import React, { useEffect, useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios, { CancelTokenSource, AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';
import { ILoggedInAsContext } from '../interfaces';


function NewCampground() {
  const { push } = useHistory();
  const {
    loggedInAs: {
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;

  const initBtnMessage = 'Select Campground Image (Required)';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);

  const initData = {
    name: '',
    description: '',
    price: '',
  };
  const { values, handleChange } = useForm(initData);
  const {
    price, name, description
  } = values;

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  useEffect(() => {
    if (!localStorage.userId) {
      push('/login');
    }
  }, [push]);

  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setLoadingTrue();
    cancelTokenRef.current = axios.CancelToken.source() 
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      cancelToken: cancelTokenRef.current.token
    };
    if (imageFile) {
      fd.append('image', imageFile);
    }
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', name);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', loggedInAsId);
    const url = '/api/campgrounds';

    try {
      const {
        status,
        data: {
          message,
          id
        }
      } = await axios.post(url, fd, config);
      
      if (status === 201) {
        toast.success(message);
        toast.warning('Check that map displays correct location (if not click "Edit" to modify).', {delay: 4000, autoClose: 7000});
        toast('Be sure to rate/review your campground! 👇', {delay: 10000});
        push(`/campgrounds/${id}`);
      } else {
        const error = new Error();
        throw error;
      }
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        if (err.response && err.response.data) {
          const { response: { data: message } } = err;
          toast.error(`${message}`);
        }
      }
    } finally {
      setLoadingFalse();
    }
  }

  useEffect(() => {
    const customFileUpload = document.getElementById('custom-file-upload');
    const fileUpload = document.getElementById('file-upload');
    customFileUpload?.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        fileUpload?.click();
      }
    })
  }, []);

  return (
    <div className="margin-top-50 marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">Create a New <br className="brnodisplay-md" />Campground</h1>
        <br />
        <form onSubmit={submitForm}>
          <div className="entryBox centered flex flex-dir-col">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={name}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control inputTextBox"
                name="description"
                placeholder="Description"
                rows={5}
                onChange={handleChange}
                value={description}
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
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label
                id="custom-file-upload"
                htmlFor="file-upload"
                className="btn btn-outline-primary btn-block"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
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
              >
                Submit
              </LoadingButton>
            </div>
            <Link to="/campgroundsHome">
              <Button
                size="sm"
                variant="link"
                className="float-left go-back-btn"
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
