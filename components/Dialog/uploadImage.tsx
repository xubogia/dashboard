import React, { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface NewProduct {
  image:string[];
  imageDetail:string[];
}
interface Props {
 name:string;
 value:NewProduct;
 onChange:(prop:string,images:any[])=>void;
  // handleSave: (product: Product) => void;
}

const ImageUploader:FC<Props> = ({name,value, onChange}) => {
  const [selectedImages, setSelectedImages] = useState(value.image);
  const [imageFiles,setImageFiles]=useState<File[]>([])
  const [imageDetail, setImageDetail] = useState<string[]>(value.imageDetail);

  useEffect(()=>{
    console.log('value',value);
    console.log('setImageFiles',selectedImages)
  },[value])
  const handleImageUpload = (event:any) => {
    const files = event.target.files;
    console.log('files',files)
    const uploadedImageFiles = [...imageFiles, ...files];
    console.log('uploadedImageFiles',uploadedImageFiles);
    setImageFiles(uploadedImageFiles);
    onChange('image',uploadedImageFiles);
    const uploadedImages = [...selectedImages];
    let count=0;
    const uploadImage = (file:File) => {
      const reader:FileReader = new FileReader();
      reader.onloadend = () => {
        count++;
        if (typeof reader.result === 'string') {
          uploadedImages.push(reader.result);
        }
        console.log(uploadedImages);
        if (count === files.length) {
          setSelectedImages(uploadedImages);
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    };

    for (let i = 0; i < files.length; i++) {
      uploadImage(files[i]);
    }
  };


  const handleRemoveImage = (index:number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
    onChange('image',updatedImages);
  };



  return (
    <div className={'my-2'}>
      <div className={'grid grid-cols-3 space-x-2'}>
        {
          selectedImages.length !== 0 &&
          selectedImages.map((image, index) => (
            <div key={index} className="flex flex-col mb-4 space-y-2 w-40 ">
              <div className={'flex flex-row justify-between '}>
                <input
                  type="text"
                  placeholder={'颜色'}
                  className={'border w-1/2'}
                  required={true}
                  value={
                  imageDetail[index] ||
                    ''}
                  onChange={(e) => {
                    const updatedColors = [...imageDetail];
                    updatedColors[index] = e.target.value;
                    setImageDetail(updatedColors);
                    onChange('imageDetail', updatedColors);
                  }}
                />
                <button
                  className='w-2  rounded-lg '
                  onClick={() => handleRemoveImage(index)}
                >
                  x
                </button>
              </div>
              <img src={image} alt="Uploaded" className="w-40 h-40 object-cover mr-4" />
            </div>
          ))
        }
      </div>

      <input
        accept="image/*"
        className="hidden"
        id="image-upload"
        type="file"
        multiple
        onChange={handleImageUpload}
      />
      <label htmlFor="image-upload">
        <Button variant="contained" component="span">
          选择图片
        </Button>
      </label>
    </div>
  );
};

export default ImageUploader;
