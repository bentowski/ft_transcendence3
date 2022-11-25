import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap';

const ModalChangeUsername = ({
  show,
  parentCallBack,
}: {
  show: boolean;
  parentCallBack: (newState: boolean) => void;
}) => {
  const { updateUser, setError } = useAuthData();
  const [field, setField] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [alert, setAlert] = useState(false);
  // const [alertMsg, setAlertMsg] = useState("");

  const getUsers = async () => {
    try {
      let users = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/"
      );
      return users;
    } catch (error) {
      setError(error);
      setField("");
    }
  }

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
    //console.log('callging parentcall back');
    parentCallBack(false);
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
    </div>
  );
};
export default ModalChangeUsername;
