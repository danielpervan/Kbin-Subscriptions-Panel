import {getSettings, saveSettings} from "../utils";

class OnboardingModal {
    modalElement;
    constructor() {
    }

    init() {
        const settings = getSettings();
        if (!settings?.onboardingDone) {
            settings.onboardingDone = true;
            saveSettings(settings);
            this.show();
        }
    }

    close() {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
    }

    show() {
        const onboarding = document.createElement("div");
        this.modalElement = onboarding;
        onboarding.className = "subscription-panel-onboarding subscription-panel-modal";
        onboarding.innerHTML = `
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
        `;
        onboarding.querySelector(".subscription-panel-onboarding-close").addEventListener("click", (e) => {
            this.close();
            e.preventDefault()
        });

        onboarding.querySelector(".subscription-panel-onboarding-next").addEventListener("click", (e) => {
            this.close();
            window.dispatchEvent(new Event("open-subscriptions-panel-settings"));
            e.preventDefault()
        });

        onboarding.addEventListener("click", (e) => {
            if (e.target === onboarding) {
                this.close();
                window.dispatchEvent(new Event("open-subscriptions-panel-settings"));
                e.preventDefault();
            }
        });
        document.body.appendChild(onboarding);
    }
}

export default OnboardingModal;