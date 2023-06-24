// ==UserScript==
// @name         Kbin Subscriptions Panel
// @namespace    https://perry.dev
// @license      MIT
// @version      1.8
// @description  Adds a side panel with all magazine subscriptions.
// @author       Daniel Pervan
// @match        https://kbin.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// ==/UserScript==

(function () {
    'use strict';
(()=>{var x=(n,e)=>()=>(n&&(e=n(n=0)),e);var J=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);function p(){let n=localStorage.getItem("subscription-panel-settings"),e={};return n&&(e=JSON.parse(n)),e.useCache===void 0&&(e.useCache=!0),e.useGroups===void 0&&(e.useGroups=!0),e}function m(n){localStorage.setItem("subscription-panel-settings",JSON.stringify(n))}var k=x(()=>{});function T(n){p()?.useCache&&localStorage.setItem("subscription-panel-cache",JSON.stringify(n))}function H(){localStorage.removeItem("subscription-panel-cache")}function I(){if(p()?.useCache){let e=localStorage.getItem("subscription-panel-cache");if(e)return JSON.parse(e)}return[]}var w=x(()=>{k()});function O(n){if(typeof document<"u"){var e=document.createElement("style"),s=document.createTextNode(n);e.appendChild(s),document.head.appendChild(e)}}var G=x(()=>{});var A=x(()=>{G();O('body.extend-width:not(.subscription-panel-force-mobile) .kbin-container{max-width:1620px}.subscription-panel-modal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99;background-color:#00000080;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)}.subscription-panel-modal-content{background-color:var(--kbin-section-bg);border:var(--kbin-options-border);color:var(--kbin-section-text-color);padding:2rem 1rem;height:fit-content;font-size:.8em;position:relative;max-width:600px;min-width:400px;width:100%;animation:modalopen .2s ease-in-out}.subscription-panel-modal-content h1,.subscription-panel-modal-content h2{margin-top:0;text-align:center}.subscription-panel-modal-content .close{color:#aaa;font-size:28px;cursor:pointer;position:absolute;top:.5rem;right:1rem}.subscription-panel-modal-content .close:hover{color:var(--kbin-sidebar-header-text-color)}body.rounded-edges .subscription-panel-modal-content{border-radius:.5rem}body.rounded-edges #subscription-panel-content{border-radius:0 0 .5rem .5rem}#subscription-panel .search-box-container{position:relative}#subscription-panel .search-box-clear{position:absolute;top:.6em;right:1em;font-size:1.5em;display:none;cursor:pointer;transition:color .2s ease-in-out;animation:searchBoxClearShow .25s ease-in-out}@keyframes searchBoxClearShow{0%{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}#subscription-panel .search-box-clear:hover{color:var(--kbin-sidebar-header-text-color)}#subscription-panel .search-box-clear.active{display:block}#subscription-panel-settings-button{position:absolute;top:0;right:0;margin:.5rem;padding:.5rem;color:var(--kbin-section-text-color);font-size:.8em;cursor:pointer;transition:transform .2s ease-in-out}#subscription-panel-settings-button:hover{color:var(--kbin-sidebar-header-text-color);transform:rotate(25deg)}#subscription-panel-settings-button:active{animation:settingsbuttonclick .5s ease-in-out}@keyframes settingsbuttonclick{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.subscription-panel-settings-modal-content{max-width:600px;min-width:400px}.subscription-panel-settings-modal-content ul{list-style:none;padding-inline:0}.subscription-panel-settings-modal-content ul li{margin-bottom:1rem}.subscription-panel-settings-modal-content ul li label{display:block;margin-bottom:.5rem}.subscription-panel-settings-modal-content ul li .description{font-size:.8em;font-weight:100;font-style:italic;opacity:.8}.subscription-panel-settings-modal-content ul li input[type=checkbox]{margin-right:.5rem}.subscription-panel-settings-modal-content h2{margin-top:0}@keyframes modalopen{0%{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}#subscription-panel-collapse-button{position:relative;display:inline-block;right:0;margin:.5rem;padding:.5rem;color:var(--kbin-section-text-color);font-size:.8em;cursor:pointer;transition:transform .2s ease-in-out}body.subscription-panel-collapsed #subscription-panel h3:hover #subscription-panel-collapse-button{transform:translate(2px)}#subscription-panel h3:hover #subscription-panel-collapse-button{color:var(--kbin-sidebar-header-text-color);transform:translate(-2px)}body:not(.subscription-panel-force-mobile) #middle>.kbin-container{grid-template-areas:"subscription-panel main sidebar";grid-template-columns:minmax(200px,1fr) 3fr 1fr}body.subscription-panel-collapsed:not(.subscription-panel-force-mobile) #middle>.kbin-container{grid-template-columns:minmax(100px,120px) 3fr 1fr}body.subscription-panel-collapsed.sidebar-left:not(.subscription-panel-force-mobile) #middle>.kbin-container{grid-template-columns:1fr 3fr minmax(100px,120px)}body.subscription-panel-collapsed #middle>.kbin-container #subscription-panel li{font-size:.8em}body.subscription-panel-collapsed #middle>.kbin-container #subscription-panel li.no-image{padding-left:1.8em}body.subscription-panel-collapsed #middle>.kbin-container #subscription-panel .search-box-container{display:none}body.subscription-panel-collapsed.subscription-panel-hide-on-collapse #middle>.kbin-container #subscription-panel ul{display:none}body:not(.subscription-panel-force-mobile) .sidebar-left #middle>.kbin-container{grid-template-areas:"sidebar main subscription-panel";grid-template-columns:1fr 3fr minmax(200px,1fr)}body.subscription-panel-collapsed:not(.subscription-panel-force-mobile) .sidebar-left #middle>.kbin-container{grid-template-columns:1fr 3fr minmax(100px,120px)}#subscription-panel-content{background-color:var(--kbin-section-bg);border:var(--kbin-options-border);color:var(--kbin-section-text-color);margin-bottom:.5rem;padding:2rem 1rem;height:fit-content;font-size:.8em;margin-right:.5rem;position:relative}#subscription-panel h3{border-bottom:var(--kbin-sidebar-header-border);color:var(--kbin-sidebar-header-text-color);font-size:.8rem;margin:0 0 1rem;text-transform:uppercase;width:100%}#subscription-panel ul{list-style:none;line-height:2.5em;padding-inline:0}#subscription-panel ul.loading li{animation:none}#subscription-panel ul li{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;animation:showItem .5s ease-in-out}#subscription-panel ul li.hideItem{animation:hideItem .25s ease-in-out;animation-fill-mode:forwards}#subscription-panel ul li a img{height:1.4em;margin-right:.5em;border-radius:50%;vertical-align:middle}#subscription-panel ul li.no-image{padding-left:1.9em}#subscription-panel ul li.group{font-weight:700}#subscription-panel ul li.group a.group-name .name{margin-left:.5em}#subscription-panel ul li.group a.group-name .count{margin-left:.25em;font-weight:400;opacity:.8}#subscription-panel ul li.group a.group-name .image{font-size:1.2em;vertical-align:middle;width:1.2em}#subscription-panel ul li.group ul{margin-left:.75em;padding-left:.75em;border-left:var(--kbin-sidebar-header-border);border-bottom:var(--kbin-sidebar-header-border);width:fit-content;border-bottom-left-radius:.5rem;display:none}#subscription-panel ul li.group ul li{font-weight:400}#subscription-panel ul li.group.open ul{animation:openGroup .25s ease-in-out;display:block}#subscription-panel .instance-name{opacity:.8;font-weight:100}@keyframes openGroup{0%{transform:translateY(-.5em);opacity:0}to{transform:translateY(0);opacity:1}}#subscription-panel-spinner{text-align:center;font-size:2em}@keyframes showItem{0%{opacity:0}to{opacity:1}}@keyframes hideItem{0%{opacity:1;max-height:2.5em}to{opacity:0;max-height:0}}#header menu li a.subscription-panel-mobile-button{display:none}@keyframes showMobileSubscriptionPanelUL{0%{transform:translateY(-2em)}to{transform:translateY(0)}}@keyframes showMobileSubscriptionPanel{0%{opacity:0}to{opacity:1}}body.subscription-panel-open{overflow:hidden}body.subscription-panel-open.subscription-panel-force-mobile #middle>.kbin-container #subscription-panel{height:100%;left:0;width:100%;overflow:hidden;position:fixed;z-index:2;top:0;border-radius:0!important;border:none;margin:0;background:RGBA(0,0,0,.5);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center}body.subscription-panel-open.subscription-panel-force-mobile #middle>.kbin-container #subscription-panel #subscription-panel-content{height:100%;overflow:auto;padding:1em 10em;padding-bottom:100px!important;position:fixed;top:49px;width:fit-content;margin:2em 0 0;animation:showMobileSubscriptionPanel .2s ease-out}body.subscription-panel-open.subscription-panel-force-mobile #middle>.kbin-container #subscription-panel ul{animation:showMobileSubscriptionPanelUL .2s ease-out}body.subscription-panel-open.rounded-edges #middle>.kbin-container #subscription-panel-content{border-radius:.5rem}body.subscription-panel-open #header menu li a.subscription-panel-mobile-button{border-bottom:var(--kbin-header-hover-border)}#header menu li a.subscription-panel-mobile-button{font-size:0;cursor:pointer;transition:border-bottom .2s ease-in-out}body.subscription-panel-force-mobile #header menu li a.subscription-panel-mobile-button{display:block}body.subscription-panel-force-mobile #subscription-panel-collapse-button{display:none}a.subscription-panel-mobile-button i{font-size:.85rem}@media (max-width: 991.98px){#header menu li a.subscription-panel-mobile-button{display:block}body #middle>.kbin-container,body.subscription-panel-collapsed #middle>.kbin-container{grid-template-areas:"main main" "subscription-panel subscription-panel" "sidebar sidebar"!important;grid-template-columns:1fr!important}body.subscription-panel-open #middle>.kbin-container #subscription-panel{height:100%;top:0;left:0;position:fixed;width:100%;z-index:2;margin:0;animation:showMobileSubscriptionPanel .2s ease-out}body.subscription-panel-open #middle>.kbin-container #subscription-panel #subscription-panel-content{height:100%;left:0;padding:2em 2em 100px!important;width:100%!important;border-radius:0!important;border:none;top:49px!important;margin:0!important;overflow:auto}body.subscription-panel-open #middle>.kbin-container #subscription-panel ul{animation:showMobileSubscriptionPanelUL .2s ease-out}#subscription-panel-collapse-button{display:none}#subscription-panel-settings-button{right:1em}}@media (hover: none){#header menu li a.subscription-panel-mobile-button:hover{border-bottom:3px solid transparent}}@media (pointer: coarse){#subscription-panel-settings-button{font-size:1.2em}}.subscription-panel-onboarding .subscription-panel-onboarding-content{max-width:800px}.subscription-panel-onboarding-next{margin-top:1em;font-size:2em;text-align:center;display:block}')});var L,B,D=x(()=>{k();w();L=class{subscriptions;constructor(){this.subscriptions=[]}reload(e){this.subscriptions=[],this.loadSubscriptions(1,e)}append(e){let t=p()?.useGroups;e.forEach(i=>{let r=!1;this.subscriptions.some((o,c)=>(o.url===i.url?r=!0:t&&o.name.toLowerCase()===i.name.toLowerCase()&&(o?.type==="group"?o.magazines.push(i):this.subscriptions[c]={name:o.name,fullName:o.name,type:"group",magazines:[o,i]},r=!0),r)),r||this.subscriptions.push(i)}),this.subscriptions.sort((i,r)=>i.name.localeCompare(r.name)),T(this.subscriptions)}loadSubscriptions(e,s){e=e||1;let t=new XMLHttpRequest;t.onreadystatechange=()=>{if(t.readyState===4){let i=document.querySelector("#subscription-panel-spinner");if(i&&i.remove(),t.status===200){let r=new DOMParser().parseFromString(t.responseText,"text/html"),o=r.querySelectorAll(".section.magazines.magazines-columns ul>li"),c=[];o.forEach(a=>{let h=a.querySelector("a"),u={};u.fullName=h.innerText;let y=u.fullName.match(/@(.*)/);u.instanceName=y?y[1]:void 0,u.name=u.fullName.replace(/@(.*)/,""),u.url=h.href,u.img=a.querySelector("figure img")?.src,c.push(u)}),this.append(c);let l=r.querySelector("a.pagination__item.pagination__item--next-page")?.href;l=l?l.match(/p=(\d+)/)[1]:void 0,l=l?parseInt(l):1,e<l&&e<100?this.loadSubscriptions(e+1,s):s&&s(this.subscriptions)}else document.querySelector("#subscription-panel-content").appendChild(document.createTextNode("Failed to load subscriptions"))}},t.open("GET","/settings/subscriptions/magazines?p="+e,!0),t.send()}},B=L});var V=J(()=>{k();w();A();D();var _=new B;function F(){if(document.querySelector(".login").href.endsWith("/login"))return;let e=document.querySelector("#middle > .kbin-container"),s=document.createElement("div");s.id="subscription-panel";let t=document.createElement("aside"),i=document.createElement("ul");i.className="loading";let r=document.createElement("h3");t.id="subscription-panel-content",r.innerHTML='<span class="subscription-panel-header">Subscriptions</span>',t.appendChild(r),s.appendChild(t),e.appendChild(s);let o=document.createElement("input");o.type="text",o.id="subscription-panel-search",o.placeholder="Filter",o.addEventListener("input",b=>{let S=b.target.value.toLowerCase();if(S.length===0){i.querySelectorAll("li").forEach(d=>{if(d.classList.remove("hideItem"),d.classList.contains("open")){d.classList.remove("open");let v=d.querySelector("i");v.classList.remove("fa-box-open"),v.classList.add("fa-box")}});return}i.querySelectorAll("li").forEach(d=>{let v=d.querySelector("a"),N=d.querySelectorAll("li");if(v.innerText.toLowerCase().indexOf(S)>-1)d.classList.remove("hideItem");else{let M=!1;N?.length>0&&N.forEach(Y=>{if(Y.innerText.toLowerCase().indexOf(S)>-1){d.classList.remove("hideItem"),M=!0,d.classList.add("open");let P=d.querySelector("i");P.classList.remove("fa-box"),P.classList.add("fa-box-open")}}),M||d.classList.add("hideItem")}})});let c=document.createElement("span");c.className="search-box-clear",c.innerHTML='<i class="fa-solid fa-times"></i>',c.addEventListener("click",()=>{o.value="",o.dispatchEvent(new Event("input"))}),o.addEventListener("input",()=>{o.value.length>0?c.classList.add("active"):c.classList.remove("active")}),o.addEventListener("keydown",b=>{b.key==="Escape"&&(o.value="",o.dispatchEvent(new Event("input")))});let l=document.createElement("div");l.className="search-box-container",l.appendChild(o),l.appendChild(c),t.appendChild(l);let a=document.createElement("div");a.id="subscription-panel-settings-button",a.title="Settings",a.ariaLabel="Settings",a.innerHTML='<i class="fa-solid fa-cog"></i>',a.addEventListener("click",()=>{E()}),t.appendChild(a);let h=document.createElement("span");h.id="subscription-panel-collapse-button",h.title="Hide Subscriptions",h.ariaLabel="Hide Subscriptions",h.innerHTML='<i class="fa-solid fa-chevron-left"></i>',r.addEventListener("click",()=>{R()}),r.appendChild(h);let u=document.querySelector(".kbin-container > menu"),y=document.createElement("li"),f=document.createElement("a");f.className="subscription-panel-mobile-button",f.title="Subscriptions",f.ariaLabel="Subscriptions",f.href="#",f.innerHTML='<i class="fa-solid fa-newspaper"></i>',f.addEventListener("click",b=>{X(),b.preventDefault()}),y.appendChild(f),u.insertBefore(y,u.firstChild),s.addEventListener("click",b=>{b.target===s&&document.body.classList.contains("subscription-panel-open")&&document.body.classList.contains("subscription-panel-force-mobile")&&q()}),t.appendChild(i);let z=I();if(z.length>0)C(z);else{let b=document.createElement("div");b.id="subscription-panel-spinner",b.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>',t.appendChild(b)}_.loadSubscriptions(1,C)}function W(n,e){let s=document.createElement("li"),t=document.createElement("a");if(t.href=n.url,t.title=n.fullName,n.img){let r=document.createElement("img");r.src=n.img,t.appendChild(r)}else s.classList.add("no-image");let i=document.createElement("span");if(i.className="name",i.appendChild(document.createTextNode(n.name)),t.appendChild(i),n.instanceName){let r=document.createElement("span");r.className="instance-name",r.appendChild(document.createTextNode("@"+n.instanceName)),t.appendChild(r)}s.appendChild(t),e.appendChild(s)}function C(n){let e=document.querySelector("#subscription-panel ul");e.innerHTML="",n.forEach(s=>{if(s?.type==="group"){let t=document.createElement("li");t.classList.add("group");let i=document.createElement("a");i.className="group-name",i.href="#",i.title=s.fullName,i.ariaLabel=s.fullName,i.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),t.classList.toggle("open");let c=i.querySelector("i");t.classList.contains("open")?(i.setAttribute("aria-expanded","true"),c.classList.remove("fa-box"),c.classList.add("fa-box-open")):(i.setAttribute("aria-expanded","false"),c.classList.remove("fa-box-open"),c.classList.add("fa-box"))}),i.innerHTML='<i class="fa-solid fa-box image"></i><span class="name">'+s.name+'</span><span class="count">('+s.magazines.length+")</span>",t.appendChild(i);let r=document.createElement("ul");s.magazines.forEach(o=>{W(o,r)}),t.appendChild(r),e.appendChild(t)}else W(s,e)})}function E(){let n=p(),e=document.createElement("div");e.className="subscription-panel-settings-modal subscription-panel-modal",e.innerHTML=`
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
        `,document.body.appendChild(e);let s=e.querySelector("#subscription-panel-extend-width");n?.extendWidth&&(s.checked=!0);let t=e.querySelector("#subscription-panel-hide-on-collapse");n?.hideOnCollapse&&(t.checked=!0);let i=e.querySelector("#subscription-panel-use-cache");n?.useCache&&(i.checked=!0);let r=e.querySelector("#subscription-panel-show-onboarding");n?.onboardingDone&&(r.checked=!1);let o=e.querySelector("#subscription-panel-force-mobile");n?.forceMobile&&(o.checked=!0);let c=e.querySelector("#subscription-panel-use-groups");n?.useGroups&&(c.checked=!0),e.querySelector(".subscription-panel-settings-modal .close").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",l=>{l.target===e&&e.remove()}),e.querySelector("#subscription-panel-extend-width").addEventListener("change",l=>{let a=p();a.extendWidth=!!l.target.checked,m(a),g()}),e.querySelector("#subscription-panel-use-cache").addEventListener("change",l=>{let a=p();l.target.checked?a.useCache=!0:(a.useCache=!1,H()),m(a),g()}),e.querySelector("#subscription-panel-hide-on-collapse").addEventListener("change",l=>{let a=p();a.hideOnCollapse=!!l.target.checked,m(a),g()}),e.querySelector("#subscription-panel-show-onboarding").addEventListener("change",l=>{let a=p();a.onboardingDone=!l.target.checked,m(a)}),e.querySelector("#subscription-panel-use-groups").addEventListener("change",l=>{let a=p();a.useGroups=!!l.target.checked,_.reload(C),m(a),g()}),e.querySelector("#subscription-panel-force-mobile").addEventListener("change",l=>{let a=p();a.forceMobile=!!l.target.checked,m(a),g()})}function g(){let n=p();n?.extendWidth?document.body.classList.add("extend-width"):document.body.classList.remove("extend-width"),n?.collapsed?j():U(),n?.hideOnCollapse?document.body.classList.add("subscription-panel-hide-on-collapse"):document.body.classList.remove("subscription-panel-hide-on-collapse"),n?.forceMobile?document.body.classList.add("subscription-panel-force-mobile"):(document.body.classList.remove("subscription-panel-force-mobile"),q())}function R(){let n=p();document.body.classList.contains("subscription-panel-collapsed")?(U(),n.collapsed=!1):j()&&(n.collapsed=!0),m(n)}function j(){if(window.innerWidth<=991.98||document.body.classList.contains("subscription-panel-force-mobile"))return!1;document.body.classList.contains("sidebar-left")?document.querySelector("#subscription-panel-collapse-button i").className="fa-solid fa-chevron-left":document.querySelector("#subscription-panel-collapse-button i").className="fa-solid fa-chevron-right";let n=document.querySelector("#subscription-panel-collapse-button");return n.title="Show subscriptions",n.ariaLabel="Show subscriptions",document.querySelector(".subscription-panel-header").innerText="Subs",document.body.classList.add("subscription-panel-collapsed"),!0}function U(){document.body.classList.contains("sidebar-left")?document.querySelector("#subscription-panel-collapse-button i").className="fa-solid fa-chevron-right":document.querySelector("#subscription-panel-collapse-button i").className="fa-solid fa-chevron-left";let n=document.querySelector("#subscription-panel-collapse-button");return n.title="Hide subscriptions",n.ariaLabel="Hide subscriptions",document.querySelector(".subscription-panel-header").innerText="Subscriptions",document.body.classList.remove("subscription-panel-collapsed"),!0}function X(){document.body.classList.contains("subscription-panel-open")?q():K()}function K(){document.body.classList.add("subscription-panel-open"),document.body.classList.contains("fixed-navbar")||window.scrollTo(0,0)}function q(){document.body.classList.remove("subscription-panel-open")}function Q(){let n=p();if(n?.onboardingDone)return;n.onboardingDone=!0,m(n);let e=document.createElement("div");e.className="subscription-panel-onboarding subscription-panel-modal",e.innerHTML=`
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
        `,e.querySelector(".subscription-panel-onboarding-close").addEventListener("click",()=>{e.remove()}),e.querySelector(".subscription-panel-onboarding-next").addEventListener("click",()=>(e.remove(),E(),!1)),e.addEventListener("click",s=>{s.target===e&&(e.remove(),E())}),document.body.appendChild(e)}F();g();Q()});V();})();
})();
