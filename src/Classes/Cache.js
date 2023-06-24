import {getSettings} from "../utils";

class Cache {
    constructor() {
    }
    save(cache) {
        const settings = getSettings();
        if (settings?.useCache) {
            localStorage.setItem("subscription-panel-cache", JSON.stringify(cache));
        }
    }

    remove() {
        localStorage.removeItem("subscription-panel-cache");
    }

    get() {
        const settings = getSettings();
        if (settings?.useCache) {
            const cache = localStorage.getItem("subscription-panel-cache");
            if (cache) {
                return JSON.parse(cache);
            }
        }
        return [];
    }
}
export default Cache;
