import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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

    function unwrapTextNodes(dom) {
        dom.body.querySelectorAll("text-editor").forEach((element) => {
            element.parentNode.replaceChild(element.firstChild, element);
        });
    }

    function serializeDomToStr(dom) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    function save() {
        const newDom = virtualDom.current.cloneNode(virtualDom);
        unwrapTextNodes(newDom);
        const html = serializeDomToStr(newDom);
        axios.post("./api/savePage.php", { pageName: currentPage, html });
    }

    const parseStrToDom = (str) => {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    };

    const wrapTextNodes = (dom) => {
        const body = dom.body;
        const textNode = [];
        const recursy = (element) => {
            element.childNodes.forEach((node) => {
                if (
                    node.nodeName === "#text" &&
                    node.nodeValue.replace(/\s+/g, "").length > 0
                ) {
                    textNode.push(node);
                } else {
                    recursy(node);
                }
            });
        };
        recursy(body);

        textNode.forEach((node, i) => {
            const wrapper = dom.createElement("text-editor");
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute("nodeid", i);
        });

        return dom;
    };

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
