import Cache from "./Cache";
import {getSettings, saveSettings} from "../utils";
import subscriptionsHandler from "./SubscriptionsHandler";
import Magazine from "./Magazine";

class SubscriptionsPanel {
    subscriptionsHandler;
    containerElement;
    contentElement;
    editMode = false;

    constructor() {
        this.subscriptionsHandler = new subscriptionsHandler();
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
        magazinePanelUl.className = "fade-in subscription-list";
        magazinePanelUl.addEventListener("animationend", () => {
            magazinePanelUl.classList.remove("fade-in");
        });
        const title = document.createElement("h3");
        magazinePanel.id = "subscription-panel-content";
        title.innerHTML = '<span class="subscription-panel-header">Subscriptions</span>';
        magazinePanel.appendChild(title);
        const editButton = Object.assign(document.createElement("div"), {
            id: "subscription-panel-edit-button",
            title: "Edit subscriptions",
            ariaLabel: "Edit subscriptions",
            innerHTML: '<i class="fa-solid fa-pencil"></i>',
        });
        editButton.addEventListener("click", () => {
            this.toggleEditMode();
        });
        magazinePanel.appendChild(editButton);
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
                lastClickedContainer.classList.remove("hideItem");
                /*magazinePanelUl.querySelectorAll("li").forEach((li) => {
                    if (li.classList.contains("hideItem")) {
                        li.classList.remove("hideItem");
                        li.addEventListener("animationend", () => {
                            li.classList.remove("fade-in");
                        });
                        li.classList.add("fade-in");
                    }
                    if (li.classList.contains("open") && !this.editMode) {
                        li.classList.remove("open");
                        const i = li.querySelector("i");
                        i.classList.remove("fa-box-open");
                        i.classList.add("fa-box");
                    }
                });*/
                this.subscriptionsHandler.subscriptions.forEach(mag => {
                    mag.show(true);
                    if (mag.type === Magazine.TYPE.GROUP) {
                        mag.close();
                    }
                });
                return;
            }
            lastClickedContainer.classList.add("hideItem");
            this.subscriptionsHandler.subscriptions.forEach(mag => {
                if (mag.type === Magazine.TYPE.GROUP) {
                    mag.open();
                    let subMagFound = false;
                    mag.magazines.forEach(subMag => {
                        if (subMag.search(filter, this.editMode)) {
                            subMagFound = true;
                            subMag.show(true);
                        } else {
                            subMag.hide(true);
                        }
                    });
                    if (subMagFound) {
                        mag.show(true);
                    } else {
                        mag.hide(true);
                    }
                } else if (mag.type === Magazine.TYPE.MAGAZINE) {
                    if (mag.search(filter, this.editMode)) {
                        mag.show(true);
                    } else {
                        mag.hide(true);
                    }
                }
            });
            /* magazinePanelUl.querySelectorAll("li").forEach((li) => {
                 let a = li.querySelector("a");
                 let subMags = li.querySelectorAll("li");
                 if (a.innerText.toLowerCase().indexOf(filter) > -1) {
                     if (li.classList.contains("hideItem")) {
                         li.classList.remove("hideItem");
                         li.addEventListener("animationend", () => {
                             li.classList.remove("fade-in");
                         });
                         li.classList.add("fade-in");
                     }
                 } else {
                     let found = false;
                     if (subMags?.length > 0) {
                         subMags.forEach(subMag => {
                             if (subMag.innerText.toLowerCase().indexOf(filter) > -1) {
                                 if (li.classList.contains("hideItem")) {
                                     li.classList.add("fade-in");
                                     li.classList.remove("hideItem");
                                 }
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
                         li.classList.add("fade-in");
                     }
                 }
             });*/
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
        /** Detect when sidebar is opened */
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    const attributeValue = mutation.target.getAttribute(mutation.attributeName);
                    if (attributeValue.includes("open")) {
                        this.closeMobilePanel();
                    }
                }
            });

        });
        observer.observe(document.getElementById("sidebar"), {attributes: true});

        /** Add subscription list */
        const lastClickedContainer = document.createElement("div");
        lastClickedContainer.className = "last-clicked-container";
        lastClickedContainer.appendChild(Object.assign(document.createElement("h3"), {
            innerText: "Recently viewed",
        }));
        const magazinePanelLastClickedUl = document.createElement("ul");
        magazinePanelLastClickedUl.className = "fade-in last-clicked-list";
        const settings = getSettings();
        if (settings?.showLastClicked !== true) {
            lastClickedContainer.classList.add("hideItem");
        }
        lastClickedContainer.appendChild(magazinePanelLastClickedUl);
        magazinePanel.appendChild(lastClickedContainer);

        magazinePanel.appendChild(magazinePanelUl);
        const cache = new Cache();
        let cacheData = cache.get();
        if (cacheData.length > 0) {
            this.addMagazinesToDOM(cacheData, false);
        } else {
            /** Add spinner */
            let spinner = document.createElement("div");
            spinner.id = "subscription-panel-spinner";
            spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            magazinePanel.appendChild(spinner);
        }
        /** Fetch subscription page */
        this.subscriptionsHandler.load().then(() => {
            this.addMagazinesToDOM(this.subscriptionsHandler.subscriptions, true);
        });
    }

    enableEditMode() {
        this.editMode = true;
        this.containerElement.classList.add("edit-mode");
        this.expandPanel();
        this.subscriptionsHandler.subscriptions.forEach((mag) => {
            mag.enableEditMode();
        });
        const editButton = document.getElementById("subscription-panel-edit-button");
        editButton.innerHTML = '<i class="fa-solid fa-check"></i> Save';
        editButton.classList.add("active");
    }

    disableEditMode() {
        this.editMode = false;
        this.containerElement.classList.remove("edit-mode");
        this.subscriptionsHandler.subscriptions.forEach((mag) => {
            mag.disableEditMode();
        });
        this.subscriptionsHandler.sort();
        this.addMagazinesToDOM(this.subscriptionsHandler.subscriptions);
        const editButton = document.getElementById("subscription-panel-edit-button");
        editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        editButton.classList.remove("active");
        const searchBox = document.querySelector("#subscription-panel-search");
        searchBox.value = "";
        searchBox.dispatchEvent(new Event("input"));
    }

    toggleEditMode() {
        if (this.editMode) {
            this.disableEditMode();
        } else {
            this.enableEditMode();
        }
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
        if (window.innerWidth <= 991.98 || document.body.classList.contains("subscription-panel-force-mobile") || this.editMode) {
            return false;
        }

        const lastClickedH3 = document.querySelector(".last-clicked-container h3");
        if (lastClickedH3) {
            lastClickedH3.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> Recent';
        }

        if (document.body.classList.contains("sidebar-left")) {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-left";
        } else {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-right";
        }
        const button = document.querySelector("#subscription-panel-collapse-button");
        button.title = "Show subscriptions";
        button.ariaLabel = "Show subscriptions";
        document.querySelector(".subscription-panel-header").innerHTML = '<i class="fa-solid fa-newspaper"></i> Subs';
        document.body.classList.add("subscription-panel-collapsed");
        return true;
    }

    expandPanel() {
        if (document.body.classList.contains("sidebar-left")) {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-right";
        } else {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-left";
        }
        const lastClickedH3 = document.querySelector(".last-clicked-container h3");
        if (lastClickedH3) {
            lastClickedH3.innerText = "Recently viewed";
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
        document.getElementById("sidebar")?.classList.remove("open");
    }

    closeMobilePanel() {
        document.body.classList.remove("subscription-panel-open");
    }

    addMagazinesToDOM(magazines) {
        /** Add magazines to the panel */
        const magazinePanelUl = document.querySelector("#subscription-panel ul.subscription-list");
        const lastClickedContainer = document.querySelector("#subscription-panel .last-clicked-container");
        const magazinePanelLastClickedUl = document.querySelector("#subscription-panel ul.last-clicked-list");
        magazinePanelUl.innerHTML = "";
        magazinePanelLastClickedUl.innerHTML = "";
        const settings = getSettings();
        if (settings?.showLastClicked === true) {
            lastClickedContainer.classList.remove("hideItem");
            let lastMagazines = [...magazines].sort((a, b) => {
                return b.getClickTime() - a.getClickTime();
            }).slice(0, 4);

            lastMagazines = lastMagazines.filter(mag => mag.getClickTime() > 0);
            if (lastMagazines.length === 0) {
                lastClickedContainer.classList.add("hideItem");
            } else {
                lastMagazines.forEach(mag => {
                    let el = mag.copy().getElement();
                    el.classList.add("last-clicked");
                    magazinePanelLastClickedUl.appendChild(el);
                });
            }

        } else {
            lastClickedContainer.classList.add("hideItem");
        }
        magazines.forEach(mag => {
            let el = mag.getElement();
            magazinePanelUl.appendChild(el);
        });
    }
}

export default SubscriptionsPanel;