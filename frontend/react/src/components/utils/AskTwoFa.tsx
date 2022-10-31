import React, {Component} from "react";
import Request from "./Requests";
import { AuthContext } from "../../contexts/AuthProviderContext";
import {Link} from "react-router-dom";

class AskTwoFa extends Component {

    static contextType = AuthContext

    state = {
        code: '',
    }

    validateTwoFa =  async () => {
        console.log('code = ', this.state.code);
        try {
            //if (isTwoFa) {
                const body: any = JSON.stringify({twoFaCode: this.state.code})
                const requestHeaders: any = new Headers();
                requestHeaders.set('Content-Type', 'application/json')
                let res: any = await Request(
                    "POST",
                    { requestHeaders },
                    { body },
                    "http://localhost:3000/auth/2fa/authenticate"
                )
                if (res.ok) {
                    console.log('2fa auth ok');
                    return;
                }
            //} else {
             //   setIsAuth(true)
               // return;
            //}
        } catch (error) {
            if (typeof error === 'object' && error !== null) {
                console.log('oulala -', error);
                return ;
            } else {
                console.log('unexpected error ', error);
            }
        }
    }

    handleChange = (evt: any) => {
        this.setState({ code: evt.target.value });
    };

    render() {
        return (
            <div>
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

                            <button onClick={this.validateTwoFa} className="mx-1">
                                Validate
                            </button>


            </div>
        )
    }
}
export default AskTwoFa;
            //   <AuthContext.Consumer>
//                     {({ login }) => {
            // }}
                    // </AuthContext.Consumer>