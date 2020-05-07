import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { hasError: false };
  // }

  componentDidCatch(error, info) {
    const { history } = this.props;
    history.push('/campgrounds');
    // Display fallback UI
    // this.setState({ hasError: true });
  }

  render() {
  //   if (this.state.hasError) {
  //     // const { history } = this.props;
  //     // history.push('/campgrounds');
  //     // You can render any custom fallback UI
  //     return <h1>Error occurred!</h1>;
  //   }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default ErrorBoundary;
