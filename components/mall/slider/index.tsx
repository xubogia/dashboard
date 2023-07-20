import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Slider from './sliderShow';
import columns from './columns';
import useStore from '../../../date/store';

interface ImageToShow {
  id: number;
  image: string;
}

const Index = () => {
  const [imagesData, setImagesData] = useState<ImageToShow[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);
  const [imagesTemp, setImagesTemp] = useState<ImageToShow[]>([]);
  const [imagesShow, setImagesShow] = useState<ImageToShow[]>([]);
  const setIsProductsChanged = useStore((state: any) => state.setIsProductsChanged);
  const isProductsChanged = useStore((state: any) => state.getIsProductsChanged());
  const fetchData = async () => {
    let products;

    try {
      const response = await axios.get('/api/slider');
      products = response.data;
      console.log('result', products);
      setImagesData(products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData().then();
  }, []);

  useEffect(() => {
    console.log('index', isProductsChanged);
    if (isProductsChanged) {
      fetchData().then();
      setIsProductsChanged(false);
    }
  }, [isProductsChanged, setIsProductsChanged]);

  useEffect(() => {
    const imagesShowTemp = [...imagesData, ...imagesTemp];
    setImagesShow(imagesShowTemp);
    console.log(imagesShowTemp);
  }, [imagesTemp, imagesData]);
  const handleImageUpload = (event: any) => {
    const { files } = event.target;
    const newImagesTemp = [...newImages, ...files];
    setNewImages(newImagesTemp);
    const uploadImage = (file: File) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const imagesTempTemp = [...imagesTemp, { id: 0, image: reader.result as string }];
          setImagesTemp(imagesTempTemp);
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

  const handleDelete = (index: number) => {
    console.log(index);
    const imagesTempTemp = [...imagesTemp];
    imagesTempTemp.splice(index, 1);
    const newImagesTemp = [...newImages];
    newImagesTemp.splice(index, 1);
    console.log(imagesTempTemp);
    setImagesTemp(imagesTempTemp);
    setNewImages(newImagesTemp);
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    console.log(newImages);
    newImages.forEach((file, index) => {
      formData.append(`$file${index}`, file);
    });

    try {
      const response = await axios.post('/api/slider/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data); // 打印请求成功的数据
      setNewImages([]);
      setImagesTemp([]);
      setIsProductsChanged(true);
    } catch (error) {
      console.error('Error:', error); // 打印错误信息
      // 在这里可以根据实际情况进行错误处理
    }
  };

  const handleDeleteImage = (id: number) => {
    const ids = [];
    ids.push(id);
    axios
      .post('/api/slider/delete', { ids })
      .then((response) => {
        setIsProductsChanged(true);
        console.log(response.data.message); // 输出删除成功的消息
      })
      .catch((error) => {
        console.error('Error deleting order:', error);
      });
    // console.log(isProductsChanged)
  };

  return (
    <div className="w-full grow flex flex-row ">
      <div className="w-1/3  flex flex-col space-y-4  ">
        <div className="w-full flex flex-row justify-between">
          <label htmlFor="file-upload">
            <div className="text-center bg-red-800 text-white py-2 w-32 rounded-md">上传图片</div>
            <input id="file-upload" type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          {imagesTemp.length > 0 && (
            <button
              type="button"
              className="text-center bg-amber-400 text-white py-1 w-20 rounded-md"
              onClick={handleConfirm}
            >
              确认
            </button>
          )}
        </div>

        <div className="w-full flex flex-col grow h-96 overflow-auto bg-gray-50 border rounded-lg">
          <div className="w-full flex flex-col ">
            <div className="flex flex-row ">
              {columns.map((item) => (
                <div className="grow ">
                  <div className="p-4 border-b">{item.headerName}</div>
                </div>
              ))}
            </div>

            {imagesData.length > 0 &&
              imagesData.map((itemTemp) => (
                <div className="flex flex-row border-b ">
                  <div className="px-2 w-1/2 h-20  flex  items-center">
                    <Image src={itemTemp.image} alt="none" width={60} height={60} />
                  </div>
                  <div className=" w-1/2 h-20 b flex  items-center">
                    <span className="sm:ml-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(itemTemp.id)}
                        className="inline-flex items-center rounded-md bg-red-800 px-2 py-1 text-sm font-semibold text-white shadow-sm "
                      >
                        删除
                      </button>
                    </span>
                  </div>
                </div>
              ))}

            {imagesTemp.length > 0 &&
              imagesTemp.map((itemTemp, index) => (
                <div className="flex flex-row border-b bg-red-100 ">
                  <div className="px-2 w-1/2 h-20  flex  items-center">
                    <Image src={itemTemp.image} alt="none" width={60} height={60} />
                  </div>
                  <div className=" w-1/2 h-20 b flex  items-center">
                    <span className="sm:ml-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="inline-flex items-center rounded-md bg-red-800 px-2 py-1 text-sm font-semibold text-white shadow-sm "
                      >
                        删除
                      </button>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="grow">
        <Slider data={imagesShow} />
      </div>
    </div>
  );
};
export default Index;
