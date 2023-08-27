import React from "react";

const ChooseModal = ({ target, data, redirect, close }) => {
    const list = data.map((item) => {
        if (item.time) {
            return (
                <li key={item.file}>
                    <a
                        className="uk-link-muted"
                        href="#"
                        onClick={() => {
                            close(false);
                            redirect(item.file);
                        }}
                    >
                        Backup from: {item.time}
                    </a>
                </li>
            );
        } else {
            return (
                <li key={item}>
                    <a
                        className="uk-link-muted"
                        href="#"
                        onClick={() => {
                            close(false);
                            redirect(item);
                        }}
                    >
                        {item}
                    </a>
                </li>
            );
        }
    });

    const onClose = (e) => {
        if (!e.target.closest(".modal-content")) {
            close(false);
        }
    };

    return (
        <div className="modal" onClick={(e) => onClose(e)}>
            <div className="modal-content">
                <h2 className="uk-modal-title">Select a page</h2>
                {data.length < 1 && <p>Data not found</p>}
                <ul className="uk-list uk-list-divider">{list}</ul>
                <p className="uk-text-right">
                    <button
                        className="uk-button uk-button-default uk-modal-close"
                        onClick={() => close(false)}
                    >
                        Cancel
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ChooseModal;
