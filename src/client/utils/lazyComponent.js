import importedComponent from 'react-imported-component';
import Loading from '../components/loading';

function lazyComponent(componentPath) {
  return importedComponent(
    () => import(componentPath),
    { LoadingComponent: Loading });
}

export default lazyComponent;
