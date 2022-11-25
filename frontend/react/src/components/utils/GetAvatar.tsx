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
  //const { user } = useAuthData();
  //const [show, setShow] = useState(false);
  //const [fallback, setFallback] = useState(false);


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

  /*
  if (user) {
    return (
      <div className="avatar">
        <ModalChangeAvatar />
      </div>
    );
  } else {
    return <div>Unknown</div>;
  }
   */
};

export default GetAvatar;
