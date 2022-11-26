import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap';

const ModalChangeUsername = () => {
  const { user, updateUser, setError } = useAuthData();
  const [field, setField] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [alert, setAlert] = useState(false);
  const [show, setShow] = useState(false)
  const [username, setUsername] = useState('');
  // const [alertMsg, setAlertMsg] = useState("");

  const getUsers = async () => {
    // try {
      let users = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/"
      );
      return users;
    // }
  }

  useEffect(() => {
    if (user) {
      setUsername(user.username)
    }
  }, [user])

  // const requestChangeUsername = async () => {
  //   try {
  //     let res = await Request(
  //         "PATCH",
  //         {
  //           "Content-Type": "application/json",
  //         },
  //         { username: field },
  //         "http://localhost:3000/user/update/username"
  //     )
  //     if (res) {
  //       const newName = field;
  //       updateUser(null, field);
  //       setField("");
  //       handleClose();
  //       navigate("/profil/" + newName);
  //     }
  //   } catch (error) {
  //     setError(error);
  //     setField("");
  //   }
  // }

  const verifField = async () => {
    let users = await getUsers();
    var regex = /^[\w-]+$/
    var minmax = /^.{3,10}$/

    if (!regex.test(field)) {
      setErr("Non valid character")
      setAlert(true);
      // setTimeout(() => {
      //   setErr("")
      // }, 1800)
      return false;
    }
    else if (!minmax.test(field)) {
      setErr("Username must contains between 3 and 10 characters")
      setAlert(true);
      // setTimeout(() => {
      //   setErr("")
      // }, 1800)
      return false;
    }
    else if (users.findIndex((u: any) => u.username === field) > -1) {
      setErr("This username already exists")
      setAlert(true);
      // setTimeout(() => {
      //   setErr("")
      // }, 1800)
      return false;
    }
    return true;
  }

  const requestChangeUsername = async () => {
    let ret = await verifField();
    if (ret) {
      try {
        let res = await Request(
            "PATCH",
            {
              "Content-Type": "application/json",
            },
            { username: field },
            "http://localhost:3000/user/update/username"
        )
        //console.log('result = ', res);
        if (res) {
          const newName = field;
          updateUser(null, field);
          setField("");
          handleClose();
          navigate("/profil/" + newName);
        }
      } catch (error) {
        setError(error);
        setField("");
      }
    }
  };

  const handleChange = (evt: any) => {
    evt.preventDefault();
    setField(evt.target.value);
  };

  const cancelling = () => {
    setAlert(false);
    setErr("");
    setField("");
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    console.log('pouet');
    setShow(true);
  }
  const closeAlert = () => {
    // console.log('closing alert');
    setAlert(false);
    setErr("");
    // setAlertMsg("");
  }


  return (
    <div className="changeusername">
      <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
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
            <div>
              {alert ?
                <Alert onClose={closeAlert} variant="danger" dismissible>{err}</Alert> :
                // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
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
      <a
          onClick={handleShow}
          className="d-flex flex-row justify-content-start align-items-center"
          //data-bs-toggle="modal"
          //data-bs-target="#changeName"
      >
        <h3>{username}</h3>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-fill mx-2"
            viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </a>
    </div>
  );
};
export default ModalChangeUsername;
