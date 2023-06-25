import Item from "./Item";
import Magazine from "./Magazine";
class Group extends Item {
    #isOpen = false;
    element;
    magazines = [];
    constructor(fullName, subMagazines) {
        super(fullName, Item.TYPE.GROUP);
        this.magazines = subMagazines;
        this.name = fullName;
    }

    set isOpen(isOpen) {
        this.#isOpen = !!isOpen;
    }

    get isOpen() {
        return !!this.#isOpen;
    }

    get icon() {
        if (this.isOpen) {
            return '<i class="fas fa-box-open image"></i>'
        } else {
            return '<i class="fas fa-box image"></i>'
        }
    }

    getClickTime() {
        let latest = 0;
        this.magazines.forEach((mag) => {
            if (mag.getClickTime() > latest) {
                latest = mag.getClickTime();
            }
        });
        return latest || 0;
    }
    static fromElement(element) {
        let groupA = element.querySelector("a")
        return new Group(groupA.innerText, element.querySelector("figure img")?.src, groupA.href);
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.element.classList.add("open");
        const a = this.element.querySelector("a");
        const icon = a.querySelector("i");
        a.setAttribute("aria-expanded", "true");
        icon.classList.remove("fa-box");
        icon.classList.add("fa-box-open");
    }

    close() {
        this.isOpen = false;
        this.element.classList.remove("open");
        const a = this.element.querySelector("a");
        const icon = a.querySelector("i");
        a.setAttribute("aria-expanded", "false");
        icon.classList.remove("fa-box-open");
        icon.classList.add("fa-box");
    }

    getElement() {
        if (this.element) {
            return this.element;
        }
        let li = document.createElement("li");
        this.element = li;
        li.classList.add("group");
        let a = document.createElement("a");
        a.className = "group-name";
        a.href = "#";
        a.title = this.fullName;
        a.ariaLabel = this.fullName;
        a.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });
        a.innerHTML = this.icon + '<span class="name">' + this.fullName + '</span>' + '<span class="count">(' + this.magazines.length + ")</span>";
        li.appendChild(a);
        let ul = document.createElement("ul");
        this.magazines.forEach((subMag) => {
            const el = subMag.getElement();
            ul.appendChild(el);
        });
        li.appendChild(ul);
        return li;
    }
    static fromJSON(json) {
        return new Group(json.fullName, json.magazines.map((mag) => Magazine.fromJSON(mag)));
    }
    toJSON() {
        return {
            fullName: this.fullName,
            magazines: this.magazines.map((mag) => mag.toJSON()),
            type: this.type
        }
    }

    copy() {
        return new Group(this.fullName, this.magazines.map((mag) => mag.copy()));
    }
}

export default Group;