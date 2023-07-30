import Cache from "./Cache";
import {getSettings, saveSettings} from "../utils";
import subscriptionsHandler from "./SubscriptionsHandler";
import SearchBox from "./SearchBox";
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
        const settings = getSettings();
        /** Create the subscriptions panel */
        document.body.classList.add("subscription-panel-injected");
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
        const searchBox = new SearchBox(this.subscriptionsHandler, magazinePanelContainer);
        this.searchBox = searchBox;
        magazinePanel.appendChild(searchBox.getElement());

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
        if (settings?.forceMobile || !settings?.alternativeMenu) {
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
                    if (document.body.classList.contains("subscription-panel-open")) {
                        this.closeMobilePanel();
                    }
                }
            });
        }

        /** Add alternative mobile menu button */
        const altMobileButton = Object.assign(document.createElement("a"), {
            title: "Subscriptions",
            ariaLabel: "Subscriptions",
            href: "#",
            innerHTML: '<i class="fa-solid fa-newspaper"></i>',
        });
        altMobileButton.addEventListener("click", (e) => {
            this.toggleOpenMobilePanel();
            e.preventDefault();
        });
        const mobileMenu = document.querySelector(".top-options menu ul");
        const mobileMenuLi = Object.assign(document.createElement('li'), {
            className: 'mobile-subscriptions-panel-button-alt',
        });
        mobileMenuLi.appendChild(altMobileButton);
        mobileMenu.insertBefore(mobileMenuLi, mobileMenu.lastChild.previousSibling);
        const altCloseButton = Object.assign(document.createElement("a"), {
            className: "subscription-panel-mobile-close-button-alt",
            title: "Close",
            ariaLabel: "Close",
            innerHTML: '<i class="fa-solid fa-times"></i>',
            href: "#",
        });
        altCloseButton.addEventListener("click", (e) => {
            this.closeMobilePanel();
            e.preventDefault();
        });

        magazinePanel.insertBefore(altCloseButton, magazinePanel.firstChild);

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

        window.addEventListener("hide-all-modals", () => {
            this.closeMobilePanel();
        });
    }

    enableEditMode() {
        this.editMode = true;
        this.containerElement.classList.add("edit-mode");
        this.expandPanel();
        this.subscriptionsHandler.subscriptions.forEach((mag) => {
            mag.enableEditMode();
        });
        this.searchBox.editMode = true;
        const editButton = document.getElementById("subscription-panel-edit-button");
        editButton.innerHTML = '<i class="fa-solid fa-check"></i> Done';
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
        this.searchBox.editMode = false;
        this.searchBox.clear();
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
        window.dispatchEvent(new Event("hide-all-modals"));
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
                    const newMag = mag.copy();
                    /** Sort groups */
                    if (newMag.type === Magazine.TYPE.GROUP) {
                        newMag.magazines.sort((a, b) => {
                            return b.getClickTime() - a.getClickTime();
                        });
                    }
                    let el = newMag.getElement();
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