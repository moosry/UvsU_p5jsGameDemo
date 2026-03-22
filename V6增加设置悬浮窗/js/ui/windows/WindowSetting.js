// WindowSetting.js — 设置悬浮窗
// 包含：BGM 音量、SFX 音量、语言切换

import { WindowBase } from './WindowBase.js';

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
    super(p, '⚙  Settings', defaultX, defaultY, w);
    this._buildContent();
  }

  // ─── 内容构建 ──────────────────────────────────────────────────────────────

  _buildContent() {
    const p = this.p;
    const area = this.contentArea;

    // ── 音量区域 ──────────────────────────────────────────────

    const soundHeader = p.createDiv('🔊 Sound');
    soundHeader.addClass('window-section-title');
    soundHeader.parent(area);

    // BGM 音量
    this._bgmSlider = this._createSliderRow(
      area, 'BGM', 0, 100, 70, (val) => {
        if (this.onBGMChange) this.onBGMChange(val / 100);
      }
    );

    // SFX 音量
    this._sfxSlider = this._createSliderRow(
      area, 'SFX', 0, 100, 70, (val) => {
        if (this.onSFXChange) this.onSFXChange(val / 100);
      }
    );

    // ── 语言区域 ──────────────────────────────────────────────

    const langHeader = p.createDiv('🌐 Language / 语言');
    langHeader.addClass('window-section-title');
    langHeader.parent(area);

    const langRow = p.createDiv('');
    langRow.addClass('window-lang-row');
    langRow.parent(area);

    this._langSelect = p.createSelect();
    this._langSelect.option('English', 'en');
    this._langSelect.option('中文', 'zh');
    this._langSelect.addClass('window-select');
    this._langSelect.parent(langRow);
    this._langSelect.changed(() => {
      if (this.onLanguageChange) this.onLanguageChange(this._langSelect.value());
    });
  }

  /**
   * 创建一行 [标签] [滑块] [数值显示] 的组合控件
   * @returns {p5.Element} 滑块元素
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

    return slider;
  }

  // ─── 数值读取 ──────────────────────────────────────────────────────────────

  /** 返回 BGM 音量 [0, 1] */
  getBGMVolume() {
    return this._bgmSlider.value() / 100;
  }

  /** 返回 SFX 音量 [0, 1] */
  getSFXVolume() {
    return this._sfxSlider.value() / 100;
  }

  /** 返回当前语言 'en' 或 'zh' */
  getLanguage() {
    return this._langSelect.value();
  }

  // ─── 数值写入 ──────────────────────────────────────────────────────────────

  setBGMVolume(val) {
    this._bgmSlider.value(Math.round(val * 100));
  }

  setSFXVolume(val) {
    this._sfxSlider.value(Math.round(val * 100));
  }

  setLanguage(lang) {
    this._langSelect.selected(lang);
  }
}
