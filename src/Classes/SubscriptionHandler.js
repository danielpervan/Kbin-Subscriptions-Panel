import {getSettings} from "../utils";
import Cache from "./Cache";

class SubscriptionHandler {
    subscriptions;

    constructor() {
        this.subscriptions = [];
    }

    reload() {
        this.subscriptions = [];
        return this.load(1);
    }

    append(magazines) {
        const settings = getSettings();
        const useGroups = settings?.useGroups;

        /** Merge the new magazines with the old ones */
        magazines.forEach((mag) => {
                let found = false;
                this.subscriptions.some((sub, index) => {
                    if (sub.url === mag.url) {
                        found = true;
                    } else if (useGroups && sub.name.toLowerCase() === mag.name.toLowerCase()) {
                        if (sub?.type === "group") {
                            sub.magazines.push(mag);
                        } else {
                            this.subscriptions[index] = {
                                name: sub.name,
                                fullName: sub.name,
                                type: "group",
                                magazines: [sub, mag]
                            };
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
        /** Sort magazines by name */
        this.subscriptions.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
        /** Save the subscriptions */
        saveCache(this.subscriptions);
    }

    load(page) {
        page = page || 1;
        /** Fetch the subscriptions page */
        const fetchURL = "https://kbin.social/settings/subscriptions/magazines?p=" + page;
        const fetchPromise = fetch(fetchURL)
        return fetchPromise.then((response) => {
            console.log(response);
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
                let magA = el.querySelector("a")
                let mag = {};
                mag.fullName = magA.innerText;
                const instanceName = mag.fullName.match(/@(.*)/);
                mag.instanceName = instanceName ? instanceName[1] : undefined;
                mag.name = mag.fullName.replace(/@(.*)/, "");
                mag.url = magA.href;
                mag.img = el.querySelector("figure img")?.src;
                magazines.push(mag);
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
                        let magA = el.querySelector("a")
                        let mag = {};
                        mag.fullName = magA.innerText;
                        const instanceName = mag.fullName.match(/@(.*)/);
                        mag.instanceName = instanceName ? instanceName[1] : undefined;
                        mag.name = mag.fullName.replace(/@(.*)/, "");
                        mag.url = magA.href;
                        mag.img = el.querySelector("figure img")?.src;
                        magazines.push(mag);
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

export default SubscriptionHandler;