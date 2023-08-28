import React, { useEffect, useState } from "react";

const EditorMeta = ({ close, virtualDom }) => {
    const [meta, setMeta] = useState({
        title: "",
        keywords: "",
        description: "",
    });

    const onClose = (e) => {
        if (!e.target.closest(".modal-content")) {
            close(false);
        }
    };

    useEffect(() => {
        getMeta(virtualDom);
    }, []);

    const getMeta = (virtualDom) => {
        let title =
            virtualDom.current.head.querySelector("title") ||
            virtualDom.current.head.appendChild(
                virtualDom.current.createElement("title")
            );

        let keywords = virtualDom.current.head.querySelector(
            'meta[name="keywords"]'
        );
        if (!keywords) {
            keywords = virtualDom.current.head.appendChild(
                virtualDom.current.createElement("meta")
            );
            keywords.setAttribute("name", "keywords");
            keywords.setAttribute("content", "");
        }

        let description = virtualDom.current.head.querySelector(
            "meta[name='description']"
        );
        if (!description) {
            description = virtualDom.current.head.appendChild(
                virtualDom.current.createElement("meta")
            );
            description.setAttribute("name", "description");
            keywords.setAttribute("content", "");
        }

        setMeta({
            title: title.innerHTML,
            keywords: keywords.getAttribute("content"),
            description: description.getAttribute("content"),
        });
    };

    const applyMeta = () => {
        virtualDom.current.head.querySelector("title").innerHTML = meta.title;
        virtualDom.current.head
            .querySelector('meta[name="keywords"]')
            .setAttribute("content", meta.keywords);
        virtualDom.current.head
            .querySelector("meta[name='description']")
            .setAttribute("content", meta.description);
        close(false);
    };

    const onValueChange = (e) => {
        if (e.target.getAttribute("data-title")) {
            e.persist();
            setMeta((state) => {
                return { ...state, title: e.target.value };
            });
        } else if (e.target.getAttribute("data-key")) {
            e.persist();
            setMeta((state) => {
                return { ...state, keywords: e.target.value };
            });
        } else {
            e.persist();
            setMeta((state) => {
                return { ...state, description: e.target.value };
            });
        }
    };

    return (
        <div className="modal" onClick={(e) => onClose(e)}>
            <div className="modal-content">
                <h2 className="uk-modal-title">Edit Meta Tags</h2>

                <form>
                    <div className="uk-margin">
                        <input
                            data-title
                            className="uk-input"
                            type="text"
                            placeholder="Title"
                            value={meta.title}
                            onChange={(e) => onValueChange(e)}
                        />
                    </div>

                    <div className="uk-margin">
                        <textarea
                            data-key
                            className="uk-textarea"
                            rows="5"
                            placeholder="Keywords"
                            defaultValue={meta.keywords}
                            onChange={(e) => onValueChange(e)}
                        ></textarea>
                    </div>

                    <div className="uk-margin">
                        <textarea
                            data-descr
                            className="uk-textarea"
                            rows="5"
                            placeholder="Description"
                            defaultValue={meta.description}
                            onChange={(e) => onValueChange(e)}
                        ></textarea>
                    </div>
                </form>
                <p>
                    Don't forget to save your changes, click on the "Save"
                    button
                </p>

                <p className="uk-text-right">
                    <button
                        className="uk-button uk-button-default uk-margin-small-right uk-modal-close uk-modal-close"
                        type="button"
                        onClick={() => close(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="uk-button uk-button-primary uk-modal-close"
                        type="button"
                        onClick={applyMeta}
                    >
                        Apply
                    </button>
                </p>
            </div>
        </div>
    );
};

export default EditorMeta;
