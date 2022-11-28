import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { ChanType } from '../../types';

const ModalCheckPass = (
  {chanToJoin, clef, parentCallBack}:
  {chanToJoin: ChanType | undefined, clef: number, parentCallBack?: any }
  ) => {
  const [show, setShow] = useState(false)
  const [field, setField] = useState("");
  const [alert, setAlert] = useState(false);

  const handleShow = () => {
    console.log("chan[x].name = ", chanToJoin?.password)
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

  const closeAlert = () => {
    // console.log('closing alert');
    setAlert(false);
    // setAlertMsg("");
  }

  const handlePassword = (evt: any) => {
    evt.preventDefault();
    setField(evt.target.value);
  };

  const checkPassword = () => {
    if (field === chanToJoin?.password) {
      parentCallBack.joinRoom(chanToJoin)
    }
    else {
      setAlert(true);
    }
  }

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
                onChange={handlePassword}
                value={field}
              />
            </Form>
            <div>
              {alert ?
                <Alert onClose={closeAlert} variant="danger" dismissible>{"The password is not valid"}</Alert> :
                // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                <div />
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="mx-1" onClick={cancelling}>
              Cancel
            </Button>
            <Button onClick={checkPassword} className="mx-1">
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