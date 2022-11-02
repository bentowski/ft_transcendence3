import React, { Component, useEffect, useState } from "react";
import "../../styles/components/utils/modal.css";
import Request from "./Requests";
//import useCurrentUser from '../../hooks/useCurrentUser';
// import useTwoFa from "../../hooks/useTwoFa";
import { AuthContext, useAuthData } from "../../contexts/AuthProviderContext";
import { Modal, Button, Form } from "react-bootstrap";
//import {AuthContext, useAuthData} from "../../contexts/AuthProviderContext";
//import "../../styles/components/utils/switch.css";

const Switch = () => {
  const [label, setLabel] = useState("2fa");
  const [code, setCode] = useState("");
  const [src, setSrc] = useState("");
  const [show, setShow] = useState(false);
  const [tick, setTick] = useState(false);
  const { isTwoFa, isAuth, isToken, loading } = useAuthData();

  //console.log("IS IT TWO FA??", isTwoFa);

  useEffect(() => {
    if (isTwoFa) {
      setTick(true);
    }
  }, []);

  /*
  requestTwoFA = async () => {
    let user = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/current"
    );
    if (!user) {
      console.log("current user not found");
      return;
    }
    // console.log("TWOFA = ", user.isTwoFA);
    this.setState({ isTwoFA: user.isTwoFA });
    return user;
  };

   */

  const generateTwoFA = () => {
    //setSrc("");
    fetch("http://localhost:3000/auth/2fa/generate", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        console.log("sendsendsend");
        const blobURL = URL.createObjectURL(blob);
        setSrc(blobURL);
        const image = document.getElementById("myImg");
        if (!image) {
          return;
        }
        image.onload = function () {
          URL.revokeObjectURL(src);
        };
      })
      .catch((error) => {
        console.error(error);
      });

    /*
    const reader = await response.body.getReader();
    //var parentComponentInReadClientModal = this;
    let chunks: any = [];
    reader
      .read()
      .then(function processText({ done, value }: { done: any; value: any }) {
        //console.log(parentComponentInReadClientModal);
        if (done) {
          //console.log("stream finished, content received:");
          //console.log(chunks);
          const blob = new Blob([chunks as unknown as ArrayBuffer], {
            type: "image/png",
          });
          //console.log(blob);
          setSrc(URL.createObjectURL(blob));
          //parentComponentInReadClientModal.;
          return;
        }
        //console.log(`received ${chunks.length} chars so far!`);
        const tempArray = new Uint8Array(chunks.length + value.length);
        tempArray.set(chunks);
        tempArray.set(value, chunks.length);
        chunks = tempArray;
        return reader.read().then(processText);
      });

     */
    handleShow();
  };

  const checkVal = (value: string) => {
    for (let i = 0; i < value.length; i++) {
      if (value[i] < "0" || value[i] > "9") {
        return false;
      }
    }
    return true;
  };

  const activateTwoFa = async () => {
    //console.log('activating two fa...');
    if (!checkVal(code) && code.length !== 6) {
      //console.log("wrong code format");
      return;
    }
    //console.log("before fetch request");
    fetch("http://localhost:3000/auth/2fa/activate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        twoFACode: code,
      }),
    })
      .then((res) => {
        if (res.ok) {
          handleClose();
          handleTick();
          //console.log("yey");
          return;
        } else {
          console.log("nnoooo ");
          setCode("");
          return;
        }
      })
      .catch((error) => {
        //console.log("nnoooo ", error);
        handleClose();
        handleUnTick();
        return;
      });
  };

  const deactivateTwoFA = async () => {
    fetch("http://localhost:3000/auth/2fa/deactivate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (res.ok) {
          handleUnTick();
          //console.log("deactivated ok ");
          return;
        }
      })
      .catch((error) => {
        //console.log("failed deactivate ", error);
      });
  };

  const handleTick = () => setTick(true);
  const handleUnTick = () => setTick(false);

  const handleToggle = (evt: any) => {
    //this.setState({ isTwoFA: evt.target.checked });
    if (tick) {
      //console.log("deactivating twofa");
      return deactivateTwoFA();
    }
    if (!tick) {
      //console.log("generating twofa");
      return generateTwoFA();
    }
    //console.log("evt target = ", evt.target.checked);
  };

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
  };

  /*
  const hidden = () => {
    let modal = document.getElementById("ModalCode") as HTMLDivElement;
    modal.classList.add("hidden");
  };

    const prompt = () => {
    let modal = document.getElementById("ModalCode") as HTMLDivElement;
    modal.classList.remove("hidden");
  };

   */

  const handleChange = (evt: any) => {
    evt.preventDefault();
    setCode(evt.target.value);
  };

  const canceling = () => {
    setCode("");
    handleClose();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="activation">
      <Modal show={show} id="ModalCode" onHide={handleClose}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>{label}</h2>
            <img alt="qrcode" src={src} />
          </Modal.Header>
          <Modal.Body>
            <Form className="mb-3">
              <input
                type="text"
                placeholder="2fa activation code"
                maxLength={6}
                id="code"
                name="code"
                onChange={handleChange}
                value={code}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="mx-1" onClick={canceling}>
              Cancel
            </Button>

            <button onClick={activateTwoFa} className="mx-1">
              Validate
            </button>
          </Modal.Footer>
        </div>
      </Modal>

      <form onSubmit={handleSubmit}>
        <label>
          2fa
          <input type="checkbox" checked={tick} onChange={handleToggle} />
        </label>
      </form>
    </div>
  );
};

export default Switch;

//<div className="Modal hidden" id="ModalCode">
//         <div className="p-4 pb-1">
//           <header className="mb-3">
//             <h2>{label}</h2>
//             <img alt="qrcode" src={src} />
//           </header>
//           <form className="mb-3">
//             <input
//               type="text"
//               placeholder="2fa activation code"
//               maxLength={6}
//               id="code"
//               name="code"
//               onChange={handleChange}
//               value={code}
//             />
//           </form>
//           <footer>
//             <button className="mx-1" onClick={hidden}>
//               Cancel
//             </button>
//
//             <button onClick={activateTwoFa} className="mx-1">
//               Validate
//             </button>
//           </footer>
//         </div>
//       </div>
