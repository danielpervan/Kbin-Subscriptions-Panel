export function getSettings() {
    const settings = localStorage.getItem("subscription-panel-settings");
    let settingsObj = {};
    if (settings) {
        settingsObj = JSON.parse(settings);
    }
    /** Set defaults */
    if (settingsObj.useCache === undefined) {
        settingsObj.useCache = true;
    }
    if (settingsObj.useGroups === undefined) {
        settingsObj.useGroups = true;
    }

    if (settingsObj.showLastClicked === undefined) {
        settingsObj.showLastClicked = true;
    }

    return settingsObj;
}

export function saveSettings(settings) {
    localStorage.setItem("subscription-panel-settings", JSON.stringify(settings));
}

export function resetSettings() {
    localStorage.removeItem("subscription-panel-settings");
    localStorage.removeItem("subscription-panel-magazine-data");
}