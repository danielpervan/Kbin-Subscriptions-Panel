import Item from "./Item";

class Magazine extends Item {
    icon;
    element;
    starred;

    constructor(fullName, url, icon = null) {
        super(fullName, Item.TYPE.MAGAZINE);
        this.icon = icon;
        this.url = url;
        this.name = fullName.replace(/@.*/, "");
        const instanceName = fullName.match(/@(.*)/);
        this.instanceName = instanceName ? instanceName[1] : null;
    }

    registerClickTime() {
        this.appendMagazineData({clickTime: Date.now()});
    }

    getMagazineData() {
        let magData = localStorage.getItem("subscription-panel-magazine-data");
        if (magData) {
            magData = JSON.parse(magData);
            magData = magData[this.fullName] || {};
        } else {
            magData = {};
        }
        return magData;
    }

    getClickTime() {
        return this.getMagazineData().clickTime || 0;
    }

    appendMagazineData(data) {
        let magData = localStorage.getItem("subscription-panel-magazine-data");
        if (magData) {
            magData = JSON.parse(magData);
        } else {
            magData = {};
        }
        if (!magData[this.fullName]) {
            magData[this.fullName] = data;
        } else {
            magData[this.fullName] = {...magData[this.fullName], ...data};
        }
        localStorage.setItem("subscription-panel-magazine-data", JSON.stringify(magData));
    }

    static fromElement(element) {
        let magA = element.querySelector("a")
        return new Magazine(magA.innerText, magA.href, element.querySelector("figure img")?.src);
    }

    enableEditMode() {
        super.enableEditMode();
        if (!this.element) {
            return;
        }
        this.element.classList.add("edit-mode");
    }

    disableEditMode() {
        super.disableEditMode();
        if (!this.element) {
            return;
        }
        this.element.classList.remove("edit-mode");
    }

    toggleStar() {
        let data = this.getMagazineData();
        if (data?.starred) {
            this.unstar();
        } else {
            this.star();
        }
    }

    star() {
        this.appendMagazineData({starred: true});
        this.element.classList.add("starred");
        this.starred = true;
    }

    unstar() {
        this.appendMagazineData({starred: false});
        this.element.classList.remove("starred");
        this.starred = false;
    }

    isStarred() {
        if (this.starred === undefined) {
            this.starred = this.getMagazineData()?.starred === true;
        }
        return this.starred;
    }

    ignore() {
        this.element.classList.add("ignore");
        this.ignored = true;
        this.appendMagazineData({ignored: true});
        this.element.querySelector(".toolItem.ignore").innerHTML = '<i class="fas fa-eye-slash"></i>';
    }

    unignore() {
        this.element.classList.remove("ignore");
        this.ignored = false;
        this.appendMagazineData({ignored: false});
        this.element.querySelector(".toolItem.ignore").innerHTML = '<i class="fas fa-eye"></i>';

    }

    toggleIgnored() {
        if (this.isIgnored()) {
            this.unignore();
        } else {
            this.ignore();
        }
    }

    isIgnored() {
        if (this.ignored === undefined) {
            this.ignored = this.getMagazineData()?.ignored === true;
        }
        return this.ignored;
    }

    getElement() {
        if (this.element) {
            return this.element;
        }
        let magData = this.getMagazineData();
        /** Create the item dom element */
        let li = document.createElement("li");
        if (magData?.starred) {
            li.classList.add("starred");
        }
        if (this.isIgnored()) {
            li.classList.add("ignore");
        }

        const tools = Object.assign(document.createElement("span"), {className: "tools"});
        const star = Object.assign(document.createElement("span"), {
            className: "star toolItem",
            title: "Star",
            innerHTML: '<i class="fas fa-star"></i>',
            onclick: () => {
                this.toggleStar();
            }
        });

        const ignore = Object.assign(document.createElement("span"), {
            className: "ignore toolItem",
            title: "Ignore",
            innerHTML: this.isIgnored() ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>',
            onclick: () => {
                this.toggleIgnored();
            }
        });
        tools.appendChild(star);
        tools.appendChild(ignore);
        li.appendChild(tools);
        this.element = li;
        let a = document.createElement("a");
        a.href = this.url;
        a.className = "magazine";
        a.addEventListener("click", () => {
            this.registerClickTime();
        });
        a.title = this.fullName;
        if (this.icon) {
            let icon = document.createElement("img");
            icon.src = this.icon;
            a.appendChild(icon);
        } else {
            /** Add some padding when there is no magazine image */
            li.classList.add("no-image");
        }
        const span = document.createElement("span");
        span.className = "name";
        span.appendChild(document.createTextNode(this.name));
        a.appendChild(span);
        if (this.instanceName) {
            const span = document.createElement("span");
            span.className = "instance-name";
            span.appendChild(document.createTextNode("@" + this.instanceName));
            a.appendChild(span);
        }
        li.appendChild(a);
        return li;
    }

    static fromJSON(json) {
        return new Magazine(json.fullName, json.url, json.icon);
    }

    toJSON() {
        return {
            fullName: this.fullName,
            icon: this.icon,
            url: this.url,
            type: this.type
        }
    }

    copy() {
        return new Magazine(this.fullName, this.url, this.icon);
    }
}

export default Magazine;