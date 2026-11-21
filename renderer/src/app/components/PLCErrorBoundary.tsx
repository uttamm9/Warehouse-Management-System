import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class PLCErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[PLC Page Error]', error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="p-8 space-y-4">
                    <h2 className="text-red text-lg font-semibold">PLC Page Error</h2>
                    <p className="text-muted-foreground text-sm">
                        Something went wrong loading this page. Check the console for details.
                    </p>
                    <pre className="text-xs text-red/80 bg-red/5 border border-red/20 rounded-lg p-4 overflow-auto max-h-48">
                        {this.state.error.message}
                        {'\n'}
                        {this.state.error.stack?.split('\n').slice(0, 6).join('\n')}
                    </pre>
                    <button
                        onClick={() => this.setState({ error: null })}
                        className="px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.06] text-foreground text-sm hover:bg-white/10"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
