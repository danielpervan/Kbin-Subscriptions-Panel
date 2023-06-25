import Item from "./Item";

class Magazine extends Item {
    icon;
    element;

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

    getElement() {
        if (this.element) {
            return this.element;
        }
        /** Create the item dom element */
        let li = document.createElement("li");
        this.element = li;
        let a = document.createElement("a");
        a.href = this.url;
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