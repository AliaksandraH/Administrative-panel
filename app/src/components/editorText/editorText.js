export default class EditorText {
    constructor(element, virtualElemrnt) {
        this.element = element;
        this.virtualElemrnt = virtualElemrnt;

        this.element.addEventListener("click", () => {
            this.onClick();
        });
        this.element.addEventListener("blur", () => {
            this.onBlur();
        });
        this.element.addEventListener("keypress", (e) => {
            this.onKeypress(e);
        });
        this.element.addEventListener("input", (e) => {
            this.onTextEdit(e);
        });
        if (
            this.element.parentNode.nodeName === "A" ||
            this.element.parentNode.nodeName === "BUTTON"
        ) {
            this.element.addEventListener("contextmenu", (e) => {
                this.onCtxMenu(e);
            });
        }
    }

    onClick() {
        this.element.contentEditable = "true";
        this.element.focus();
    }

    onBlur() {
        this.element.removeAttribute("contenteditable");
    }

    onKeypress(e) {
        if (e.keyCode == 13) {
            this.element.blur();
        }
    }

    onCtxMenu(e) {
        e.preventDefault();
        this.onClick();
    }

    onTextEdit() {
        this.virtualElemrnt.innerHTML = this.element.innerHTML;
    }
}
