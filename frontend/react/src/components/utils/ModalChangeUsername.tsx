import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const ModalChangeUsername = ({
  show,
  parentCallBack,
}: {
  show: boolean;
  parentCallBack: (newState: boolean) => void;
}) => {
  const { updateUser, setError } = useAuthData();
  const [field, setField] = useState("");
  const navigate = useNavigate()

  const requestChangeUsername = async () => {
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
  };

  const handleChange = (evt: any) => {
    evt.preventDefault();
    setField(evt.target.value);
  };

  const cancelling = () => {
    setField("");
    handleClose();
  };

  const handleClose = () => {
    //console.log('callging parentcall back');
    parentCallBack(false);
  }

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
