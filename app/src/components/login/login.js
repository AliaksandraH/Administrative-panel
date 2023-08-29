import React, { useState } from "react";

const Login = ({ login, lengthError, passwordError }) => {
    const [password, setPassword] = useState("");

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
                {lengthError && (
                    <span className="login-error">
                        Password must be longer than 5 characters!
                    </span>
                )}
                {passwordError && !lengthError ? (
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
