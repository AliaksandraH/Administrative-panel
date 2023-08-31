export default class EditorImages {
    constructor(
        element,
        virtualElement,
        ...[setPhoto, setVirtualElementPhoto]
    ) {
        this.element = element;
        this.virtualElement = virtualElement;

        this.element.addEventListener("click", () => this.onClick());
        this.imgUploader = document.querySelector("#img-upload");
        this.setPhoto = setPhoto;
        this.setVirtualElementPhoto = setVirtualElementPhoto;
    }

    async onClick() {
        this.setPhoto(this.element);
        this.setVirtualElementPhoto(this.virtualElement);
        await this.imgUploader.click();
    }
}
