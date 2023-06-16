import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Image from 'next/image';

interface NewProduct {
  image:string[];
  imageDetail:string[];
}
interface Props {
 name:string;
 value:NewProduct;
 onChange:(prop:string,images:any[])=>void;
}

const ImageUploader:FC<Props> = ({value, onChange}) => {
  const [selectedImages, setSelectedImages] = useState(value.image);
  const [imageFiles,setImageFiles]=useState<File[]>([])
  const [imageDetail, setImageDetail] = useState<string[]>(value.imageDetail);

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
            <div key={index} className="flex flex-col mb-4 space-y-2  justify-center items-center ">
              <div className={'flex flex-row justify-between px-4 space-x-4'}>
                <input
                  type="text"
                  placeholder={'颜色'}
                  className={'border w-full'}
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
              <Image src={image} alt="Uploaded" width={150} height={150}  />
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
