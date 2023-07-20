import { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { NewProduct } from '../../../interface';

interface Props {
  value: NewProduct;
  onChange: (prop: string, images: any[]) => void;
  validationError?: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ImageUploader: FC<Props> = ({ value, onChange, validationError }) => {
  const [imageItems, setImageItems] = useState<string[]>(value.detail);
  const [imageFiles, setImageFiles] = useState<File[]>(value.newDetailImage);

  const handleImageUpload = (event: any) => {
    const { files } = event.target;
    // console.log('files', files);
    const uploadedImageFiles = [...imageFiles, ...files];
    // console.log('uploadedImageFiles', uploadedImageFiles);
    setImageFiles(uploadedImageFiles);
    onChange('newDetailImage', uploadedImageFiles);
    const uploadedImages = [...imageItems];
    let count = 0;
    const uploadImage = (file: File) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        count++;
        if (typeof reader.result === 'string') {
          uploadedImages.push(reader.result);
        }
        console.log(uploadedImages);
        if (count === files.length) {
          setImageItems(uploadedImages);
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

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...imageItems];
    updatedImages.splice(index, 1);
    setImageItems(updatedImages);
    onChange('detail', updatedImages);
    const newImageTemp = value.newDetailImage;
    newImageTemp.splice(index, 1);
    onChange('newImage', newImageTemp);
  };

  return (
    <div className="my-2">
      <label htmlFor="detailImage-upload">
        <Button
          variant="contained"
          component="span"
          className="w-40 my-4 h-10  border bg-red-700 rounded-lg text-white  text-sm text-center"
        >
          选择商品详情图片
        </Button>
        <input
          accept="image/*"
          className="hidden"
          id="detailImage-upload"
          type="file"
          multiple
          onChange={handleImageUpload}
        />
      </label>
      {imageItems.map((imageItem, index) => (
        <div className="flex flex-row space-x-2">
          <Image src={imageItem} alt="Uploaded" width={500} height={500} />
          <div className="flex flex-col  justify-between">
            <button type="button" onClick={() => handleRemoveImage(index)}>
              X
            </button>
            <div />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageUploader;
