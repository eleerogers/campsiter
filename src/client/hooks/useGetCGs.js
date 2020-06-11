//the new useCampgrounds hook
import useDataApi from "./useDataApi";


function useGetCGs(urlStr = '/api/campgrounds') {
  const emptyCGObj = {
    campgrounds: [],
    user: {
      first_name: '',
      last_name: '',
      image: '',
      email: '',
      username: '',
    }
  };

  const [{ data, isLoading, isError: errMsg }] = useDataApi(urlStr, emptyCGObj);

  return { data, isLoading, errMsg };
}

export default useGetCGs;
