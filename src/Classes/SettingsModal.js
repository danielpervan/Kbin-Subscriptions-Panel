import {getSettings, resetSettings, saveSettings} from "../utils";
import Cache from "./Cache";

class SettingsModal {
    subscriptionsPanel;
    modalElement;

    constructor(subscriptionsPanel) {
        this.subscriptionsPanel = subscriptionsPanel;
    }

    getSettingsButtonElement() {
        const settingsButton = document.createElement("div");
        settingsButton.id = "subscription-panel-settings-button";
        settingsButton.title = "Settings";
        settingsButton.ariaLabel = "Settings";
        settingsButton.innerHTML = '<i class="fa-solid fa-cog"></i>';
        settingsButton.addEventListener("click", () => {
            this.show();
        });
        return settingsButton;
    }

    init() {
        const settingsButton = this.getSettingsButtonElement();
        this.subscriptionsPanel.contentElement.appendChild(settingsButton);
        this.applySettings()
        window.addEventListener("open-subscriptions-panel-settings", () => {
            this.show();
        });

        /** Check for KUP */
        setTimeout(() => {
            const KUP = document.KUP;
            const settingsPanel = KUP?.settingsPanel;
            const SettingsPanelBooleanRow = KUP?.components?.SettingsPanelButtonRow;
            const SettingsPanelSection = KUP?.components?.SettingsPanelSection;
            if (settingsPanel && SettingsPanelBooleanRow && SettingsPanelSection) {
                const section = new SettingsPanelSection("Subscriptions Panel");
                section.addSettingsRows([new SettingsPanelBooleanRow("Open settings", {
                    label: "Open",
                    onClick: () => {
                        window.dispatchEvent(new CustomEvent("open-subscriptions-panel-settings"));
                    }
                })]);
                settingsPanel.addSection(section);
            }
        }, 100);
    }

    close() {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
    }

    /** Apply settings to the subscriptions panel
     * @param id {string} The id of the element
     * @param setting {string} The setting to apply
     * @param invert {boolean} Invert checked state from settings
     * @param callback {function} Callback to run when checkbox is changed
     */
    registerCheckbox(id, setting, invert = false, callback = null) {
        const element = document.getElementById(id);
        const settings = getSettings();
        if (settings?.[setting] === true) {
            element.checked = !invert;
        }
        element.addEventListener("change", (e) => {
            const settings = getSettings();
            settings[setting] = !!e.target.checked;
            saveSettings(settings);
            if (callback) {
                callback(element.checked);
            }
        });
    }

    show() {
        const settings = getSettings();
        const modal = document.createElement("div");
        this.modalElement = modal;
        const version = GM_info.script.version || "Unknown";
        modal.className = "subscription-panel-settings-modal subscription-panel-modal";
        modal.innerHTML = `
        <div class="subscription-panel-settings-modal-content subscription-panel-modal-content">
            <div class="subscription-panel-settings-modal-header">
                <span class="close" title="Close settings" aria-label="Close settings">
                    <i class="fa-solid fa-times"></i>
                </span>
                <h2>Subscriptions Panel Settings</h2>
                <h3>Version ${version}</h3>
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
                            <input type="checkbox" id="subscription-panel-show-last-clicked" />
                            Show recently viewed
                            <span class="description">Show recently viewed magazines.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-sticky" />
                            Sticky panel
                            <span class="description">Make the panel stick to the top and scroll independently.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-alternative-menu" />
                            Alternative menu
                            <span class="description">Move the mobile menu button to the hamburger mobile menu for better compatibility with other scripts.</span>
                        <label>
                            <input type="checkbox" id="subscription-panel-show-onboarding" />
                            Show onboarding
                            <span class="description">Show the onboarding step again on next load.</span>
                        </label>
                        <label class="danger">
                            <input type="button" id="subscription-panel-reset" value="Reset settings"/>
                            <span class="description">Removes all cached data and resets settings to default.</span>
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

        const lastClickedEl = modal.querySelector("#subscription-panel-show-last-clicked");
        if (settings?.showLastClicked) {
            lastClickedEl.checked = true;
        }

        this.registerCheckbox("subscription-panel-sticky", "sticky", false, () => {
            this.applySettings();
        });

        this.registerCheckbox("subscription-panel-alternative-menu", "alternativeMenu", false, () => {
            this.applySettings();
        });

        const resetEl = modal.querySelector("#subscription-panel-reset");
        resetEl.addEventListener("click", () => {
            const cache = new Cache();
            cache.remove();
            resetSettings();
            window.location.reload();
        });

        modal.querySelector(".subscription-panel-settings-modal .close").addEventListener("click", () => {
            this.close();
        });
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        modal.querySelector("#subscription-panel-extend-width").addEventListener("change", (e) => {
            const settings = getSettings();
            settings.extendWidth = !!e.target.checked;
            saveSettings(settings);
            this.applySettings();
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
            this.applySettings();
        });

        modal.querySelector("#subscription-panel-hide-on-collapse").addEventListener("change", (e) => {
            const settings = getSettings();
            settings.hideOnCollapse = !!e.target.checked;
            saveSettings(settings);
            this.applySettings();
        });
        modal.querySelector("#subscription-panel-show-onboarding").addEventListener("change", (e) => {
            const settings = getSettings();
            settings.onboardingDone = !e.target.checked;
            saveSettings(settings);
        });
        modal.querySelector("#subscription-panel-use-groups").addEventListener("change", (e) => {
            const settings = getSettings();
            settings.useGroups = !!e.target.checked;
            const subscriptionsHandler = this.subscriptionsPanel.subscriptionsHandler;
            subscriptionsHandler.reload().then(() => {
                this.subscriptionsPanel.addMagazinesToDOM(subscriptionsHandler.subscriptions, true);
            });
            saveSettings(settings);
            this.applySettings();
        });
        modal.querySelector("#subscription-panel-force-mobile").addEventListener("change", (e) => {
            const settings = getSettings();
            settings.forceMobile = !!e.target.checked;
            saveSettings(settings);
            this.applySettings();
        });
        modal.querySelector("#subscription-panel-show-last-clicked").addEventListener("change", (e) => {
            const settings = getSettings();
            settings.showLastClicked = !!e.target.checked;
            const subscriptionsHandler = this.subscriptionsPanel.subscriptionsHandler;
            subscriptionsHandler.reload().then(() => {
                this.subscriptionsPanel.addMagazinesToDOM(subscriptionsHandler.subscriptions, true);
            });
            saveSettings(settings);
            this.applySettings();
        });
    }

    applySettings() {
        const settings = getSettings();
        if (settings?.extendWidth) {
            document.body.classList.add("extend-width");
        } else {
            document.body.classList.remove("extend-width");
        }

        if (settings?.collapsed) {
            this.subscriptionsPanel.collapsePanel();
        } else {
            this.subscriptionsPanel.expandPanel();
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
            this.subscriptionsPanel.closeMobilePanel();
        }

        if (settings?.sticky) {
            document.body.classList.add("subscription-panel-sticky");
        } else {
            document.body.classList.remove("subscription-panel-sticky");
        }

        if (settings?.alternativeMenu) {
            document.body.classList.add("subscription-panel-alternative-menu");
        } else {
            document.body.classList.remove("subscription-panel-alternative-menu");
        }
    }
}

export default SettingsModal;