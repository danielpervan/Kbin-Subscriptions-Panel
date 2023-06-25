import Item from "./Item";
import Magazine from "./Magazine";

class Group extends Item {
    #isOpen = false;
    element;
    magazines = [];
    countElement;

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
        const magazineCount = this.magazineCount();
        let li = document.createElement("li");
        this.element = li;
        li.classList.add("group");
        if (this.isIgnored() || magazineCount === 0) {
            li.classList.add("ignore");
        }
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
        const count = Object.assign(document.createElement("span"), {
            className: "count",
            innerHTML: "(" + magazineCount + ")"
        });
        this.countElement = count;
        a.innerHTML = this.icon + '<span class="name">' + this.fullName + '</span>';
        a.appendChild(count);
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

    enableEditMode() {
        super.enableEditMode();
        if (!this.element) {
            return;
        }
        this.magazines.forEach((mag) => {
            mag.enableEditMode();
        });
        this.open();
        this.element.classList.add("edit-mode");
    }

    disableEditMode() {
        super.disableEditMode();
        if (!this.element) {
            return;
        }
        this.magazines.forEach((mag) => {
            mag.disableEditMode();
        });
        this.close();
        this.element.classList.remove("edit-mode");
        if (this.isIgnored()) {
            this.element.classList.add("ignore");
        } else {
            this.element.classList.remove("ignore");
        }
        this.countElement.innerHTML = "(" + this.magazineCount() + ")";
    }

    isStarred() {
        return this.magazines.some((mag) => mag.isStarred());
    }

    isIgnored() {
        return this.magazineCount() === 0;
    }

    hide(fadeOut = false) {
        super.hide();
        if (!this.element) {
            return;
        }
        this.magazines.forEach((mag) => {
            mag.hide(fadeOut);
        });
        this.element.classList.add("hideItem");
    }

    show(fadeIn = false) {
        super.show();
        if (!this.element) {
            return;
        }
        this.magazines.forEach((mag) => {
            mag.show();
        });
    }

    magazineCount() {
        let count = 0;
        this.magazines.forEach((mag) => {
            if (!mag.isIgnored()) {
                count++;
            }
        });
        return count;
    }

    search(query, includeIgnored = false) {
        let found = super.search(query, includeIgnored);
        if (!found && !includeIgnored && this.isIgnored()) {
            return false;
        }
        this.magazines.forEach((mag) => {
            if (mag.search(query, includeIgnored)) {
                found = true;
            }
        });
        return found;
    }
}

export default Group;