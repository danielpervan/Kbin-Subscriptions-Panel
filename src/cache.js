import {getSettings} from "./utils";

export function saveCache(cache) {
    const settings = getSettings();
    if (settings?.useCache) {
        localStorage.setItem("subscription-panel-cache", JSON.stringify(cache));
    }
}

export function removeCache() {
    localStorage.removeItem("subscription-panel-cache");
}

export function getCache() {
    const settings = getSettings();
    if (settings?.useCache) {
        const cache = localStorage.getItem("subscription-panel-cache");
        if (cache) {
            return JSON.parse(cache);
        }
    }
    return [];
}