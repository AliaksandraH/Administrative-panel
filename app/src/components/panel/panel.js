import React from "react";
import UIkit from "uikit";

const Panel = ({ modalChoose, modalBackup, save }) => {
    return (
        <div className="panel">
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
                onClick={() =>
                    save(
                        () => {
                            UIkit.notification({
                                message: "Changes saved!",
                                status: "success",
                            });
                        },
                        () => {
                            UIkit.notification({
                                message: "Save error!",
                                status: "danger",
                            });
                        }
                    )
                }
            >
                Save
            </button>
        </div>
    );
};

export default Panel;
