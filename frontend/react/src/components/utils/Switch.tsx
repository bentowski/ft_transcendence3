import React, { Component } from "react";
import "../../styles/components/utils/modal.css";
import Request from "./Requests";
//import "../../styles/components/utils/switch.css";

class Switch extends Component {
  state = {
    label: "2fa",
    isTwoFA: 0,
    value: false,
    code: "",
    src: "",
  };

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
    console.log("TWOFA = ", user.isTwoFA);
    this.setState({ isTwoFA: user.isTwoFA });
    return user;
  };

  generateTwoFA = async () => {
    let response: any = await Request(
      "POST",
      {},
      {},
      "http://localhost:3000/auth/2fa/generate"
    );
    if (!response.ok) {
      return ;
    }
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

  activateTwoFA = async () => {
    if (!this.checkVal(this.state.code) && this.state.code.length !== 6) {
      console.log("wrong code format");
      return;
    }
    let rep = await Request(
      "POST",
      {},
      { twoFACode: this.state.code },
      "http://localhost:3000/auth/2fa/activate"
    );
    if (rep.ok) {
      this.setState({ value: true });
    } else {
      console.log("request 2fa activation error");
    }
    this.hidden();
  };

  deactivateTwoFA = async () => {
    await Request("POST", {}, {}, "http://localhost:3000/auth/2fa/deactivate");
  };

  prompt = () => {
    let modal = document.getElementById("ModalCode") as HTMLDivElement;
    modal.classList.remove("hidden");
  };

  handleToggle = (evt: any) => {
    this.setState({ isTwoFA: evt.target.checked });
    if (this.state.value) {
      this.setState({ value: false });
      return this.deactivateTwoFA();
    }
    if (!this.state.value) {
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

  componentDidMount = async () => {
    console.log("COMPONENT DID MOUNT ", this.state.value);
    let user = await this.requestTwoFA();
    if (user !== undefined && this.state.isTwoFA > 0) {
      this.setState({ value: true });
    }
    if (user !== undefined && this.state.isTwoFA === 0) {
      this.setState({ value: false });
    }
  };

  /*
  <ModalCode
  title={this.state.label}
  src={this.state.src}
  activate={this.state.activate}
  code={this.state.code}
  />
  */

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
              <button onClick={this.activateTwoFA} className="mx-1">
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
              checked={this.state.value}
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
