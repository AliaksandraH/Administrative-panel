import React from "react";
import axios from "axios";

const Panel = ({ modals, save }) => {
    const logout = () => {
        axios.get("./api/logout.php").then(() => {
            window.location.replace("/");
        });
    };

    const onChangeModals = (modal) => {
        modals({ [modal]: true });
    };

    return (
        <div className="panel">
            <button
                className="uk-button uk-button-default uk-margin-small-right"
                onClick={() => onChangeModals("meta")}
            >
                Edit META
            </button>
            <button
                className="uk-button uk-button-primary uk-margin-small-right"
                onClick={() => onChangeModals("choose")}
            >
                Open
            </button>
            <button
                className="uk-button uk-button-primary uk-margin-small-right"
                onClick={() => onChangeModals("backup")}
            >
                Restore
            </button>
            <button
                className="uk-button uk-button-primary uk-margin-small-right"
                onClick={() => save()}
            >
                Save
            </button>
            <button className="uk-button uk-button-danger" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Panel;
