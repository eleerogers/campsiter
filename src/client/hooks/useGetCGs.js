import useDataApi from "./useDataApi";


function useGetCGs(urlStr = '/api/campgrounds', emptyCG) {
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
