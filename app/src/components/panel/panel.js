import React from "react";

const Panel = ({ modalChoose, modalBackup, modalMeta, save }) => {
    return (
        <div className="panel">
            <button
                className="uk-button uk-button-default uk-margin-small-right"
                onClick={() => modalMeta(true)}
            >
                Edit META
            </button>
            <button
                className="uk-button uk-button-primary uk-margin-small-right"
                onClick={() => modalChoose(true)}
            >
                Open
            </button>
            <button
                className="uk-button uk-button-primary uk-margin-small-right"
                onClick={() => modalBackup(true)}
            >
                Restore
            </button>
            <button
                className="uk-button uk-button-primary"
                onClick={() => save()}
            >
                Save
            </button>
        </div>
    );
};

export default Panel;
