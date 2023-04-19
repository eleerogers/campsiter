import { useState } from 'react';


function useGetFileName(initBtnMessage: string) {
  const [imageFile, setImageFile] = useState<Blob>();
  const [btnMessage, setBtnMessage] = useState(initBtnMessage);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    if (e.target && e.target.files) {
      setImageFile(e.target.files[0]);
    }
  }

  return { imageFile, btnMessage, handleFileChange };
}

export default useGetFileName;
