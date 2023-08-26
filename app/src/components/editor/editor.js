import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    unwrapTextNodes,
    serializeDomToStr,
    wrapTextNodes,
    parseStrToDom,
} from "../../helpers/dom-helper.js";
import "../../helpers/iframeLoader.js";
import EditorText from "../editorText/editorText.js";
import UIkit from "uikit";
import Spinner from "../spinner/spinner.js";
import ChooseModal from "../chooseModal/chooseModal.js";

const Editor = () => {
    const [pageList, setPageList] = useState([]);
    const [newPageName, setNewPageName] = useState("");
    const [currentPage, setCurrentPage] = useState("index.html");
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const iframeRef = useRef(null);
    const virtualDom = useRef(null);

    const loadPageList = () => {
        axios
            .get("./api/pageList.php")
            .then((data) => setPageList(data.data))
            .catch((error) => console.log("Error:", error));
    };

    // const createNewPage = () => {
    //     axios
    //         .post("./api/createNewPage.php", { name: newPageName })
    //         .then(loadPageList)
    //         .catch(() => alert("Page already exists!"));
    // };

    // const deletePage = (page) => {
    //     axios
    //         .post("./api/deletePage.php", { name: page })
    //         .then(loadPageList)
    //         .catch(() => alert("Page does not exist!"));
    // };

    const enableEditing = () => {
        iframeRef.current.contentDocument.body
            .querySelectorAll("text-editor")
            .forEach((el) => {
                const id = el.getAttribute("nodeid");
                const virtualElement = virtualDom.current.body.querySelector(
                    `[nodeid="${id}"]`
                );
                new EditorText(el, virtualElement);
            });
    };

    const injectStyles = () => {
        const style = iframeRef.current.contentDocument.createElement("style");
        style.innerHTML = `
        text-editor:hover {
            outline: 3px solid orange;
            outline-offset: 8px;
        }
        text-editor:focus {
            outline: 3px solid red;
            outline-offset: 8px;
        }
        `;
        iframeRef.current.contentDocument.head.appendChild(style);
    };

    const open = (page) => {
        setCurrentPage(page);
        axios
            .get(`../${page}?rnd=${Math.random}`)
            .then((data) => parseStrToDom(data.data))
            .then(wrapTextNodes)
            .then((dom) => {
                virtualDom.current = dom;
                return dom;
            })
            .then(serializeDomToStr)
            .then((html) => axios.post("./api/saveTempPage.php", { html }))
            .then(() =>
                iframeRef.current.load("../dsdhgddbsdhgasydhsbdjhag.html")
            )
            .then(() =>
                axios.post("./api/deleteTempPage.php", {
                    name: "dsdhgddbsdhgasydhsbdjhag.html",
                })
            )
            .then(() => enableEditing())
            .then(() => injectStyles())
            .then(() => setLoading(false));
    };

    function save(onSuccess, onError) {
        setLoading(true);
        const newDom = virtualDom.current.cloneNode(virtualDom);
        unwrapTextNodes(newDom);
        const html = serializeDomToStr(newDom);
        axios
            .post("./api/savePage.php", { pageName: currentPage, html })
            .then(onSuccess)
            .catch(onError)
            .finally(() => setLoading(false));
    }

    const init = (page) => {
        setLoading(true);
        open(page);
    };

    useEffect(() => {
        init(currentPage);
        loadPageList();
    }, []);

    return (
        <>
            <iframe src={currentPage} ref={iframeRef} frameBorder="0"></iframe>
            <Spinner active={loading} />
            <div className="panel">
                <button
                    className="uk-button uk-button-primary uk-margin-small-right"
                    onClick={() => setModal(true)}
                >
                    Open
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
            {modal ? (
                <ChooseModal
                    target={"modal-choose"}
                    data={pageList}
                    redirect={init}
                    close={setModal}
                />
            ) : null}
        </>
    );
};

export default Editor;
