import axios from "axios";

export default class EditorImages {
    constructor(element, virtualElement, ...[setLoading, showNotifications]) {
        this.element = element;
        this.virtualElement = virtualElement;

        this.element.addEventListener("click", () => this.onClick());
        this.imgUploader = document.querySelector("#img-upload");
        this.setLoading = setLoading;
        this.showNotifications = showNotifications;
    }

    onClick() {
        this.imgUploader.click();
        this.imgUploader.addEventListener("change", () => {
            if (this.imgUploader.files && this.imgUploader.files[0]) {
                let formData = new FormData();
                formData.append("image", this.imgUploader.files[0]);
                this.setLoading(true);
                axios
                    .post("./api/uploadImage.php", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((res) => {
                        this.virtualElement.src =
                            this.element.src = `./img/${res.data.src}`;
                    })
                    .catch(() =>
                        this.showNotifications("Save error!", "danger")
                    )
                    .finally(() => {
                        this.imgUploader.value = "";
                        this.setLoading(false);
                    });
            }
        });
    }
}
