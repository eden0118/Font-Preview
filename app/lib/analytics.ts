/**
 * analytics.ts - 事件追蹤和監控模組
 *
 * 目的：
 * - 追蹤用戶行為（字型分析、比較等）
 * - 收集性能數據
 * - 便於生產環境除錯和優化
 */

/**
 * 分析事件類型定義
 */
export type AnalyticsEventType =
  | 'font_uploaded'
  | 'font_analyzed'
  | 'font_comparison_started'
  | 'preview_text_changed'
  | 'settings_updated'
  | 'error_occurred'
  | 'cache_hit'
  | 'cache_miss';

/**
 * 事件詳情
 */
export interface AnalyticsEventData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * 記錄分析事件
 * @param eventType - 事件類型
 * @param data - 事件數據
 */
export const trackEvent = (eventType: AnalyticsEventType, data?: AnalyticsEventData) => {
  // 避免服務端執行
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  const eventLog = {
    type: eventType,
    timestamp,
    ...data,
  };

  // 1️⃣ 開發環境：控制台輸出
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventType}`, eventLog);
  }

  // 2️⃣ 生產環境：可集成 Google Analytics、Sentry 等
  // 示例：
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventType, { ...data });
  // }

  // 3️⃣ 本地存儲（便於問題追蹤）
  try {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(eventLog);
    // 只保留最近 100 條事件
    if (events.length > 100) events.shift();
    localStorage.setItem('analytics_events', JSON.stringify(events));
  } catch (e) {
    console.error('Failed to store analytics event:', e);
  }
};

/**
 * 記錄性能指標
 * @param metricName - 指標名稱
 * @param duration - 耗時（毫秒）
 * @param metadata - 其他元數據
 */
export const trackPerformance = (
  metricName: string,
  duration: number,
  metadata?: AnalyticsEventData
) => {
  if (typeof window === 'undefined') return;

  const perfLog = {
    metric: metricName,
    duration,
    timestamp: Date.now(),
    ...metadata,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metricName}: ${duration}ms`, perfLog);
  }

  // 警告：超過閾值的慢操作
  const thresholds: Record<string, number> = {
    font_analysis: 5000, // 5秒
    font_comparison: 8000, // 8秒
    preview_update: 1000, // 1秒
  };

  const threshold = thresholds[metricName];
  if (threshold && duration > threshold) {
    console.warn(`⚠️ Slow operation detected: ${metricName} took ${duration}ms`);
  }
};

/**
 * 記錄錯誤事件
 * @param errorName - 錯誤名稱
 * @param errorMessage - 錯誤訊息
 * @param stack - 堆棧追蹤
 */
export const trackError = (errorName: string, errorMessage: string, stack?: string) => {
  if (typeof window === 'undefined') return;

  const errorLog = {
    name: errorName,
    message: errorMessage,
    stack,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  };

  console.error(`[Error] ${errorName}`, errorLog);

  // 可集成錯誤追蹤服務（如 Sentry）
  // sentryClient.captureException(new Error(errorMessage), { contexts: errorLog });
};
