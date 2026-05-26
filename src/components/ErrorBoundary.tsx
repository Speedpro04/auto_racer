import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-6 bg-[#111] p-10 rounded-[4px] border border-red-500/20">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Ops! Algo deu errado.</h1>
            <p className="text-[#8395a7] text-sm">
              Ocorreu um erro inesperado no sistema. Tente recarregar a página.
            </p>
            <div className="p-4 bg-black/40 rounded-[4px] text-left overflow-auto max-h-40">
              <code className="text-xs text-red-400">{this.state.error?.toString()}</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-[#1dd1a1] text-black rounded-[4px] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-gray-800 transition-all"
            >
              Recarregar Sistema
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
