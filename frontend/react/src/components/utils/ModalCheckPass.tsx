import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { ChanType } from '../../types';

const ModalCheckPass = (
  {chanToJoin, clef}:
  {chanToJoin: ChanType | undefined, clef: number}
  ) => {
  const [show, setShow] = useState(false)
  const [field, setField] = useState("");
  const [alert, setAlert] = useState(false);

  const handleShow = () => {
    // console.log("chan = ", chanToJoin)
    // let modal = document.getElementById("Modal") as HTMLDivElement;
    // modal.classList.add("hidden");
    setShow(true);
  }

  const handleClose = () => {
    setShow(false)
  }

  const cancelling = () => {
    setAlert(false);
    setField("");
    handleClose();
  };

  const handleChange = (evt: any) => {
    evt.preventDefault();
    setField(evt.target.value);
  };

  return (
    <div className="checkPassword" id={"checkPassword" + clef}>
      <Modal show={show}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>Checking Password</h2>
          </Modal.Header>
          <Modal.Body>
            <Form className="mb-3">
              <input
                type="text"
                placeholder="password"
                maxLength={30}
                id="password"
                name="password"
                onChange={handleChange}
                value={field}
              />
            </Form>
            {/* <div>
              {alert ?
                <Alert onClose={closeAlert} variant="danger" dismissible>{err}</Alert> :
                // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                <div />
              }
            </div> */}
          </Modal.Body>
          <Modal.Footer>
            <Button className="mx-1" onClick={cancelling}>
              Cancel
            </Button>
            <Button onClick={cancelling} className="mx-1">
              Validate
            </Button>
          </Modal.Footer>

        </div>
      </Modal>
      <button
          onClick={handleShow}
          // className="d-flex flex-row justify-content-start align-items-center"
          //data-bs-toggle="modal"
          //data-bs-target="#changeName"
      >
        JOIN
      </button>
    </div>
  );
}

export default ModalCheckPass;