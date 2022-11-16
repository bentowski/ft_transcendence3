import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import {useEffect, useState} from "react";
import ImageUploading from "react-images-uploading";
import IError from "../../interfaces/error-interface";
import {HandleError} from "./HandleError";
import {useErrorContext} from "../../contexts/ErrorProviderContext";

const ModalChangeAvatar = ({
  show,
  parentCallBack,
}: {
  show: boolean;
  parentCallBack: (newState: boolean) => void;
}) => {
  const { updateUser, user } = useAuthData();
  const { setError } = useErrorContext();
  //const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  //const [avatar, setAvatar] = useState(null);

  /*
  useEffect(() => {
    setAvatar(user.avatar);
  }, [user])
   */

  const requestChangeAvatar = async () => {
    const formData = new FormData();
    if (!selectedImage) {
      return;
    }
    formData.append("picture", selectedImage);
    const params: any = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    };
    delete params.headers["Content-Type"];
    let res = await fetch("http://localhost:3000/user/upload", params)
    if (res.ok) {
      //console.log("upload success!");
      const str = await res.json();
      //const avatar: string = "http://localhost:3000/user/" + user.auth_id + "/avatar/" + Date.now();
      //console.log('str = ', avatar);
      updateUser(str.avatar, null);
      setSelectedImage(null);
      handleClose();
    } else {
      setSelectedImage(null);
      const err: any = await res.json();
      setError(err);
      //HandleError(err);
      //console.log("upload failed!");
    }
  };

  const cancelling = () => {
    setSelectedImage(null);
    handleClose();
  };

  const handleImage = (evt: any) => {
    if (evt.target) {
      //console.log(evt.target.files[0]);
      setSelectedImage(evt.target.files[0]);
    }
  };

  const handleClose = () => parentCallBack(false);
  //const handleShow = () => changeShowing(true);

  return (
    <div className="changeavatar">
      <Modal show={show} id="" onHide={handleClose}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>Change Avatar</h2>
          </Modal.Header>
          <Modal.Body>
            {selectedImage && (
              <div>
                <img
                  alt="not fount"
                  width={"250px"}
                  src={URL.createObjectURL(selectedImage)}
                />
                <br />
                <Button onClick={() => setSelectedImage(null)}>Remove</Button>
              </div>
            )}
            <Form className="mb-3">
              <input
                type="file"
                maxLength={30}
                id="username"
                name="avatar"
                onChange={handleImage}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="mx-1" onClick={cancelling}>
              Cancel
            </Button>
            <Button onClick={requestChangeAvatar} className="mx-1">
              Validate
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};
export default ModalChangeAvatar;
