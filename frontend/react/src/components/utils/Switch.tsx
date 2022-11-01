import React, { Component } from "react";
import "../../styles/components/utils/modal.css";
import Request from "./Requests";
//import useCurrentUser from '../../hooks/useCurrentUser';
import useTwoFa from "../../hooks/useTwoFa";
import {AuthContext} from "../../contexts/AuthProviderContext";
//import {AuthContext, useAuthData} from "../../contexts/AuthProviderContext";
//import "../../styles/components/utils/switch.css";

class Switch extends Component {

  static contextType = AuthContext;

  /*
  constructor(props: any) {
    super(props);
  }

   */

  state = {
    label: "2fa",
    //isTwoFA: 0,
    //value: false,
    code: "",
    src: "",
  }



  /*
  requestTwoFA = () => {
    let user = useCurrentUser();
    if (!user) {
      console.log("current user not found");
      return;
    }
    // console.log("TWOFA = ", user.isTwoFA);
    this.setState({ isTwoFA: user.isTwoFA });
    return user;
  };

   */

  generateTwoFA = async () => {
    let response: any = await fetch( "http://localhost:3000/auth/2fa/generate", {
          credentials: "include",
          method: "POST",
      }
    );
    if (!response.ok) {
      //console.log('oulalala sa marche pas generate 2fa');
      return ;
    }
    /*
    var myBlob = new Blob(["stream"], { type: "image/png" });
    //console.log("blob - ", myBlob instanceof Blob);
    if (myBlob instanceof Blob) {
      return response;
    }
     */
    //if (!response.ok) {
     // return ;
    //}
    //this.setState({src: URL.createObjectURL(response)});
    const reader = await response.body.getReader();
    var parentComponentInReadClientModal = this;
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
          parentComponentInReadClientModal.setState({
            src: URL.createObjectURL(blob),
          });
          return;
        }
        //console.log(`received ${chunks.length} chars so far!`);
        const tempArray = new Uint8Array(chunks.length + value.length);
        tempArray.set(chunks);
        tempArray.set(value, chunks.length);
        chunks = tempArray;
        return reader.read().then(processText);
      });
    this.prompt();
  };

  checkVal = (value: string) => {
    for (let i = 0; i < value.length; i++) {
      if (value[i] < "0" || value[i] > "9") {
        return false;
      }
    }
    return true;
  };

  activateTwoFa = async () => {
    //console.log('activating two fa...');
    if (!this.checkVal(this.state.code) && this.state.code.length !== 6) {
      //console.log("wrong code format");
      return;
    }
      let rep = await Request(
          "POST",
          {},
          {twoFACode: this.state.code},
          "http://localhost:3000/auth/2fa/activate"
      );
      console.log('rep received = ', rep);
      if (rep.ok) {
        //this.setState({ value: true });
        this.hidden();
        //console.log('yey');
      } else {
        //console.log('nnoooo');
        //console.log("request 2fa activation error");
      }
  };

  deactivateTwoFA = async () => {
    await Request("POST", {}, {}, "http://localhost:3000/auth/2fa/deactivate");
  };

  prompt = () => {
    let modal = document.getElementById("ModalCode") as HTMLDivElement;
    modal.classList.remove("hidden");
  };

  handleToggle = (evt: any) => {
    //this.setState({ isTwoFA: evt.target.checked });
    if (this.getIsTwoFa() === 1) {
      //console.log('deactivating twofa');
      return this.deactivateTwoFA();
    }
    if (this.getIsTwoFa() === 0) {
      //console.log('generating twofa');
      return this.generateTwoFA();
    }
    //console.log("evt target = ", evt.target.checked);
  };

  handleSubmit = (evt: any) => {
    evt.preventDefault();
  };

  hidden = () => {
    let modal = document.getElementById("ModalCode") as HTMLDivElement;
    modal.classList.add("hidden");
  };

  handleChange = (evt: any) => {
    this.setState({ code: evt.target.value });
  };

  getUser = () => {
    const data: any = this.context;
    //console.log('data user contexxt = ', data);
    return data.user;
  }

  getIsTwoFa = () => {
    const user: any = this.getUser();
    return user.isTwoFA;
  }

  componentDidMount = () => {
    // console.log("COMPONENT DID MOUNT ", this.state.value);
    //let user = useCurrentUser();

    //let twoFa = useTwoFa();

  }
  /*
  <ModalCode
  title={this.state.label}
  src={this.state.src}
  activate={this.state.activate}
  code={this.state.code}
  />
  */

  //<AuthContext.Consumer>
  //                           {({ activateTwoFa }) => (
  //  )}
  //                         </AuthContext.Consumer>

  render() {
    //console.log("istwo fa = ", this.state.isTwoFA);
    //console.log("state value = ", this.state.value);
    return (
            <div className="activation">
              <div className="Modal hidden" id="ModalCode">
                <div className="p-4 pb-1">
                  <header className="mb-3">
                    <h2>{this.state.label}</h2>
                    <img alt="qrcode" src={this.state.src} />
                  </header>
                  <form className="mb-3">
                    <input
                      type="text"
                      placeholder="2fa activation code"
                      maxLength={6}
                      id="code"
                      name="code"
                      onChange={this.handleChange}
                      value={this.state.code}
                    />
                  </form>
                      <footer>
                        <button className="mx-1" onClick={this.hidden}>
                          Cancel
                        </button>

                            <button onClick={this.activateTwoFa} className="mx-1">
                              Validate
                            </button>

                      </footer>
                </div>
              </div>

              <form onSubmit={this.handleSubmit}>
                <label>
                  2fa
                  <input
                    type="checkbox"
                    checked={this.getIsTwoFa()}
                    onChange={this.handleToggle}
                  />
                </label>
              </form>
            </div>

    );
  }
}
/*
       {this.state.src && (
         <img alt="qrcode" src={this.state.src} width="100" height="100" />
       )}

 */
export default Switch;
