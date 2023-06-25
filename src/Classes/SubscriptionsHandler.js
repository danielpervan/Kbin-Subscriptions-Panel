import {getSettings} from "../utils";
import Cache from "./Cache";
import Magazine from "./Magazine";
import Item from "./Item";
import Group from "./Group";

class SubscriptionsHandler {
    subscriptions;

    constructor() {
        this.subscriptions = [];
    }

    reload() {
        this.subscriptions = [];
        return this.load(1);
    }

    sort() {
        /** Sort magazines by starred then name */
        this.subscriptions.sort((a, b) => {
            if (a.isStarred() && !b.isStarred()) {
                return -1;
            } else if (!a.isStarred() && b.isStarred()) {
                return 1;
            } else {
                return a.name.localeCompare(b.name);
            }
        })
    }

    append(magazines) {
        const settings = getSettings();
        const useGroups = settings?.useGroups;

        /** Merge the new magazines with the old ones */
        magazines.forEach((mag) => {
                let found = false;
                this.subscriptions.some((sub, index) => {
                    if (sub.type === Item.TYPE.MAGAZINE && mag.type === Item.TYPE.MAGAZINE && sub.url === mag.url) {
                        found = true;
                    } else if (useGroups && sub.name.toLowerCase() === mag.name.toLowerCase()) {
                        if (sub.type === Item.TYPE.GROUP) {
                            sub.magazines.push(mag);
                        } else {
                            this.subscriptions[index] = new Group(sub.name, [sub, mag]);
                        }
                        found = true;
                    }
                    return found;
                });
                if (!found) {
                    this.subscriptions.push(mag);
                }
            }
        );
        this.sort();
        /** Save the subscriptions */
        const cache = new Cache();
        cache.save(this.subscriptions);
    }

    load(page) {
        page = page || 1;
        /** Fetch the subscriptions page */
        const fetchURL = "https://kbin.social/settings/subscriptions/magazines?p=" + page;
        const fetchPromise = fetch(fetchURL)
        return fetchPromise.then((response) => {
            /** Remove the spinner */
            const spinner = document.querySelector("#subscription-panel-spinner");
            if (spinner) {
                spinner.remove();
            }
            return response.text();
        }).then((pageContent) => {
            /** Parse the page */
            let dom = new DOMParser().parseFromString(pageContent, 'text/html');
            let magazinesElements = dom.querySelectorAll(".section.magazines.magazines-columns ul>li");
            let magazines = []
            /** Find subscriptions */
            magazinesElements.forEach((el) => {
                const mag = Magazine.fromElement(el);
                magazines.push(mag);
                /** If this is the current magazine, register the click time */
                const currentMagazine = window.location.pathname.match(/\/m\/(.+?)(\/|$)/);
                if (currentMagazine && currentMagazine[1] === mag.fullName) {
                    mag.registerClickTime();
                }
            });
            this.append(magazines);
            /** Fetch next page */
            let nextPage = dom.querySelector("a.pagination__item.pagination__item--next-page")?.href;
            nextPage = nextPage ? nextPage.match(/p=(\d+)/)[1] : undefined;
            nextPage = nextPage ? parseInt(nextPage) : 1;

            /** Fetch next page if it exists */
            /** Fail safe to prevent infinite loop */
            if (page < nextPage && page < 100) {
                return this.load(page + 1);
            } else {
                return Promise.resolve();
            }
        }).catch((error) => {
            console.error(error);
            document.querySelector("#subscription-panel-content").appendChild(document.createTextNode("Failed to load subscriptions"));
            return Promise.reject(error);
        });
    }

    loadSubscriptions(page, callback) {
        page = page || 1;

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const spinner = document.querySelector("#subscription-panel-spinner");
                if (spinner) {
                    spinner.remove();
                }
                if (xhr.status === 200) {
                    /** Parse the page */
                    let dom = new DOMParser().parseFromString(xhr.responseText, 'text/html');
                    let magazinesElements = dom.querySelectorAll(".section.magazines.magazines-columns ul>li");
                    let magazines = []
                    /** Find subscriptions */
                    magazinesElements.forEach((el) => {
                        const mag = Magazine.fromElement(el);
                        magazines.push(mag);
                        console.log("Checking if we are on the magazine page", window.location.pathname, mag.url);
                        if (window.location && window.location.pathname === mag.url) {
                            console.log("Registering click time");
                            mag.registerClickTime();
                        }
                    });
                    this.append(magazines);
                    /** Fetch next page */
                    let nextPage = dom.querySelector("a.pagination__item.pagination__item--next-page")?.href;
                    nextPage = nextPage ? nextPage.match(/p=(\d+)/)[1] : undefined;
                    nextPage = nextPage ? parseInt(nextPage) : 1;

                    /** Fetch next page if it exists */
                    /** Fail safe to prevent infinite loop */
                    if (page < nextPage && page < 100) {
                        this.loadSubscriptions(page + 1, callback);
                    } else if (callback) {
                        callback(this.subscriptions);
                    }
                } else {
                    document.querySelector("#subscription-panel-content").appendChild(document.createTextNode("Failed to load subscriptions"));
                }
            }
        };
        xhr.open("GET", "/settings/subscriptions/magazines?p=" + page, true);
        xhr.send();
    }
}

export default SubscriptionsHandler;