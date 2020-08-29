import React from 'react';
import { mount } from '../../../enzyme';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';
import * as LoggedInAsContext from '../contexts/loggedInAsContext';


describe('App tests', () => {
  let

  it('should not render header and footer on landing page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/' ]}>
        <App />
      </MemoryRouter>
    );
    const landingDiv = wrapper.find('div.landing-outer');
    expect(landingDiv.exists()).toBe(true);
    const navs = wrapper.find('nav');
    expect(navs.length).toBe(0);
    const footer = wrapper.find('div.footer')
    expect(footer.exists()).toBe(false);
  })

  it('should render header and footer on campgroundsHome page', () => {
    const contextValues = {
      logoutUser: () => {},
      loggedInAs: {
        id: '',
        password: '',
        email: '',
        created_at: '',
        admin: false,
        image: '',
        imageId: '',
        firstName: '',
        lastName: '',
        username: ''
      }
    };
  
    jest
      .spyOn(LoggedInAsContext, 'useLoggedInAsContext')
      .mockImplementation(() => contextValues);


    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/campgroundsHome' ]}>
        <App />
      </MemoryRouter>
    );
    const landingDiv = wrapper.find('div.landing-outer');
    expect(landingDiv.exists()).toBe(false);
    const navs = wrapper.find('nav');
    expect(navs.length).toBe(2);
    const footer = wrapper.find('div.footer')
    expect(footer.exists()).toBe(true);
  })

})