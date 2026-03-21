
export class UIMounter {
    constructor() {
        this.element = null;
    }

    mount(template) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = template.trim();
        this.element = wrapper.firstElementChild;
        document.body.appendChild(this.element);

        
    }

    unmount() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}
