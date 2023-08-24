import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    unwrapTextNodes,
    serializeDomToStr,
    wrapTextNodes,
    parseStrToDom,
} from "../../helpers/dom-helper.js";
import "../../helpers/iframeLoader.js";

const Editor = () => {
    const [pageList, setPageList] = useState([]);
    const [newPageName, setNewPageName] = useState("");
    const [currentPage, setCurrentPage] = useState("index.html");
    const iframeRef = useRef(null);
    const virtualDom = useRef(null);

    const loadPageList = () => {
        axios
            .get("./api")
            .then((data) => setPageList(data.data))
            .catch((error) => console.log("Error:", error));
    };

    const createNewPage = () => {
        axios
            .post("./api/createNewPage.php", { name: newPageName })
            .then(loadPageList)
            .catch(() => alert("Page already exists!"));
    };

    const deletePage = (page) => {
        axios
            .post("./api/deletePage.php", { name: page })
            .then(loadPageList)
            .catch(() => alert("Page does not exist!"));
    };

    const enableEditing = () => {
        iframeRef.current.contentDocument.body
            .querySelectorAll("text-editor")
            .forEach((el) => {
                el.contentEditable = "true";
                el.addEventListener("click", () => {
                    onTextEdit(el);
                });
            });
    };

    function open(page) {
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
            .then(() => iframeRef.current.load("../temp.html"))
            .then(() => enableEditing());
    }

    const onTextEdit = (el) => {
        const id = el.getAttribute("nodeid");
        if (virtualDom.current && virtualDom.current.body) {
            virtualDom.current.body.querySelector(
                `[nodeid="${id}"]`
            ).innerHTML = el.innerHTML;
        }
    };

    function save() {
        const newDom = virtualDom.current.cloneNode(virtualDom);
        unwrapTextNodes(newDom);
        const html = serializeDomToStr(newDom);
        axios.post("./api/savePage.php", { pageName: currentPage, html });
    }

    const init = (page) => {
        open(page);
        loadPageList();
    };

    useEffect(() => {
        init(currentPage);
    }, []);

    return (
        <>
            <button onClick={() => save()}>Click</button>
            <iframe src={currentPage} ref={iframeRef} frameBorder="0"></iframe>
        </>
    );
};

export default Editor;
