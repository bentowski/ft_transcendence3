import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap';
import IError from "../../interfaces/error-interface";

const ModalChangeUsername = ({
  show,
  parentCallBack,
}: {
  show: boolean;
  parentCallBack: (newState: boolean) => void;
}) => {
  const { user } = useAuthData();
  //const [show, setShow] = useState(false);
  const [field, setField] = useState("");
  const [err, setErr] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const getUsers = async () => {
    let users = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/"
    );
    return users;
  }

  const verifField = async () => {
    let users = await getUsers();
    var regex = /^[\w-]+$/
    var minmax = /^.{3,10}$/

    if (!regex.test(field)) {
      setErr("Non valid character")
      setTimeout(() => {
        setErr("")
      }, 1800)
      return false;
    }
    else if (!minmax.test(field)) {
      setErr("Username must contains between 3 and 10 characters")
      setTimeout(() => {
        setErr("")
      }, 1800)
      return false;
    }
    else if (users.findIndex((u: any) => u.username === field) > -1) {
      setErr("This username already exists")
      setTimeout(() => {
        setErr("")
      }, 1800)
      return false;
    }
    //user deja pris

    return true;
  };

  const navigate = useNavigate()

  const requestChangeUsername = async () => {
    //const login = document.getElementById("changeLogin") as HTMLInputElement;
    let res = await fetch("http://localhost:3000/user/update/username", {
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
      closeAlert();
      navigate(field)
    } else {
      const error: IError = await res.json();
      console.log(res);
      setAlert(true);
      setAlertMsg(error.message);
      console.log("wrong request");
    }
  }

  const handleChange = (evt: any) => {
    evt.preventDefault();
    setField(evt.target.value);
    closeAlert();
  };

  const cancelling = () => {
    closeAlert();
    setField("");
    handleClose();
  };

  const handleClose = () => parentCallBack(false);
  //const handleShow = () => changeShowing(true);

  // let form = document.querySelector("#usernameForm")

  // console.log(form.username)
  // form.username;

  const closeAlert = () => {
    console.log('closing alert');
    setAlert(false);
    setAlertMsg("");
  }

  return (
    <div className="changeusername">
      <Modal show={show} onHide={handleClose}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>Change Username</h2>
          </Modal.Header>
          <Modal.Body>
            <Form className="mb-3" id="usernameForm">
              <input
                type="text"
                placeholder="new username"
                maxLength={30}
                id="username"
                name="username"
                onChange={handleChange}
                value={field}
              />
              <div className="messError">{err}</div>
            </Form>
            <div>
              {alert ?
                <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                <div />
              }
            </div>
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
