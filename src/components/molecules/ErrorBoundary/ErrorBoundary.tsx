import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
import Card, { CardHeader, CardContent } from '../Card/Card';
import Typography from '../../atoms/Typography/Typography';
import Button from '../../atoms/Button/Button';

interface Props {
  /**
   * The children to render
   */
  children: ReactNode;
  
  /**
   * Optional fallback component to render when an error occurs
   */
  fallback?: ReactNode;
  
  /**
   * Optional callback to handle errors
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  /**
   * Whether an error has occurred
   */
  hasError: boolean;
  
  /**
   * The error that occurred
   */
  error: Error | null;
  
  /**
   * Additional error information
   */
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component for catching and handling errors in React components
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo,
    });
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    // Reset the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, render it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, render the default error UI
      return (
        <div className={styles.errorBoundary}>
          <Card variant="elevated" className={styles.errorCard}>
            <CardHeader 
              title={<Typography variant="h5" color="error">Something went wrong</Typography>}
            />
            <CardContent>
              <div className={styles.errorContent}>
                <Typography variant="body1" className={styles.errorMessage}>
                  {this.state.error?.message || 'An unexpected error occurred'}
                </Typography>
                
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <div className={styles.errorDetails}>
                    <Typography variant="body2" className={styles.errorStack}>
                      <pre>{this.state.error?.stack}</pre>
                    </Typography>
                    <Typography variant="body2" className={styles.componentStack}>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </Typography>
                  </div>
                )}
                
                <div className={styles.errorActions}>
                  <Button 
                    variant="primary"
                    onClick={this.handleReset}
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => window.location.href = '/'}
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // If there's no error, render the children
    return this.props.children;
  }
}

export default ErrorBoundary;
