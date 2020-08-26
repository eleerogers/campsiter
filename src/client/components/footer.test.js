import React from 'react';
import { mount } from '../../enzyme';
import Footer from './footer';
import { MemoryRouter } from 'react-router-dom';

it('should render current year as copyright year', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/campgroundsHome' ]}>
      <Footer />
    </MemoryRouter>
  );
  const div = wrapper.find('div.text-muted').first();
  const result = div.text();
  expect(result).toBe(`© ${new Date().getFullYear()} CampSiter`);
})



