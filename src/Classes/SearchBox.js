import Magazine from "./Magazine";

class SearchBox {
    #element
    #containerElement
    panelElement;
    searchQuery = "";
    #editMode = false;
    constructor(subscriptionsHandler, panelElement) {
        this.subscriptionsHandler = subscriptionsHandler;
        this.panelElement = panelElement;
    }

    clear() {
        this.doSearch("");
        this.#containerElement.querySelector(".search-box-clear")?.classList.remove("active");
    }

    set editMode(editMode) {
        this.#editMode = !!editMode;
        this.doSearch(this.searchQuery);
    }
    get editMode() {
        return this.#editMode;
    }

    doSearch(filter) {
        filter = filter.trim();
        this.searchQuery = filter;
        this.#element.value = filter;
        let lastClickedContainer = this.panelElement.querySelector(".last-clicked-container");
        if (filter.length > 0) {
            this.#containerElement.querySelector(".search-box-clear")?.classList.add("active");
        } else {
            lastClickedContainer.classList.remove("hideItem");
            this.subscriptionsHandler.subscriptions.forEach(mag => {
                if (mag.type === Magazine.TYPE.GROUP) {
                    mag.showAll();
                    if (!this.editMode) {
                        mag.close();
                    } else {
                        mag.open();
                    }
                } else {
                    mag.show();
                }
            });
            return;
        }
        filter = filter.toLowerCase();
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
    }

    getElement() {
        if (this.#element) {
            return this.#element;
        }
        const searchBox = document.createElement("input");
        this.#element = searchBox;
        searchBox.type = "text";
        searchBox.id = "subscription-panel-search";
        searchBox.placeholder = "Filter";
        searchBox.addEventListener("input", (e) => {
            this.doSearch(e.target.value);
        });

        const searchBoxClear = document.createElement("span");
        searchBoxClear.className = "search-box-clear";
        searchBoxClear.innerHTML = '<i class="fa-solid fa-times"></i>';
        searchBoxClear.addEventListener("click", () => {
            this.clear();
        });

        searchBox.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.clear();
                searchBox.blur();
            }
        });

        const searchBoxContainer = document.createElement("div");
        this.#containerElement = searchBoxContainer;
        searchBoxContainer.className = "search-box-container";
        searchBoxContainer.appendChild(searchBox);
        searchBoxContainer.appendChild(searchBoxClear);

        return searchBoxContainer;
    }
}

export default SearchBox;