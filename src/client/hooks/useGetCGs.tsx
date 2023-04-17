import useDataApi from "./useDataApi";
import { ICampground } from "../interfaces";

const emptyCampground: ICampground = {
  created_at: '',
  description: '',
  id: 0,
  image: '',
  image_id: '',
  lat: 0,
  lng: 0,
  location: '',
  name: '',
  price: '',
  rating: '',
  user_id: '',
  username: '',
}

function useGetCGs(urlStr: string = '/api/campgrounds', emptyCG: ICampground = emptyCampground) {
  const emptyCGObj = {
    campground: emptyCG,
    campgrounds: [],
    user: {
      first_name: '',
      last_name: '',
      image: '',
      email: '',
      username: '',
    }
  };

  const [{
    data, isLoading, isError: errMsg
  }] = useDataApi(urlStr, emptyCGObj);

  return { data, isLoading, errMsg };
}

export default useGetCGs;
