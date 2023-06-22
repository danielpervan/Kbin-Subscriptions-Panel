// ==UserScript==
// @name         Kbin Subscriptions Panel
// @namespace    https://perry.dev
// @license      MIT
// @version      1.1
// @description  Adds a side panel with all magazine subscriptions.
// @author       Daniel Pervan
// @match        https://kbin.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// ==/UserScript==

(function () {

    'use strict';
    function addSubscriptionsSidePanel() {
        const loginElement = document.querySelector(".login");
        if (loginElement.href.endsWith("/login")) {
            return;
        }

        addStyle(`
        body.extend-width:not(.subscription-panel-force-mobile) .kbin-container {
            max-width: 1620px;
        }

        .subscription-panel-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
        }

        .subscription-panel-modal-content {
            background-color: var(--kbin-section-bg);
            border: var(--kbin-options-border);
            color: var(--kbin-section-text-color);
            padding: 2rem 1rem;
            height: fit-content;
            font-size: 0.8em;
            position: relative;
            max-width: 600px;
            min-width: 400px;
            width: 100%;
            animation: modalopen 0.2s ease-in-out;
        }

        body.rounded-edges .subscription-panel-modal-content {
            border-radius: 0.5rem;
        }

        .subscription-panel-modal-content h1, .subscription-panel-modal-content h2 {
            margin-top: 0;
            text-align: center;
        }

        .subscription-panel-modal-content .close {
            color: #aaa;
            font-size: 28px;
            cursor: pointer;
            position: absolute;
            top: 0.5rem;
            right: 1rem;
        }

        .subscription-panel-modal-content .close:hover {
            color: color: var(--kbin-sidebar-header-text-color);
        }

        #subscription-panel-settings-button {
            position: absolute;
            top: 0;
            right: 0;
            margin: 0.5rem;
            padding: 0.5rem;
            color: var(--kbin-section-text-color);
            font-size: 0.8em;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
        }

        #subscription-panel-settings-button:hover {
            color: var(--kbin-sidebar-header-text-color);
            transform: rotate(25deg);
        }

        #subscription-panel-settings-button:active {
            animation: settingsbuttonclick 0.5s ease-in-out;
        }

        @keyframes settingsbuttonclick {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .subscription-panel-settings-modal-content {
            max-width: 600px;
            min-width: 400px;
        }

        .subscription-panel-settings-modal-content ul {
            list-style: none;
            padding-inline: 0;
        }

        .subscription-panel-settings-modal-content ul li {
            margin-bottom: 1rem;
        }

        .subscription-panel-settings-modal-content ul li label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .subscription-panel-settings-modal-content ul li .description {
            font-size: 0.8em;
            font-weight: 100;
            font-style: italic;
            opacity: 0.8;
        }

        .subscription-panel-settings-modal-content ul li input[type="checkbox"] {
            margin-right: 0.5rem;
        }

        @keyframes modalopen {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1
                transform: scale(1);
            }
        }

        .subscription-panel-settings-modal-content h2 {
            margin-top: 0;
        }

        #subscription-panel-collapse-button {
            position: relative;
            display: inline-block;
            right: 0;
            margin: 0.5rem;
            padding: 0.5rem;
            color: var(--kbin-section-text-color);
            font-size: 0.8em;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
        }

        body.subscription-panel-collapsed h3:hover #subscription-panel-collapse-button {
            transform: translateX(2px);
        }

        h3:hover #subscription-panel-collapse-button {
            color: var(--kbin-sidebar-header-text-color);
            transform: translateX(-2px);
        }

        body:not(.subscription-panel-force-mobile) #middle > .kbin-container {
            grid-template-areas: "subscription-panel main sidebar";
            grid-template-columns: minmax(200px, 1fr) 3fr 1fr;
        }

        body.subscription-panel-collapsed:not(.subscription-panel-force-mobile) #middle > .kbin-container {
            grid-template-columns: minmax(100px, 120px) 3fr 1fr;
        }

        body.subscription-panel-collapsed.sidebar-left:not(subscription-panel-force-mobile) #middle > .kbin-container {
            grid-template-columns: 1fr 3fr minmax(100px, 120px);
        }

        body.subscription-panel-collapsed #middle > .kbin-container #subscription-panel li.no-image {
            padding-left: 1.8;
        }

        body.subscription-panel-collapsed #middle > .kbin-container #subscription-panel input {
            display: none;
        }

        body.subscription-panel-collapsed #middle > .kbin-container #subscription-panel li {
            font-size: 0.8em;
        }

        body.subscription-panel-collapsed.subscription-panel-hide-on-collapse #middle > .kbin-container #subscription-panel ul {
            display: none;
        }

        body:not(.subscription-panel-force-mobile) .sidebar-left #middle > .kbin-container {
            grid-template-areas: "sidebar main subscription-panel";
            grid-template-columns: 1fr 3fr minmax(200px, 1fr);
        }

        body.subscription-panel-collapsed:not(.subscription-panel-force-mobile) .sidebar-left #middle > .kbin-container {
            grid-template-columns: 1fr 3fr minmax(100px, 120px);
        }
    
        #subscription-panel {
            
        }

        body.rounded-edges #subscription-panel-content {
            border-radius: 0 0 .5rem .5rem;
        }

        #subscription-panel-content {
            background-color: var(--kbin-section-bg);
            border: var(--kbin-options-border);
            color: var(--kbin-section-text-color);
            margin-bottom: .5rem;
            padding: 2rem 1rem;
            height: fit-content;
            font-size: 0.8em;
            margin-right: 0.5rem;
            position: relative;
        }
    
        #subscription-panel h3 {
            border-bottom: var(--kbin-sidebar-header-border);
            color: var(--kbin-sidebar-header-text-color);
            font-size: .8rem;
            margin: 0 0 1rem;
            text-transform: uppercase;
            width: 100%;
        }
    
        #subscription-panel ul {
            list-style: none;
            line-height: 2.5em;
            padding-inline: 0;
        }

        #subscription-panel ul.loading li {
            animation: none;
        }

        #subscription-panel ul li {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            animation: showItem 0.5s ease-in-out;
        }

        #subscription-panel ul li.hideItem {
            animation: hideItem 0.25s ease-in-out;
            animation-fill-mode: forwards;
        }
    
        #subscription-panel ul li a img {
            height: 1.4em;
            margin-right: .5em;
            border-radius: 50%;
            vertical-align: middle;
        }
    
        #subscription-panel ul li.no-image {
            padding-left: 1.9em;
        }

        #subscription-panel .instance-name {
            opacity: 0.8;
            font-weight: 100;
        }
    
        #subscription-panel-spinner {
            text-align: center;
            font-size: 2em;
        }

        @keyframes showItem {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        @keyframes hideItem {
            0% {
                opacity: 1;
                max-height: 2.5em;
            }
            100% {
                opacity: 0;
                max-height: 0;                
            }
        }


        /** Mobile */

        #header menu li a.subscription-panel-mobile-button {
            display: none;
        }

        @keyframes showMobileSubscriptionPanelUL {
            0% {
                transform: translateY(-2em);
            }
            100% {
                transform: translateY(0);
            }
        }

        @keyframes showMobileSubscriptionPanel {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        body.subscription-panel-force-mobile.subscription-panel-open #middle > .kbin-container #subscription-panel {
            height: 100%;
            left: 0;
            width: 100%;
            overflow: hidden;
            position: fixed;
            top: 49px;
            z-index: 98;
            border-radius: 0 !important;
            border: none;
            margin: 0;
            background: RGBA(0,0,0,0.5);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        body.subscription-panel-force-mobile.subscription-panel-open #middle > .kbin-container #subscription-panel-content {
            height: 100%;
            top: 1em;
            overflow: auto;
            padding: 1em 10em;
            padding-bottom: 100px!important;
            position: fixed;
            width: fit-content;
            z-index: 98;
            margin: 0;
            animation: showMobileSubscriptionPanel 0.2s ease-out;
        }

        body.subscription-panel-force-mobile.subscription-panel-open.rounded-edges #middle > .kbin-container #subscription-panel-content {
            border-radius: 0.5rem;
        }

        body.subscription-panel-force-mobile.#subscription-panel-collapse-button {
            display: none;
        }

        body.subscription-panel-force-mobile.subscription-panel-open #middle > .kbin-container #subscription-panel ul {
            animation: showMobileSubscriptionPanelUL 0.2s ease-out;
        }

        #header menu li a.subscription-panel-mobile-button {
            font-size: 0;
            cursor: pointer;
            transition: border-bottom 0.2s ease-in-out;
        }

        body.subscription-panel-force-mobile #header menu li a.subscription-panel-mobile-button {
            display: block;
        }

        a.subscription-panel-mobile-button i {
            font-size: medium;
        }

        body.subscription-panel-open #header menu li a.subscription-panel-mobile-button {
            border-bottom: var(--kbin-header-hover-border);
        }

        body.subscription-panel-force-mobile #subscription-panel-collapse-button {
            display: none;
        }

        @media (max-width: 991.98px) {
            #header menu li a.subscription-panel-mobile-button {
                display: block;
            }

            body #middle > .kbin-container, body.subscription-panel-collapsed #middle > .kbin-container {
                grid-template-areas: "main main" "subscription-panel subscription-panel" "sidebar sidebar" !important;
                grid-template-columns: 1fr !important;
            }

            body.subscription-panel-open #middle > .kbin-container #subscription-panel {
                height: 100%;
                left: 0;
                position: fixed;
                width: 100%;
                z-index: 98;
                margin: 0;
                animation: showMobileSubscriptionPanel 0.2s ease-out;
            }

            body.subscription-panel-open #middle > .kbin-container #subscription-panel-content {
                height: 100%;
                left: 0;
                padding: 2em !important;
                padding-bottom: 100px !important;
                width: 100% !important;
                border-radius: 0 !important;
                border: none;
                top: 0 !important;
                margin: 0;
                overflow: auto;

            }

            body.subscription-panel-open #middle > .kbin-container #subscription-panel ul {
                animation: showMobileSubscriptionPanelUL 0.2s ease-out;
            }

            #subscription-panel-collapse-button {
                display: none;
            }

            #subscription-panel-settings-button {
                right: 1em;
            }
        }

        /** Touch devices */
        @media (hover: none) {
            #header menu li a.subscription-panel-mobile-button:hover {
                border-bottom: 3px solid transparent;
            }
        }

        @media (pointer: coarse) {
            #subscription-panel-settings-button {
                font-size: 1.2em;
            }
        }

    

        /** Onboarding */

        .subscription-panel-onboarding .subscription-panel-onboarding-content {
            max-width: 800px;
        }

        .subscription-panel-onboarding-next {
            margin-top: 1em;
            font-size: 2em;
            text-align: center;
            display: block;
        }
        `);

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
        searchBox.placeholder = "Filter";
        searchBox.addEventListener("input", (e) => {
            let filter = e.target.value.toLowerCase();
            magazinePanelUl.querySelectorAll("li").forEach((li) => {
                let a = li.querySelector("a");
                if (a.innerText.toLowerCase().indexOf(filter) > -1) {
                    li.classList.remove("hideItem");
                } else {
                    li.classList.add("hideItem");
                }
            });
        });
        magazinePanel.appendChild(searchBox);

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
        mobileButton.innerHTML = '<i class="fa-solid fa-newspaper"></i>';
        mobileButton.addEventListener("click", () => {
            toggleOpenMobilePanel();
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

        let spinner;
        let cache = getCache();
        if (cache.length > 0) {
            addMagazines(cache);
        } else {
            /** Add spinner */
            let spinner = document.createElement("div");
            spinner.id = "subscription-panel-spinner";
            spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            magazinePanel.appendChild(spinner);
        }
        /** Fetch subscription page */
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/settings/subscriptions/magazines", true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (spinner) {
                    spinner.remove();
                }
                if (this.status === 200) {
                    /** Parse the page */
                    let dom = new DOMParser().parseFromString(this.responseText, 'text/html');
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
                    saveCache(magazines);
                    addMagazines(magazines);

                } else {
                    magazinePanel.appendChild(document.createTextNode("Failed to load subscriptions"));
                }
            }
        };
        xhr.send();
    }

    function addMagazines(magazines) {
        const magazinePanelUl = document.querySelector("#subscription-panel ul");
        magazinePanelUl.innerHTML = "";
        /** Sort magazines by name */
        magazines.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })

        magazines.forEach(mag => {
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
            magazinePanelUl.appendChild(li);
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
                removeCache();
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
        }
        );
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

    function getSettings() {
        const settings = localStorage.getItem("subscription-panel-settings");
        let settingsObj = {};
        if (settings) {
            settingsObj = JSON.parse(settings);
        }
        return settingsObj;
    }

    function saveSettings(settings) {
        localStorage.setItem("subscription-panel-settings", JSON.stringify(settings));
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
    }

    function closeMobilePanel() {
        document.body.classList.remove("subscription-panel-open");
    }

    function addStyle(style) {
        const styleEl = document.createElement("style");
        styleEl.innerHTML = style;
        document.head.appendChild(styleEl);
    }

    function saveCache(cache) {
        const settings = getSettings();
        if (settings?.useCache) {
            localStorage.setItem("subscription-panel-cache", JSON.stringify(cache));
        }
    }

    function removeCache() {
        localStorage.removeItem("subscription-panel-cache");
    }

    function getCache() {
        const settings = getSettings();
        if (settings?.useCache) {
            const cache = localStorage.getItem("subscription-panel-cache");
            if (cache) {
                return JSON.parse(cache);
            }
        }
        return [];
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
            <p>Please take a few seconds to review the settings in the next step. You can also do this later if you want.</p>
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
})();
