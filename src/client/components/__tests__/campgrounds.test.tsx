import React from 'react';
import { mount } from '../../../enzyme';
import Campgrounds from '../campgrounds';
import { MemoryRouter } from 'react-router-dom';


const testConfigObj = {
  campClass: "campgroundThumb",
  colClass: "mb-4",
  lg: 3,
  md: 4,
  sm: 6
}

const cg1 = {
  created_at: "2020-07-16T16:15:34.562Z",
  description: "Beach camping with easy load in/out, bathrooms and camp store.  About a 10-15 walk to the beach.  Great for kids as the beach has lots of tide pools.",
  id: 140,
  image: "https://res.cloudinary.com/eleerogers/image/upload/v1594916133/rareqbf6ipc66yxnuw9p.jpg",
  image_id: "rareqbf6ipc66yxnuw9p",
  lat: 34.0259,
  lng: -118.78,
  location: "Malibu, CA, USA",
  name: "Leo Carrillo",
  price: "12 parking per day",
  rating: "0",
  user_id: "135",
  username: "melaniexoxo@hotmail.com"
}

const cg2 = {
  created_at: "2020-07-15T23:42:22.502Z",
  description: 'Hike out from the "farewell gap" trailhead in Mineral King (Southern Sequoia NP), going roughly SE for 5 miles.  Backpacking permits are required for overnight stays and can be reserved on the Sequoia national park website.',
  id: 139,
  image: "https://res.cloudinary.com/eleerogers/image/upload/v1594856541/nuitcwbouaa87cu3t94e.jpg",
  image_id: "nuitcwbouaa87cu3t94e",
  lat: 36.4501,
  lng: -118.593,
  location: "Mineral King, CA 93271, USA",
  name: "Franklin Lakes (mineral king)",
  price: "10",
  rating: "5.00",
  user_id: "125",
  username: "wes"
}

const cg3 = {
  created_at: "2020-07-15T23:29:04.950Z",
  description: "Point Mugu State Park, located in the Santa Monica Mountains, features five miles of ocean shoreline with rocky bluffs, sandy beaches, sand dunes, rugged hills and uplands, two major river canyons and wide grassy valleys dotted with sycamores, oaks and a few native walnuts. There are more than 70 miles of hiking trails. The beach also features swimming, body surfing and surf fishing. The park includes the jagged pinnacles of the Boney Mountains State Wilderness Area.",
  id: 138,
  image: "https://res.cloudinary.com/eleerogers/image/upload/v1594855743/g8fibbblolkpzkkg7zjz.jpg",
  image_id: "g8fibbblolkpzkkg7zjz",
  lat: 34.0698,
  lng: -119.012,
  location: "9000 Pacific Coast Hwy, Malibu, CA 90265, USA",
  name: "Sycamore Canyon",
  price: "50",
  rating: "5.00",
  user_id: "134",
  username: "bkhwaja"
}

const testCGArr = [cg1, cg2, cg3];

describe('Campgrounds tests', () => {

  it('renders the CampgroundThumb components', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/campgroundsHome' ]}>
        <Campgrounds campgrounds={testCGArr} configObj={testConfigObj} />
      </MemoryRouter>
    );
    expect(wrapper.find('figure.campground')).toHaveLength(testCGArr.length);
  })

})