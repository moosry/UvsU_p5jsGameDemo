// WindowSetting.js — 设置悬浮窗
// 包含：BGM 音量、SFX 音量、语言切换

import { WindowBase } from './WindowBase.js';
import { i18n, t } from '../../i18n.js';

export class WindowSetting extends WindowBase {
  /**
   * @param {p5}    p - p5 实例
   * @param {number} x - 初始横坐标（默认居中）
   * @param {number} y - 初始纵坐标（默认居中）
   */
  constructor(p, x, y) {
    const w = 320;
    const defaultX = x ?? Math.round((p.width - w) / 2);
    const defaultY = y ?? Math.round(p.height * 0.15);
    super(p, t('win_title'), defaultX, defaultY, w);
    this._buildContent();

    // 语言切换时刷新窗口内所有可见文字
    this._i18nHandler = () => this._refreshLabels();
    i18n.onChange(this._i18nHandler);
  }

  // ─── 内容构建 ──────────────────────────────────────────────────────────────

  _buildContent() {
    const p = this.p;
    const area = this.contentArea;

    // ── 音量区域 ──────────────────────────────────────────────

    this._soundHeader = p.createDiv(t('win_sound'));
    this._soundHeader.addClass('window-section-title');
    this._soundHeader.parent(area);

    // BGM 音量
    const bgmRow = this._createSliderRow(area, t('win_bgm'), 0, 100, 70, (val) => {
      if (this.onBGMChange) this.onBGMChange(val / 100);
    });
    this._bgmSlider = bgmRow.slider;
    this._bgmLabel  = bgmRow.labelEl;

    // SFX 音量
    const sfxRow = this._createSliderRow(area, t('win_sfx'), 0, 100, 70, (val) => {
      if (this.onSFXChange) this.onSFXChange(val / 100);
    });
    this._sfxSlider = sfxRow.slider;
    this._sfxLabel  = sfxRow.labelEl;

    // ── 语言区域 ──────────────────────────────────────────────

    this._langHeader = p.createDiv(t('win_language'));
    this._langHeader.addClass('window-section-title');
    this._langHeader.parent(area);

    const langRow = p.createDiv('');
    langRow.addClass('window-lang-row');
    langRow.parent(area);

    this._langSelect = p.createSelect();
    this._langSelect.option('English', 'en');
    this._langSelect.option('中文', 'zh');
    this._langSelect.addClass('window-select');
    this._langSelect.parent(langRow);
    this._langSelect.selected(i18n.getLang());

    this._langSelect.changed(() => {
      const lang = this._langSelect.value();
      i18n.setLang(lang);  // 触发 onChange → _refreshLabels
      if (this.onLanguageChange) this.onLanguageChange(lang);
    });
  }

  /** 切换语言后刷新窗口内所有可见文字 */
  _refreshLabels() {
    this.setTitle(t('win_title'));
    this._soundHeader.html(t('win_sound'));
    this._bgmLabel.html(t('win_bgm'));
    this._sfxLabel.html(t('win_sfx'));
    this._langHeader.html(t('win_language'));
    this._langSelect.selected(i18n.getLang());
  }

  /**
   * 创建一行 [标签] [滑块] [数值显示] 的组合控件
   * @returns {{ slider: p5.Element, labelEl: p5.Element }}
   */
  _createSliderRow(parent, label, min, max, defaultVal, onChange) {
    const p = this.p;

    const row = p.createDiv('');
    row.addClass('window-slider-row');
    row.parent(parent);

    const labelEl = p.createSpan(label);
    labelEl.addClass('window-label');
    labelEl.parent(row);

    const slider = p.createSlider(min, max, defaultVal, 1);
    slider.addClass('window-slider');
    slider.parent(row);

    const valueDisplay = p.createSpan(defaultVal + '%');
    valueDisplay.addClass('window-slider-value');
    valueDisplay.parent(row);

    slider.input(() => {
      const val = slider.value();
      valueDisplay.html(val + '%');
      if (onChange) onChange(val);
    });

    return { slider, labelEl };
  }

  // ─── 数值读取 ──────────────────────────────────────────────────────────────

  /** 返回 BGM 音量 [0, 1] */
  getBGMVolume() { return this._bgmSlider.value() / 100; }
  getSFXVolume() { return this._sfxSlider.value() / 100; }
  getLanguage()  { return this._langSelect.value(); }

  // ─── 数值写入 ──────────────────────────────────────────────────────────────

  setBGMVolume(val) { this._bgmSlider.value(Math.round(val * 100)); }
  setSFXVolume(val) { this._sfxSlider.value(Math.round(val * 100)); }
  setLanguage(lang) { this._langSelect.selected(lang); }

  // ─── 销毁 ──────────────────────────────────────────────────────────────────

  remove() {
    i18n.offChange(this._i18nHandler);
    super.remove();
  }
}
