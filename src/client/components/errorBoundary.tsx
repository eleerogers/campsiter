import React, { ReactNode } from 'react';
import Alert from 'react-bootstrap/Alert';


interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error(error);
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <Alert variant="danger">
          Something went wrong
        </Alert>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
