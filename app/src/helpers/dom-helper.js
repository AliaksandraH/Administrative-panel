export const unwrapTextNodes = (dom) => {
    dom.body.querySelectorAll("text-editor").forEach((element) => {
        element.parentNode.replaceChild(element.firstChild, element);
    });
};

export const serializeDomToStr = (dom) => {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
};

export const wrapTextNodes = (dom) => {
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

export const parseStrToDom = (str) => {
    const parser = new DOMParser();
    return parser.parseFromString(str, "text/html");
};
