class Item {
    #icon;
    type;
    fullName;
    editMode;
    hidden = false;
    element;
    static get TYPE() {
        return {
            MAGAZINE: "magazine",
            GROUP: "group"
        }
    }
    constructor(fullName, type) {
        this.fullName = fullName;
        this.name = fullName;
        this.type = type;
        this.#icon = null;
        this.editMode = false;
    }

    get icon() {
        return this.#icon;
    }

    getElement() {
        let li = document.createElement("li");
        li.classList.add("item");
        li.setAttribute("data-type", this.type);
        li.setAttribute("data-name", this.fullName);
        return li;
    }

    enableEditMode() {
        this.editMode = true;
    }
    disableEditMode() {
        this.editMode = false;
    }

    toggleEditMode() {
        if (this.editMode) {
            this.disableEditMode();
        } else {
            this.enableEditMode();
        }
    }

    isStarred() {
        return false;
    }
    isHidden() {
        return this.hidden;
    }

    hide(fadeOut=false) {
        this.hidden = true;
        if (!this.element) {
            return;
        }
        this.element.classList.add("hideItem");
    }

    show(fadeIn=false) {
        if (!this.hidden) {
            return;
        }
        this.hidden = false;
        if (!this.element) {
            return;
        }
        if (fadeIn && this.element.classList.contains("hideItem")) {
            this.element.addEventListener("animationend", () => {
                this.element.classList.remove("fade-in");
            });
            this.element.classList.add("fade-in");
        }
        this.element.classList.remove("hideItem");
    }

    toggleHidden() {
        if (this.isHidden()) {
            this.hide();
        } else {
            this.show();
        }
    }

    isIgnored() {
        return false;
    }

    search(query, includeIgnored=false) {
        if (!includeIgnored && this.isIgnored()) {
            return false;
        }
        return this.fullName.toLowerCase().includes(query.toLowerCase());
    }

    copy() {
        return new Item(this.fullName, this.type);
    }
}
export default Item;