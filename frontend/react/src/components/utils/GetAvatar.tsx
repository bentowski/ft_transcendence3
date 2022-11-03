import { useAuthData } from "../../contexts/AuthProviderContext";
import ModalChangeAvatar from "./ModalChangeAvatar";
import { useState } from "react";

const GetAvatar = ({
  className,
  width,
  height,
  alt,
}: {
  className: string;
  width: string;
  height: string;
  alt: string;
}) => {
  const { user } = useAuthData();
  const [show, setShow] = useState(false);

  const handleShow = (value: boolean) => setShow(value);
  console.log("user avatar url = ", user.avatar);

  if (user) {
    return (
      <div className="avatar">
        <a onClick={() => handleShow(true)}>
          <img
            className={className}
            width={width}
            height={height}
            src={"http://localhost:3000/user/" + user.auth_id + "/avatar/"}
            alt={alt}
            data-bs-toggle="modal"
            data-bs-target="#changeAvatar"
          />
        </a>
        <ModalChangeAvatar show={show} parentCallBack={handleShow} />
      </div>
    );
  } else {
    return <div>Unknown</div>;
  }
};

export default GetAvatar;
