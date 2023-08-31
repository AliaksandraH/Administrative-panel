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
import UIkit from "uikit";
import Spinner from "../spinner/spinner.js";
import Modals from "../modals/modals.js";
import Panel from "../panel/panel.js";
import EditorText from "../editorText/editorText.js";
import EditorImages from "../editorImages/editorImages.js";
import Login from "../login/login.js";

const Editor = () => {
    const [currentPage, setCurrentPage] = useState("index.html");
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageList, setPageList] = useState([]);
    const [backupsList, setBackupsList] = useState([]);
    const [modals, setModals] = useState({});
    const [virtualElementPhoto, setVirtualElementPhoto] = useState(null);
    const [photo, setPhoto] = useState(null);
    const iframeRef = useRef(null);
    const virtualDom = useRef(null);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        init(currentPage);
    }, [auth]);

    const init = (page) => {
        if (auth) {
            setLoading(true);
            open(page);
            loadPageList();
        }
    };

    const checkAuth = () => {
        axios.get("./api/checkAuth.php").then((res) => {
            setAuth(res.data.auth);
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

    const loadPageList = () => {
        axios
            .get("./api/pageList.php")
            .then((data) => setPageList(data.data))
            .catch((error) => console.log("Error:", error));
    };

    const save = async () => {
        setLoading(true);
        const newDom = virtualDom.current.cloneNode(virtualDom);
        unwrapTextNodes(newDom);
        unwrapImages(newDom);
        const html = serializeDomToStr(newDom);
        await axios
            .post("./api/savePage.php", { pageName: currentPage, html })
            .then(() =>
                showNotifications(
                    "Changes saved, a backup copy of the page was made before the change!",
                    "success"
                )
            )
            .catch(() => showNotifications("Save error!", "danger"))
            .finally(() => setLoading(false));
        loadBackupsList();
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

    const enableEditing = () => {
        iframeRef.current.contentDocument.body
            .querySelectorAll("text-editor")
            .forEach((element) => {
                const id = element.getAttribute("nodeid");
                const virtualElement = virtualDom.current.body.querySelector(
                    `[nodeid="${id}"]`
                );
                new EditorText(element, virtualElement);
            });

        iframeRef.current.contentDocument.body
            .querySelectorAll("[editableimgid]")
            .forEach((element) => {
                const id = element.getAttribute("editableimgid");
                const virtualElement = virtualDom.current.body.querySelector(
                    `[editableimgid="${id}"]`
                );
                new EditorImages(
                    element,
                    virtualElement,
                    setPhoto,
                    setVirtualElementPhoto
                );
            });
    };

    const changePhoto = (e) => {
        const imgUploader = e.target;
        if (imgUploader.files && imgUploader.files[0]) {
            let formData = new FormData();
            formData.append("image", imgUploader.files[0]);
            setLoading(true);
            axios
                .post("./api/uploadImage.php", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    virtualElementPhoto.src =
                        photo.src = `./img/${res.data.src}`;
                })
                .catch(() => showNotifications("Save error!", "danger"))
                .finally(() => {
                    imgUploader.value = "";
                    setLoading(false);
                });
        }
        setPhoto(null);
        setVirtualElementPhoto(null);
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

    const showNotifications = (message, status) => {
        UIkit.notification({ message, status });
    };

    return (
        <>
            {!auth && <Login auth={setAuth} />}
            {auth && <Panel modals={setModals} save={save} />}
            <iframe src="" ref={iframeRef} frameBorder="0"></iframe>
            <input
                id="img-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => changePhoto(e)}
            ></input>
            <Spinner active={loading} />
            <Modals
                modals={modals}
                setModals={setModals}
                pageList={pageList}
                init={init}
                backupsList={backupsList}
                restoreBackup={restoreBackup}
                virtualDom={virtualDom}
            />
        </>
    );
};

export default Editor;
