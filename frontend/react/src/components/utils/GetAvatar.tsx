import { useAuthData } from "../../contexts/AuthProviderContext";
import ModalChangeAvatar from "./ModalChangeAvatar";
import {useEffect, useState} from "react";

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
  //const [fallback, setFallback] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState({url:"", hash: 0});

  const handleShow = (value: boolean) => setShow(value);
  //console.log("user avatar url = ", user.avatar);

  useEffect(() => {
    if (user.avatar) {
      setAvatarUrl({ url: "http://localhost:3000/user/" + user.auth_id + "/avatar", hash: Date.now()});
    }
  }, [user])

  /*
  const reloadSrc = (evt: any) => {
    if (fallback) {
      evt.target.src = '/img/blank'
    } else {
      evt.target.src = avatarUrl;
      setFallback(true);
    }
  }
   */

  if (user) {
    return (
      <div className="avatar">
        <a onClick={() => handleShow(true)}>
          <img
            className={className}
            width={width}
            height={height}
            src={`${avatarUrl.url}?${avatarUrl.hash}`}
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
