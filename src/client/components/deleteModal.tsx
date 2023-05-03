import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


interface Props<T> {
  itemType: string;
  itemObj: T;
  handleDelete: (itemObj: T, loggedInAsAdminBool: boolean) => Promise<void>
  loggedInAsAdminBool: boolean;
  children: string;
}

function DeleteModal<T>({
  itemType, itemObj, handleDelete, loggedInAsAdminBool, children
}: Props<T>) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleConfirmDelete = () => {
    handleDelete(itemObj, loggedInAsAdminBool);
    setShow(false);
  };
  const handleCancelDelete = () => {
    setShow(false);
  };

  return (
    <>
      <Button
        size="sm"
        variant="danger"
        onClick={handleShow}
        className="btn-square"
      >
        {children}
      </Button>

      <Modal show={show} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>
            {children}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this
          {' '}
          {itemType}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;
