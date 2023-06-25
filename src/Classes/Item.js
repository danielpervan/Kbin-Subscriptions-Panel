class Item {
    #icon;
    type;
    fullName;
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

    copy() {
        return new Item(this.fullName, this.type);
    }
}
export default Item;