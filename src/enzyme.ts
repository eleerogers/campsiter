import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';
import 'babel-polyfill';

configure({ adapter: new Adapter() });

export { shallow, mount, render };
export default Enzyme;
