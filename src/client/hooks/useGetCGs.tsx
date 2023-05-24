import useDataApi from "./useDataApi";
import { ICampground, IUser } from "../interfaces";


interface IEmptyCGObj {
  campground: ICampground;
  campgrounds: ICampground[];
  user: IUser;
}

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
  const emptyCGObj: IEmptyCGObj = {
    campground: emptyCG,
    campgrounds: [],
    user: {
      first_name: '',
      last_name: '',
      image: '',
      email: '',
      username: '',
      id: '',
      image_id: '',
    }
  };

  const [{
    data, isLoading, isError: errMsg
  }] = useDataApi(urlStr, emptyCGObj);

  return { data, isLoading, errMsg };
}

export default useGetCGs;
