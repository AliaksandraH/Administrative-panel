import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    unwrapTextNodes,
    serializeDomToStr,
    wrapTextNodes,
    parseStrToDom,
    wrapImages,
    unwrapImages,
} from "../../helpers/dom-helper.js";
import "../../helpers/iframeLoader.js";
import EditorText from "../editorText/editorText.js";
import UIkit from "uikit";
import Spinner from "../spinner/spinner.js";
import ChooseModal from "../chooseModal/chooseModal.js";
import Panel from "../panel/panel.js";
import EditorMeta from "../editorMeta/editorMeta.js";
import EditorImages from "../editorImages/editorImages.js";

const Editor = () => {
    const [pageList, setPageList] = useState([]);
    const [backupsList, setBackupsList] = useState([]);
    const [currentPage, setCurrentPage] = useState("index.html");
    const [loading, setLoading] = useState(false);
    const [modalChoose, setModalChoose] = useState(false);
    const [modalBackup, setModalBackup] = useState(false);
    const [modalMeta, setModalMeta] = useState(false);
    const iframeRef = useRef(null);
    const virtualDom = useRef(null);

    const loadPageList = () => {
        axios
            .get("./api/pageList.php")
            .then((data) => setPageList(data.data))
            .catch((error) => console.log("Error:", error));
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
        [editableimgid]:hover {
            outline: 3px solid orange;
            outline-offset: 8px;
        }
        `;
        iframeRef.current.contentDocument.head.appendChild(style);
    };

    const showNotifications = (message, status) => {
        UIkit.notification({ message, status });
    };

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

        iframeRef.current.contentDocument.body
            .querySelectorAll("[editableimgid")
            .forEach((el) => {
                const id = el.getAttribute("editableimgid");
                const virtualElement = virtualDom.current.body.querySelector(
                    `[editableimgid="${id}"]`
                );
                new EditorImages(
                    el,
                    virtualElement,
                    setLoading,
                    showNotifications
                );
            });
    };

    const loadBackupsList = async (page = currentPage) => {
        const array = [];
        await axios.get("./backups/backups.json").then((data) =>
            array.push(
                data.data.filter((backup) => {
                    return backup.page === page;
                })
            )
        );
        setBackupsList(array[0]);
    };

    const restoreBackup = (backup) => {
        UIkit.modal
            .confirm(
                "Do you really want to restore the page from this backup? All unsaved data will be lost!",
                { labels: { ok: "Recover", cancel: "Cancel" } }
            )
            .then(() => {
                setLoading(true);
                return axios.post("./api/restoreBackup.php", {
                    page: currentPage,
                    file: backup,
                });
            })
            .then(() => {
                open(currentPage);
            });
    };

    const open = async (page) => {
        setCurrentPage(page);
        await axios
            .get(`../${page}?rnd=${Math.random}`)
            .then((data) => parseStrToDom(data.data))
            .then(wrapTextNodes)
            .then(wrapImages)
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
        loadBackupsList(page);
    };

    const save = async () => {
        setLoading(true);
        const newDom = virtualDom.current.cloneNode(virtualDom);
        unwrapTextNodes(newDom);
        unwrapImages(newDom);
        const html = serializeDomToStr(newDom);
        await axios
            .post("./api/savePage.php", { pageName: currentPage, html })
            .then(() => showNotifications("Changes saved!", "success"))
            .catch(() => showNotifications("Save error!", "danger"))
            .finally(() => setLoading(false));
        loadBackupsList();
    };

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
            <iframe src="" ref={iframeRef} frameBorder="0"></iframe>
            <input
                id="img-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
            ></input>
            <Spinner active={loading} />
            <Panel
                modalChoose={setModalChoose}
                modalBackup={setModalBackup}
                modalMeta={setModalMeta}
                save={save}
                showNotifications={showNotifications}
            />
            {modalChoose ? (
                <ChooseModal
                    data={pageList}
                    redirect={init}
                    close={setModalChoose}
                />
            ) : null}

            {modalBackup ? (
                <ChooseModal
                    data={backupsList}
                    redirect={restoreBackup}
                    close={setModalBackup}
                />
            ) : null}
            {modalMeta && virtualDom ? (
                <EditorMeta close={setModalMeta} virtualDom={virtualDom} />
            ) : null}
        </>
    );
};

export default Editor;
