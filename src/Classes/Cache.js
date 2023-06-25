import {getSettings} from "../utils";
import Group from "./Group";
import Magazine from "./Magazine";
import Item from "./Item";

class Cache {
    constructor() {
        localStorage.removeItem("subscription-panel-cache");
    }

    save(cache) {
        const settings = getSettings();
        let cacheWrapper = {
            cache: cache,
            timestamp: Date.now(),
            version: 1
        }
        if (settings?.useCache) {
            localStorage.setItem("subscription-panel-item-cache", JSON.stringify(cacheWrapper));
        }
    }

    remove() {
        localStorage.removeItem("subscription-panel-item-cache");
    }

    parseItem(item) {
        if (item.type === Item.TYPE.MAGAZINE) {
            return new Magazine(item.fullName, item.url, item.icon);
        } else if (item.type === Item.TYPE.GROUP) {
            let magazines = [];
            item.magazines.forEach((mag) => {
                magazines.push(this.parseItem(mag));
            });
            return new Group(item.fullName, magazines);
        }
    }

    get() {
        const settings = getSettings();
        if (settings?.useCache) {
            const cache = localStorage.getItem("subscription-panel-item-cache");
            if (cache) {
                let cacheWrapper = JSON.parse(cache);
                if (cacheWrapper.version === 1) {
                    let output = [];
                    cacheWrapper.cache.forEach((item) => {
                        output.push(this.parseItem(item));
                    });
                    return output;
                } else {
                    this.remove();
                    return [];
                }
            }
        }
        return [];
    }
}

export default Cache;
