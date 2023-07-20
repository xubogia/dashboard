import Image from 'next/image';

const RecommendShow = ({ data }: { data: any[] }) => (
  <div className=" w-full h-full flex justify-center pt-14  ">
    <div className="w-1/2  flex  flex-col space-y-2 bg-gray-50 ">
      <div className="p-4 border-b-1 border-red ">推荐</div>
      <div className="max-h-120  flex flex-wrap  overflow-auto ">
        {data.map((item) => (
          <div className="mt-4 w-1/2  flex justify-center    ">
            <div className="relative m-2 w-full flex flex-col bg-white border rounded-lg justify-start">
              <Image src={item.eachDetail[0].image} alt="none" width={160} height={160} />
              <div className="whitespace-normal overflow-wrap-break-word">{item.title}</div>
              <div className="mt-auto">{item.eachDetail[0].amount[0]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RecommendShow;
