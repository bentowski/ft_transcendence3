import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthData } from "../../contexts/AuthProviderContext";
import "../../styles/components/utils/modal.css";
// import IError from "../../interfaces/error-interface";

const Switch = () => {
  const [label, setLabel] = useState("2fa");
  const [code, setCode] = useState("");
  const [src, setSrc] = useState("");
  const [show, setShow] = useState(false);
  const [tick, setTick] = useState(false);
  const { isTwoFa } = useAuthData();

  useEffect(() => {
    if (isTwoFa) {
      setTick(true);
    }
  }, [isTwoFa]);

  const generateTwoFA = async () => {
    console.log('calling generating avatar');
    let res = await fetch("http://localhost:3000/auth/2fa/generate", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (res.ok) {
      const myblobi = await res.blob();
      //console.log(myblobi);
      const blobURL = URL.createObjectURL(myblobi);
      setSrc(blobURL);
      /*
      const image = document.getElementById("myImg");
      if (!image) {
        return;
      }
      image.onload = function () {
        URL.revokeObjectURL(src);
      };
       */
      handleShow();
    }
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
    let res = await fetch("http://localhost:3000/auth/2fa/activate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        twoFACode: code,
      }),
    })
    if (res.ok) {
       handleClose();
       handleTick();
       //console.log("yey");
       return;
    } else {
       //console.log("nnoooo ");
       // const errmsg: any = await res.json();
       setCode("");
       return;
    }
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

  const handleToggle = () => {
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

  const handleChange = (evt: any) => {
    evt.preventDefault();
    setCode(evt.target.value);
  };

  const cancelling = () => {
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
            <Button className="mx-1" onClick={cancelling}>
              Cancel
            </Button>
            <Button onClick={activateTwoFa} className="mx-1">
              Validate
            </Button>
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
