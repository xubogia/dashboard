import { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Image from 'next/image';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ImageDialog from './imageToLargerDialog';

interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
}

interface NewProduct {
  eachDetail: EachDetail[];
  title: string;
  id?: number;
  category: string;
  amount: string;
  status: string;
  detail: string;
  newImage: any[];
}


interface Props {
  value: NewProduct;
  onChange: (prop: string, images: any[]) => void;
}

const ImageUploader: FC<Props> = ({ value, onChange }) => {
  const [imageItems, setImageItems] = useState<EachDetail[]>(value.eachDetail);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState(false);
  const [imageToLarger, setImageToLarger] = useState('');
  const handleClose = () => {
    setPreviewImage(false);
  };
  const handleImageUpload = (event: any) => {
    const { files } = event.target;
    console.log('files', files);
    const uploadedImageFiles = [...imageFiles, ...files];
    console.log('uploadedImageFiles', uploadedImageFiles);
    setImageFiles(uploadedImageFiles);
    onChange('newImage', uploadedImageFiles);
    const uploadedImages = [...imageItems];
    let count = 0;
    const uploadImage = (file: File) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        count++;
        const newImageItem: EachDetail = { image: '', imageDetail: '', size: [] };
        if (typeof reader.result === 'string') {
          newImageItem.image = reader.result;
          uploadedImages.push(newImageItem);
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
    onChange('eachDetail', updatedImages);
  };

  const handleSizeAdd = (index: number,event:any) => {
    const setSelectedSizesTemp=event.target.value as string[];
    console.log(setSelectedSizesTemp, index);
    const sizeTemp = [...imageItems];
      sizeTemp[index].size=setSelectedSizesTemp;
    console.log(sizeTemp);
    setImageItems(sizeTemp);
    onChange('eachDetail', sizeTemp);
  };


  return (
    <div className='my-2'>
      {imageToLarger!==''&&<ImageDialog open={previewImage} image={imageToLarger} handleClose={handleClose} />}
      <div className='grid grid-cols-2  gap-x-4'>
        {
          imageItems.length !== 0 &&
          imageItems.map((item: EachDetail, index) => (
            <div className='w-full flex flex-row mb-4 space-x-6   max-h-40 '>
              <div className='flex flex-row  space-x-2  '>
                <Image src={item.image} alt='Uploaded' width={100} height={100} onClick={() =>{
                  setImageToLarger(item.image)
                  setPreviewImage(true)
                }}/>
                <div className='flex flex-col justify-between'>
                  <button
                    className='w-2  rounded-lg '
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                  <div />
                </div>
              </div>

              <div className='flex flex-col space-y-2 relative '>
                <TextField
                  margin='dense'
                  id='color'
                  label='颜色'
                  type='text'
                  name='color'
                  value={
                    item.imageDetail ||
                    ''}
                  onChange={(e) => {
                    const updatedColors: EachDetail[] = [...imageItems];
                    updatedColors[index].imageDetail = e.target.value;
                    setImageItems(updatedColors);
                    onChange('eachDetail', updatedColors);
                  }}
                  fullWidth
                />

                <FormControl fullWidth margin='dense'>
                <InputLabel htmlFor='size'>状态</InputLabel>
                <Select
                  label='尺寸'
                  id='size'
                  name='size'
                  value={item.size}
                  multiple
                  onChange={(event) =>{
                    handleSizeAdd(index,event);
                  }
                  }
                  renderValue={(selected) => (
                    <div className='flex flex-row'>
                      {selected.map((size) => (
                        <span  >
                          {size},
                        </span>
                      ))}
                    </div>
                  )}
                >
                  <MenuItem value='S'>S</MenuItem>
                  <MenuItem value='M'>M</MenuItem>
                  <MenuItem value='XL'>XL</MenuItem>
                  <MenuItem value='2XL'>2XL</MenuItem>
                </Select>
                </FormControl>


              </div>

            </div>
          ))
        }
      </div>

      <label htmlFor='image-upload'>
        <Button variant='contained' component='span'>
          选择图片
        </Button>
        <input
          accept='image/*'
          className='hidden'
          id='image-upload'
          type='file'
          multiple
          onChange={handleImageUpload}
        />
      </label>


    </div>
  );
};

export default ImageUploader;
