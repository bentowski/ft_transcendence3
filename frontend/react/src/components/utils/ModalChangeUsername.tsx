import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";

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

  const requestChangeUsername = () => {
    //const login = document.getElementById("changeLogin") as HTMLInputElement;
    fetch("http://localhost:3000/user/update/username", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: field }),
    }).then((res) => {
      if (res.ok) {
        setField("");
        handleClose();
      } else {
        console.log("wrong request");
      }
    });
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
