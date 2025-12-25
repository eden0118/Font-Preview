/**
 * ErrorBoundary 元件 - 捕捉運行時錯誤
 *
 * 目的：
 * - 捕捉子元件的 React 運行時錯誤
 * - 防止整個應用崩潰
 * - 提供清晰的錯誤恢復 UI
 *
 * 使用方法：
 * <ErrorBoundary fallback={<ErrorPage />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 呼叫外部錯誤回調（用於日誌上傳）
    this.props.onError?.(error, errorInfo);

    // 記錄到控制台便於開發
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 p-4">
            <div className="rounded-lg border border-red-300 bg-red-50 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 shrink-0 text-red-600" />
                <h1 className="text-xl font-bold text-red-900">出現錯誤</h1>
              </div>
              <p className="mb-4 text-sm text-red-800">
                應用程式遇到了意外錯誤。請嘗試刷新頁面或返回首頁。
              </p>
              {this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-xs font-medium text-red-700">
                    詳細資訊
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-900">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={this.handleReset}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  重試
                </button>
                <a
                  href="/"
                  className="rounded-lg border border-red-300 px-4 py-2 text-center text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                >
                  返回首頁
                </a>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
