import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageToShow {
  id: number;
  image: string;
}
const SliderShow = ({ data }: { data: ImageToShow[] }) => {
  const [imageTemp, setImageTemp] = useState(0);
  const [images, setImages] = useState(data);
  useEffect(() => {
    console.log(data);
    setImages(data);
  }, [data]);
  useEffect(() => {
    if (images.length > 3) {
      // 自动切换轮播图
      const timer = setInterval(() => {
        setImageTemp((prevIndex) => (prevIndex + 1) % images.length);
        console.log(111);
      }, 3000);

      // 组件卸载时清除定时器
      return () => {
        clearInterval(timer);
      };
    }
  }, [images.length]);

  const handlePreOne = () => {
    if (imageTemp !== 0) {
      const pre = imageTemp - 1;
      setImageTemp(pre);
      console.log(imageTemp);
    }
  };
  const handleNextOne = () => {
    if (imageTemp < images.length - 1) {
      const next = imageTemp + 1;
      setImageTemp(next);
      console.log(imageTemp);
    }
  };

  return (
    <div className=" w-full h-full flex justify-center items-center ">
      {images.length > 0 && (
        <div className="flex flex-row space-x-2 ">
          <button type="button" className=" text-4xl" onClick={handlePreOne}>
            {'<'}
          </button>
          <div className="flex flex-col p-4 border">
            <Image src={images[imageTemp].image} alt="none" width={500} height={500} />
            <div className="text-center flex flex-row justify-center">
              <div className=" text-gray-500">{imageTemp + 1}</div>
              <div className="text-red-700">/{images.length}</div>
            </div>
          </div>

          <button type="button" className="text-4xl " onClick={handleNextOne}>
            {'>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SliderShow;
