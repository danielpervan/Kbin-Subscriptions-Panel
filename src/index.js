import "./style.scss";
import SettingsModal from "./Classes/SettingsModal";
import SubscriptionsPanel from "./Classes/SubscriptionsPanel";
import OnboardingModal from "./Classes/OnboardingModal";

/** Do the stuff */
const loginElement = document.querySelector(".login");
if (!loginElement.href.endsWith("/login")) {
    const subscriptionsPanel = new SubscriptionsPanel();
    const settingsModal = new SettingsModal(subscriptionsPanel);
    const onboardingModal = new OnboardingModal(settingsModal);
    subscriptionsPanel.init();
    settingsModal.init();
    onboardingModal.init();
}
