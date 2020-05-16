import { useState } from 'react';

function useGetFileName(initBtnMessage) {
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState(initBtnMessage);

  function handleFileChange(e) {
    const { files, value } = e.target;
    let newMessage;
    if (files && files.length > 1) {
      newMessage = `${files.length} files selected`;
    } else {
      newMessage = value.split('\\').pop();
    }
    if (newMessage) {
      setMessage(newMessage);
    }
    setImageFile(e.target.files[0]);
  }

  return { imageFile, message, handleFileChange };
}

export default useGetFileName;
