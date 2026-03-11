import { useTranslation } from "react-i18next";
import { useSettingsStore } from "./store";
import type { Language, Voice } from "./types";
import styles from "./SettingsModal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`choice${active ? " active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SettingsModal({ open, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const settings = useSettingsStore();

  const soundEnabled = settings.isSoundEnabled();
  const vibrateEnabled = settings.isVibrateEnabled();

  const handleLanguageChange = (lang: Language) => {
    settings.setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  if (!open) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h3>{t("settings.title")}</h3>

        <div className={styles.section}>
          <div className={styles.title}>{t("settings.language")}</div>
          <div className="choice-row">
            <ChoiceButton
              active={settings.language === "ja"}
              onClick={() => handleLanguageChange("ja")}
            >
              日本語
            </ChoiceButton>
            <ChoiceButton
              active={settings.language === "en"}
              onClick={() => handleLanguageChange("en")}
            >
              English
            </ChoiceButton>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>{t("settings.notification")}</div>
          <div className="choice-row">
            <ChoiceButton
              active={soundEnabled}
              onClick={() => settings.toggleNotifyFlag("sound")}
            >
              {t("settings.notifySound")}
            </ChoiceButton>
            <ChoiceButton
              active={vibrateEnabled}
              onClick={() => settings.toggleNotifyFlag("vibrate")}
            >
              {t("settings.notifyVibrate")}
            </ChoiceButton>
          </div>
          <div className="hint">{t("settings.notificationHint")}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>{t("settings.voice")}</div>
          <div className="choice-row">
            {(["male", "female"] as Voice[]).map((v) => (
              <ChoiceButton
                key={v}
                active={settings.voice === v}
                onClick={() => settings.setVoice(v)}
              >
                {t(`settings.voice${v === "male" ? "Male" : "Female"}`)}
              </ChoiceButton>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>{t("settings.animation")}</div>
          <div className="choice-row">
            <ChoiceButton
              active={settings.animation}
              onClick={() => settings.setAnimation(true)}
            >
              {t("settings.animShow")}
            </ChoiceButton>
            <ChoiceButton
              active={!settings.animation}
              onClick={() => settings.setAnimation(false)}
            >
              {t("settings.animHide")}
            </ChoiceButton>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>{t("settings.debug")}</div>
          <div className="choice-row">
            <ChoiceButton
              active={settings.debugEnabled}
              onClick={() => settings.setDebugEnabled(!settings.debugEnabled)}
            >
              {settings.debugEnabled ? t("settings.debugOn") : t("settings.debugOff")}
            </ChoiceButton>
          </div>
          <div className="hint">{t("settings.debugHint")}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>{t("settings.calibrationMode")}</div>
          <div className="choice-row">
            <ChoiceButton
              active={settings.calibrationMode}
              onClick={() => settings.setCalibrationMode(true)}
            >
              {t("settings.calibrationOn")}
            </ChoiceButton>
            <ChoiceButton
              active={!settings.calibrationMode}
              onClick={() => settings.setCalibrationMode(false)}
            >
              {t("settings.calibrationOff")}
            </ChoiceButton>
          </div>
          <div className="hint">{t("settings.calibrationHint")}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>{t("settings.step3Extra")}</div>
          <div className="choice-row">
            {[0, 2, 4, 6].map((seconds) => (
              <ChoiceButton
                key={seconds}
                active={settings.step3ExtraSecPer10g === seconds}
                onClick={() => settings.setStep3ExtraSecPer10g(seconds)}
              >
                {seconds === 0 ? t("settings.step3ExtraNone") : t("settings.step3ExtraValue", { seconds })}
              </ChoiceButton>
            ))}
          </div>
          <div className="hint">{t("settings.step3ExtraHint")}</div>
        </div>

        <div className={styles.actions}>
          <button className={styles.closeBtn} onClick={onClose}>
            {t("settings.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
