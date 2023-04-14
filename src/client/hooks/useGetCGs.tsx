import useDataApi from "./useDataApi";
import { CampgroundInterface } from "../interfaces";


function useGetCGs(urlStr: string = '/api/campgrounds', emptyCG?: CampgroundInterface) {
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
