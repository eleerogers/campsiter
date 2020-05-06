const getUploadedFileName = (e, setState) => {
  const { files, value } = e.target;
  let message;
  if (files && files.length > 1) {
    message = `${files.length} files selected`;
  } else {
    message = value.split('\\').pop();
  }
  if (message) {
    setState((prevState) => ({ ...prevState, message }));
  }
  setState({
    imageFile: e.target.files[0]
  });
};

export default getUploadedFileName;
