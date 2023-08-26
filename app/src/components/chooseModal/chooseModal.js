import React from "react";

const ChooseModal = ({ target, data, redirect, close }) => {
    const pageList = data.map((item) => {
        return (
            <li key={item}>
                <a
                    className="uk-link-muted uk-modal-close"
                    href="#"
                    onClick={() => redirect(item)}
                >
                    {item}
                </a>
            </li>
        );
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
                <ul className="uk-list uk-list-divider">{pageList}</ul>
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
