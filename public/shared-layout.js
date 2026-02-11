const SETTINGS_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;

const buildHeaderMarkup = () => `
  <header class="app-bar">
    <div class="app-title">COCO Timer</div>
    <button class="icon-btn" id="open-settings" aria-label="Settings">
      ${SETTINGS_ICON}
    </button>
  </header>
`;

const buildSettingsModalMarkup = () => `
  <div class="settings-modal" id="settings-modal">
    <div class="settings-card">
      <h3 id="label-settings">設定</h3>
      <div class="settings-section">
        <div class="settings-title" id="label-language">言語</div>
        <div class="choice-row" id="lang-choices">
          <button class="choice" data-value="ja">日本語</button>
          <button class="choice" data-value="en">English</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-title" id="label-notify">通知</div>
        <div class="choice-row" id="notify-choices">
          <button class="choice" data-value="sound">音声</button>
          <button class="choice" data-value="vibrate">バイブ</button>
          <button class="choice" data-value="none">なし</button>
        </div>
        <div class="hint" id="label-notify-hint">5秒前に通知します</div>
      </div>
      <div class="settings-section">
        <div class="settings-title" id="label-voice">音声</div>
        <div class="choice-row" id="voice-choices">
          <button class="choice" data-value="male">男性</button>
          <button class="choice" data-value="female">女性</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-title" id="label-debug">デバッグ</div>
        <div class="choice-row" id="debug-choices">
          <button class="choice" data-value="off">オフ</button>
          <button class="choice" data-value="x5">x5倍速</button>
        </div>
        <div class="hint" id="label-debug-hint">タイマーを高速再生します</div>
      </div>
      <div class="settings-actions">
        <button id="save-settings">保存</button>
        <button id="close-settings">閉じる</button>
      </div>
    </div>
  </div>
`;

export const mountSharedLayout = () => {
  const headerRoot = document.getElementById('shared-header');
  if (headerRoot) headerRoot.innerHTML = buildHeaderMarkup();

  const settingsRoot = document.getElementById('shared-settings-root');
  if (settingsRoot) settingsRoot.innerHTML = buildSettingsModalMarkup();
};
