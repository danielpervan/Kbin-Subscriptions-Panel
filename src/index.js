import {getSettings, saveSettings} from "./utils";
import Cache from "./Classes/Cache";
import "./style.scss";
import SubscriptionHandler from "./Classes/SubscriptionHandler";

/** Globals */
const subscriptionHandler = new SubscriptionHandler();

function addSubscriptionsSidePanel() {
    const loginElement = document.querySelector(".login");
    if (loginElement.href.endsWith("/login")) {
        return;
    }
    /** Create the subscriptions panel */
    const kbinContainer = document.querySelector("#middle > .kbin-container");
    const magazinePanelContainer = document.createElement("div");
    magazinePanelContainer.id = "subscription-panel";
    const magazinePanel = document.createElement("aside");
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

    /** Add settings button */
    const settingsButton = document.createElement("div");
    settingsButton.id = "subscription-panel-settings-button";
    settingsButton.title = "Settings";
    settingsButton.ariaLabel = "Settings";
    settingsButton.innerHTML = '<i class="fa-solid fa-cog"></i>';
    settingsButton.addEventListener("click", () => {
        showSettingsModal();
    });
    magazinePanel.appendChild(settingsButton);

    /** Add collapse button */
    const collapseButton = document.createElement("span");
    collapseButton.id = "subscription-panel-collapse-button";
    collapseButton.title = "Hide Subscriptions";
    collapseButton.ariaLabel = "Hide Subscriptions";
    collapseButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    title.addEventListener("click", () => {
        toggleCollapsePanel();
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
        toggleOpenMobilePanel();
        e.preventDefault();
    });
    mobileButtonLi.appendChild(mobileButton);
    menu.insertBefore(mobileButtonLi, menu.firstChild);

    magazinePanelContainer.addEventListener("click", (e) => {
        if (e.target === magazinePanelContainer) {
            if (document.body.classList.contains("subscription-panel-open") && document.body.classList.contains("subscription-panel-force-mobile")) {
                closeMobilePanel();
            }
        }
    });
    /** Add subscription list */
    magazinePanel.appendChild(magazinePanelUl);
    const cache = new Cache();
    if (cache.get().length > 0) {
        addMagazines(cache);
    } else {
        /** Add spinner */
        let spinner = document.createElement("div");
        spinner.id = "subscription-panel-spinner";
        spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        magazinePanel.appendChild(spinner);
    }
    /** Fetch subscription page */
    subscriptionHandler.load(1).then(() => {
        addMagazines(subscriptionHandler.subscriptions);
    });
}
function addMagazine(mag, parent) {
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

function addMagazines(magazines) {
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
                addMagazine(subMag, ul);
            });
            li.appendChild(ul);
            magazinePanelUl.appendChild(li);
        } else {
            addMagazine(mag, magazinePanelUl);
        }

    });
}

function showSettingsModal() {
    const settings = getSettings();
    const modal = document.createElement("div");
    modal.className = "subscription-panel-settings-modal subscription-panel-modal";
    modal.innerHTML = `
        <div class="subscription-panel-settings-modal-content subscription-panel-modal-content">
            <div class="subscription-panel-settings-modal-header">
                <span class="close" title="Close settings" aria-label="Close settings">
                    <i class="fa-solid fa-times"></i>
                </span>
                <h2>Subscriptions Panel Settings</h2>
            </div>
            <div class="subscription-panel-settings-modal-body">
                <ul>
                    <li>
                        <label>
                            <input type="checkbox" id="subscription-panel-extend-width" />
                            Extend page width
                            <span class="description">Extend the page width to fit the subscriptions panel</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-hide-on-collapse" />
                            Hide on collapse
                            <span class="description">Hide magazines when panel is collapsed</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-use-cache" />
                            Cache subscriptions
                            <span class="description">Cache subscriptions to load the panel quicker.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-force-mobile" />
                            Always show mobile menu
                            <span class="description">Always show the mobile menu, even on desktop.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-use-groups" />
                            Group identical names
                            <span class="description">Group magazines with the same name but from different instances.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-show-onboarding" />
                            Show onboarding
                            <span class="description">Show the onboarding step again on next load.</span>
                        </label>
                    </li>
            </div>
        </div>
        `;
    document.body.appendChild(modal);

    const extendWidthEl = modal.querySelector("#subscription-panel-extend-width");
    if (settings?.extendWidth) {
        extendWidthEl.checked = true;
    }
    const hideOnCollapseEl = modal.querySelector("#subscription-panel-hide-on-collapse");
    if (settings?.hideOnCollapse) {
        hideOnCollapseEl.checked = true;
    }
    const useCacheEl = modal.querySelector("#subscription-panel-use-cache");
    if (settings?.useCache) {
        useCacheEl.checked = true;
    }
    const skipOnboardingEl = modal.querySelector("#subscription-panel-show-onboarding");
    if (settings?.onboardingDone) {
        skipOnboardingEl.checked = false;
    }
    const forceMobileEl = modal.querySelector("#subscription-panel-force-mobile");
    if (settings?.forceMobile) {
        forceMobileEl.checked = true;
    }
    const useGroupsEl = modal.querySelector("#subscription-panel-use-groups");
    if (settings?.useGroups) {
        useGroupsEl.checked = true;
    }

    modal.querySelector(".subscription-panel-settings-modal .close").addEventListener("click", () => {
        modal.remove();
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    modal.querySelector("#subscription-panel-extend-width").addEventListener("change", (e) => {
        const settings = getSettings();
        settings.extendWidth = !!e.target.checked;
        saveSettings(settings);
        applySettings();
    });

    modal.querySelector("#subscription-panel-use-cache").addEventListener("change", (e) => {
        const settings = getSettings();
        if (e.target.checked) {
            settings.useCache = true;
        } else {
            settings.useCache = false;
            const cache = new Cache();
            cache.remove();
        }
        saveSettings(settings);
        applySettings();
    });

    modal.querySelector("#subscription-panel-hide-on-collapse").addEventListener("change", (e) => {
        const settings = getSettings();
        settings.hideOnCollapse = !!e.target.checked;
        saveSettings(settings);
        applySettings();
    });
    modal.querySelector("#subscription-panel-show-onboarding").addEventListener("change", (e) => {
        const settings = getSettings();
        settings.onboardingDone = !e.target.checked;
        saveSettings(settings);
    });
    modal.querySelector("#subscription-panel-use-groups").addEventListener("change", (e) => {
        const settings = getSettings();
        settings.useGroups = !!e.target.checked;
        subscriptionHandler.reload().then(() => {
            addMagazines(subscriptionHandler.subscriptions);
        });
        saveSettings(settings);
        applySettings();
    });
    modal.querySelector("#subscription-panel-force-mobile").addEventListener("change", (e) => {
            const settings = getSettings();
            settings.forceMobile = !!e.target.checked;
            saveSettings(settings);
            applySettings();
        }
    );
}

function applySettings() {
    const settings = getSettings();
    if (settings?.extendWidth) {
        document.body.classList.add("extend-width");
    } else {
        document.body.classList.remove("extend-width");
    }

    if (settings?.collapsed) {
        collapsePanel();
    } else {
        uncollapsePanel();
    }

    if (settings?.hideOnCollapse) {
        document.body.classList.add("subscription-panel-hide-on-collapse");
    } else {
        document.body.classList.remove("subscription-panel-hide-on-collapse");
    }

    if (settings?.forceMobile) {
        document.body.classList.add("subscription-panel-force-mobile");
    } else {
        document.body.classList.remove("subscription-panel-force-mobile");
        closeMobilePanel();
    }

}

function toggleCollapsePanel() {
    const settings = getSettings();
    if (document.body.classList.contains("subscription-panel-collapsed")) {
        uncollapsePanel();
        settings.collapsed = false;
    } else {
        if (collapsePanel()) {
            settings.collapsed = true;
        }
    }
    saveSettings(settings);
}

function collapsePanel() {

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

function uncollapsePanel() {
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

function toggleOpenMobilePanel() {
    if (document.body.classList.contains("subscription-panel-open")) {
        closeMobilePanel();
    } else {
        openMobilePanel();
    }
}

function openMobilePanel() {
    document.body.classList.add("subscription-panel-open");
    if (!document.body.classList.contains("fixed-navbar")) {
        window.scrollTo(0, 0);
    }
}

function closeMobilePanel() {
    document.body.classList.remove("subscription-panel-open");
}

function showOnboarding() {
    const settings = getSettings();
    if (settings?.onboardingDone) {
        return;
    }
    settings.onboardingDone = true;
    saveSettings(settings);
    const onboarding = document.createElement("div");
    onboarding.className = "subscription-panel-onboarding subscription-panel-modal";
    onboarding.innerHTML = `
        <div class="subscription-panel-onboarding-content subscription-panel-modal-content">
            <div class="subscription-panel-onboarding-close close" title="Close onboarding" aria-label="Close onboarding"><i class="fa-solid fa-times"></i></div>
            <h2>Thanks for using Subscriptions Panel!</h2>
            <p>Click on the <i class="fa-solid fa-chevron-left"></i> icon to collapse the panel.</p>
            <p>Click on the <i class="fa-solid fa-cog"></i> icon to open the settings.</p>
            <p>Click on the <i class="fa-solid fa-newspaper"></i> icon to open the panel on mobile.</p>
            <p>Magazines that share the same name are grouped together. A group is indicated by a <i class="fa-solid fa-box"></i> icon.</p>
            <p>Please take a few seconds to review the settings in the next step. You can always do this later if you want.</p>
            <a href="#" class="subscription-panel-onboarding-next">Show settings <i class="fa-solid fa-chevron-right"></i></a>
        </div>
        `;
    onboarding.querySelector(".subscription-panel-onboarding-close").addEventListener("click", () => {
        onboarding.remove();
    });

    onboarding.querySelector(".subscription-panel-onboarding-next").addEventListener("click", () => {
        onboarding.remove();
        showSettingsModal();
        return false;
    });

    onboarding.addEventListener("click", (e) => {
        if (e.target === onboarding) {
            onboarding.remove();
            showSettingsModal();
        }
    });
    document.body.appendChild(onboarding);
}

/** Do the stuff */
addSubscriptionsSidePanel();
applySettings();
showOnboarding();