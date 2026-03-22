/**
 * KeyBindingConfig.js — 按键配置数据层
 * 负责读写 localStorage 中的按键绑定配置
 */

// 默认按键配置
export const DEFAULT_KEYBINDING = {
  // 游戏控制
  jump: 'KeyW',
  moveLeft: 'KeyA',
  moveRight: 'KeyD',
  
  // 录制系统
  record: 'KeyE',
  replay: 'KeyR',
};

// localStorage 储存键名
export const STORAGE_KEY = 'game_keybinding';

/**
 * 配置管理类：负责 localStorage 的读写
 */
export class KeyBindingConfig {
  /**
   * 从 localStorage 加载配置，失败则返回默认配置
   */
  static load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return { ...DEFAULT_KEYBINDING };
      // 用默认值补全 localStorage 中缺失的键（兼容旧存档）
      const merged = { ...DEFAULT_KEYBINDING, ...JSON.parse(saved) };
      return merged;
    } catch (e) {
      console.warn('Failed to load keybinding config:', e);
      return { ...DEFAULT_KEYBINDING };
    }
  }

  /**
   * 保存配置到 localStorage
   */
  static save(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save keybinding config:', e);
    }
  }

  /**
   * 重置为默认配置
   */
  static reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
