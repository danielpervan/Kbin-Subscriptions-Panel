import Cache from "./Cache";
import subscriptionHandler from "./SubscriptionsHandler";
import {getSettings, saveSettings} from "../utils";
import SettingsModal from "./SettingsModal";

class SubscriptionsPanel {
    subscriptionsHandler;
    containerElement;
    contentElement;
    constructor() {
        this.subscriptionsHandler = new subscriptionHandler();
    }

    init() {
        const loginElement = document.querySelector(".login");
        if (loginElement.href.endsWith("/login")) {
            return;
        }
        /** Create the subscriptions panel */
        const kbinContainer = document.querySelector("#middle > .kbin-container");
        const magazinePanelContainer = document.createElement("div");
        this.containerElement = magazinePanelContainer;
        magazinePanelContainer.id = "subscription-panel";
        const magazinePanel = document.createElement("aside");
        this.contentElement = magazinePanel;
        const magazinePanelUl = document.createElement("ul");
        magazinePanelUl.className = "loading";
        const title = document.createElement("h3");
        magazinePanel.id = "subscription-panel-content";
        title.innerHTML = '<span class="subscription-panel-header">Subscriptions</span>';
        magazinePanel.appendChild(title);
        magazinePanelContainer.appendChild(magazinePanel);
        kbinContainer.appendChild(magazinePanelContainer);
        /** Add search box */
        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.id = "subscription-panel-search";
        searchBox.placeholder = "Filter";
        searchBox.addEventListener("input", (e) => {
            let filter = e.target.value.toLowerCase();
            if (filter.length === 0) {
                magazinePanelUl.querySelectorAll("li").forEach((li) => {
                    li.classList.remove("hideItem");
                    if (li.classList.contains("open")) {
                        li.classList.remove("open");
                        const i = li.querySelector("i");
                        i.classList.remove("fa-box-open");
                        i.classList.add("fa-box");
                    }
                });
                return;
            }
            magazinePanelUl.querySelectorAll("li").forEach((li) => {
                let a = li.querySelector("a");
                let subMags = li.querySelectorAll("li");
                if (a.innerText.toLowerCase().indexOf(filter) > -1) {
                    li.classList.remove("hideItem");
                } else {
                    let found = false;
                    if (subMags?.length > 0) {
                        subMags.forEach(subMag => {
                            if (subMag.innerText.toLowerCase().indexOf(filter) > -1) {
                                li.classList.remove("hideItem");
                                found = true;
                                li.classList.add("open");
                                const i = li.querySelector("i");
                                i.classList.remove("fa-box");
                                i.classList.add("fa-box-open");

                            }
                        });
                    }
                    if (!found) {
                        li.classList.add("hideItem");
                    }
                }
            });
        });

        const searchBoxClear = document.createElement("span");
        searchBoxClear.className = "search-box-clear";
        searchBoxClear.innerHTML = '<i class="fa-solid fa-times"></i>';
        searchBoxClear.addEventListener("click", () => {
            searchBox.value = "";
            searchBox.dispatchEvent(new Event("input"));
        });

        searchBox.addEventListener("input", () => {
            if (searchBox.value.length > 0) {
                searchBoxClear.classList.add("active");
            } else {
                searchBoxClear.classList.remove("active");
            }
        });
        searchBox.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                searchBox.value = "";
                searchBox.dispatchEvent(new Event("input"));
            }
        });

        const searchBoxContainer = document.createElement("div");
        searchBoxContainer.className = "search-box-container";
        searchBoxContainer.appendChild(searchBox);
        searchBoxContainer.appendChild(searchBoxClear);
        magazinePanel.appendChild(searchBoxContainer);

        /** Add settings modalElement */
        const settingsModal = new SettingsModal(this);
        const settingsButton = settingsModal.getSettingsButtonElement();
        magazinePanel.appendChild(settingsButton);

        /** Add collapse button */
        const collapseButton = document.createElement("span");
        collapseButton.id = "subscription-panel-collapse-button";
        collapseButton.title = "Hide Subscriptions";
        collapseButton.ariaLabel = "Hide Subscriptions";
        collapseButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        title.addEventListener("click", () => {
            this.toggleCollapsePanel();
        });
        title.appendChild(collapseButton);

        /** Add mobile open button */
        const menu = document.querySelector(".kbin-container > menu");
        const mobileButtonLi = document.createElement("li");
        const mobileButton = document.createElement("a");
        mobileButton.className = "subscription-panel-mobile-button";
        mobileButton.title = "Subscriptions";
        mobileButton.ariaLabel = "Subscriptions";
        mobileButton.href = "#";
        mobileButton.innerHTML = '<i class="fa-solid fa-newspaper"></i>';
        mobileButton.addEventListener("click", (e) => {
            this.toggleOpenMobilePanel();
            e.preventDefault();
        });
        mobileButtonLi.appendChild(mobileButton);
        menu.insertBefore(mobileButtonLi, menu.firstChild);

        magazinePanelContainer.addEventListener("click", (e) => {
            if (e.target === magazinePanelContainer) {
                if (document.body.classList.contains("subscription-panel-open") && document.body.classList.contains("subscription-panel-force-mobile")) {
                    this.closeMobilePanel();
                }
            }
        });
        /** Add subscription list */
        magazinePanel.appendChild(magazinePanelUl);
        const cache = new Cache();
        let cacheData = cache.get();
        if (cacheData.length > 0) {
            this.addMagazinesToDOM(cacheData);
        } else {
            /** Add spinner */
            let spinner = document.createElement("div");
            spinner.id = "subscription-panel-spinner";
            spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            magazinePanel.appendChild(spinner);
        }
        /** Fetch subscription page */
        this.subscriptionsHandler.load(1).then(() => {
            this.addMagazinesToDOM(this.subscriptionsHandler.subscriptions);
        });
    }

    toggleCollapsePanel() {
        const settings = getSettings();
        if (document.body.classList.contains("subscription-panel-collapsed")) {
            this.expandPanel();
            settings.collapsed = false;
        } else {
            if (this.collapsePanel()) {
                settings.collapsed = true;
            }
        }
        saveSettings(settings);
    }

    collapsePanel() {
        // Don't collapse on mobile
        if (window.innerWidth <= 991.98 || document.body.classList.contains("subscription-panel-force-mobile")) {
            return false;
        }
        if (document.body.classList.contains("sidebar-left")) {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-left";
        } else {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-right";
        }
        const button = document.querySelector("#subscription-panel-collapse-button");
        button.title = "Show subscriptions";
        button.ariaLabel = "Show subscriptions";
        document.querySelector(".subscription-panel-header").innerText = "Subs";
        document.body.classList.add("subscription-panel-collapsed");
        return true;
    }

    expandPanel() {
        if (document.body.classList.contains("sidebar-left")) {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-right";
        } else {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-left";
        }
        const button = document.querySelector("#subscription-panel-collapse-button");
        button.title = "Hide subscriptions";
        button.ariaLabel = "Hide subscriptions";
        document.querySelector(".subscription-panel-header").innerText = "Subscriptions";
        document.body.classList.remove("subscription-panel-collapsed");
        return true;
    }

    toggleOpenMobilePanel() {
        if (document.body.classList.contains("subscription-panel-open")) {
            this.closeMobilePanel();
        } else {
            this.openMobilePanel();
        }
    }

    openMobilePanel() {
        document.body.classList.add("subscription-panel-open");
        if (!document.body.classList.contains("fixed-navbar")) {
            window.scrollTo(0, 0);
        }
    }

    closeMobilePanel() {
        document.body.classList.remove("subscription-panel-open");
    }

    addMagazineToDOM(mag, parent) {
        /** Create the item dom element */
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.href = mag.url;
        a.title = mag.fullName;
        if (mag.img) {
            let img = document.createElement("img");
            img.src = mag.img;
            a.appendChild(img);
        } else {
            /** Add some padding when there is no magazine image */
            li.classList.add("no-image");
        }
        const span = document.createElement("span");
        span.className = "name";
        span.appendChild(document.createTextNode(mag.name));
        a.appendChild(span);
        if (mag.instanceName) {
            const span = document.createElement("span");
            span.className = "instance-name";
            span.appendChild(document.createTextNode("@" + mag.instanceName));
            a.appendChild(span);
        }
        li.appendChild(a);
        parent.appendChild(li);
    }

    addMagazinesToDOM(magazines) {
        /** Add magazines to the panel */
        const magazinePanelUl = document.querySelector("#subscription-panel ul");
        magazinePanelUl.innerHTML = "";

        magazines.forEach(mag => {
            if (mag?.type === "group") {
                let li = document.createElement("li");
                li.classList.add("group");
                let a = document.createElement("a");
                a.className = "group-name";
                a.href = "#";
                a.title = mag.fullName;
                a.ariaLabel = mag.fullName;
                a.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    li.classList.toggle("open");
                    const icon = a.querySelector("i");
                    if (li.classList.contains("open")) {
                        a.setAttribute("aria-expanded", "true");
                        icon.classList.remove("fa-box");
                        icon.classList.add("fa-box-open");
                    } else {
                        a.setAttribute("aria-expanded", "false");
                        icon.classList.remove("fa-box-open");
                        icon.classList.add("fa-box");
                    }
                });
                a.innerHTML = '<i class="fa-solid fa-box image"></i><span class="name">' + mag.name + '</span><span class="count">(' + mag.magazines.length + ")</span>";
                li.appendChild(a);
                let ul = document.createElement("ul");
                mag.magazines.forEach((subMag) => {
                    this.addMagazineToDOM(subMag, ul);
                });
                li.appendChild(ul);
                magazinePanelUl.appendChild(li);
            } else {
                this.addMagazineToDOM(mag, magazinePanelUl);
            }

        });
    }
}

export default SubscriptionsPanel;