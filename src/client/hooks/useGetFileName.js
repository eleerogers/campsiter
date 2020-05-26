import { useState } from 'react';

function useGetFileName(initBtnMessage) {
  const [imageFile, setImageFile] = useState(null);
  const [btnMessage, setBtnMessage] = useState(initBtnMessage);

  function handleFileChange(e) {
    const { files, value } = e.target;
    let newBtnMessage;
    if (files && files.length > 1) {
      newBtnMessage = `${files.length} files selected`;
    } else {
      newBtnMessage = value.split('\\').pop();
    }
    if (newBtnMessage) {
      setBtnMessage(newBtnMessage);
    }
    setImageFile(e.target.files[0]);
  }

  return { imageFile, btnMessage, handleFileChange };
}

export default useGetFileName;
