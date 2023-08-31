import React, { useState } from "react";
import axios from "axios";

const Login = ({ auth }) => {
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);
    const [loginLengthError, setLoginLengthError] = useState(false);

    const login = (pass) => {
        if (pass.length > 5) {
            axios.post("./api/login.php", { password: pass }).then((res) => {
                auth(res.data.auth);
                setLoginError(!res.data.auth);
                setLoginLengthError(false);
            });
        } else {
            setLoginError(false);
            setLoginLengthError(true);
        }
    };

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="login-container">
            <div className="login">
                <h2 className="uk-modal-title uk-text-center">Authorization</h2>
                <div className="uk-margin-top uk-text-lead">Password:</div>
                <input
                    type="password"
                    name=""
                    id=""
                    value={password}
                    onChange={(e) => {
                        onPasswordChange(e);
                    }}
                    className="uk-input uk-margin-top"
                    placeholder="Password"
                />
                {loginLengthError && (
                    <span className="login-error">
                        Password must be longer than 5 characters!
                    </span>
                )}
                {loginError && !loginLengthError ? (
                    <span className="login-error">Wrong password entered!</span>
                ) : null}
                <p className="uk-text-right">
                    <button
                        type="button"
                        className="uk-button uk-button-primary uk-margin-top"
                        onClick={() => {
                            login(password);
                        }}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
