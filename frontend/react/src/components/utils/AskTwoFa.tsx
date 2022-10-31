import React, {Component} from "react";
import Request from "./Requests";
import { AuthContext } from "../../contexts/AuthProviderContext";
import {Link} from "react-router-dom";

class AskTwoFa extends Component {

    static contextType = AuthContext

    state = {
        code: '',
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
                <AuthContext.Consumer>
                    {({ login }) => {
                        return (
                            <button onClick={login} className="mx-1">
                                Validate
                            </button>
                        );
                    }}
                </AuthContext.Consumer>

            </div>
        )
    }
}
export default AskTwoFa;