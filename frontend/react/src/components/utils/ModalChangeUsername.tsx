import Request from "./Requests";
//import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
//import { useNavigate } from 'react-router-dom'
import { HandleError } from "./HandleError";
import {useErrorContext} from "../../contexts/ErrorProviderContext";
//import IError from "../../interfaces/error-interface";

const ModalChangeUsername = ({
  show,
  parentCallBack,
}: {
  show: boolean;
  parentCallBack: (newState: boolean) => void;
}) => {
  //const { user } = useAuthData();
  //const [show, setShow] = useState(false);
  const [field, setField] = useState("");
  const { setError } = useErrorContext();
  //const navigate = useNavigate()

  const requestChangeUsername = async () => {
    //const login = document.getElementById("changeLogin") as HTMLInputElement;
      /* let res = await fetch("http://localhost:3000/user/update/username", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: field }),
      })
       if (res.ok) {
        setField("");
        handleClose();
        window.location.reload();
      } else {
        console.log("wrong request");
        const err: any = await res.json();
        console.log('err = ', err);
        throw new Error(err);
      }

       */
    console.log('field - ', field);
    try {
      let res = await Request(
          "PATCH",
          {
            "Content-Type": "application/json",
          },
          { username: field },
          "http://localhost:3000/user/update/username"
      )
      if (res) {
        setField("");
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      //console.log('error catched!');
      setError(error);
      setField("");
    }
  };

  const handleChange = (evt: any) => {
    evt.preventDefault();
    setField(evt.target.value);
  };

  const cancelling = () => {
    setField("");
    handleClose();
  };

  const handleClose = () => parentCallBack(false);
  //const handleShow = () => changeShowing(true);

    return (
        <div className="changeusername">
          <Modal show={show} onHide={handleClose}>
            <div className="p-4 pb-1">
              <Modal.Header className="mb-3">
                <h2>Change Username</h2>
              </Modal.Header>
              <Modal.Body>
                <Form className="mb-3">
                  <input
                      type="text"
                      placeholder="new username"
                      maxLength={30}
                      id="username"
                      name="username"
                      onChange={handleChange}
                      value={field}
                  />
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button className="mx-1" onClick={cancelling}>
                  Cancel
                </Button>
                <Button onClick={requestChangeUsername} className="mx-1">
                  Validate
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
        </div>
    );
};
export default ModalChangeUsername;
