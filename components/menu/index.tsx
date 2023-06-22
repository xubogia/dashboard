import { Menu, Transition } from '@headlessui/react';
import { FC, Fragment, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface Props {
  items: any[];
  choose: (category: string) => void;
  delete:(category:string)=>void
}

const Index: FC<Props> = (props) => {
  const [selectedItem, setSelectedItem] = useState<string>('所有类别');

  return (
    <div className='w-56 text-left'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button
            className='inline-flex w-full justify-center rounded-md bg-red-800  px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            {selectedItem}
            <ChevronDownIcon
              className='ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items
            className='absolute z-20 left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1 '>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={` 
                ${
                      active ? 'bg-gray-100 ' : selectedItem === '所有类别' ? 'bg-gray-200' : ''
                    }
                 group flex w-full  items-center rounded-md px-2 py-2 text-sm`}
                    type='button'
                    onClick={() => {
                      props.choose('所有类别');
                      setSelectedItem('所有类别');
                    }}
                  >
                    所有类别
                  </button>
                )}
              </Menu.Item>
              {props.items.map((item) => (
                <Menu.Item>
                  {({ active }) => (
                    <div className={`flex justify-between items-center ${
                      active ? 'bg-gray-100 ' : selectedItem === item ? 'bg-gray-200' : ''
                    }`}>
                      <button
                        className={` group flex w-2/3 items-center rounded-md px-2 py-2 text-sm`}
                        type='button'
                        onClick={() => {
                          props.choose(item);
                          setSelectedItem(item);
                        }}
                      >
                        {item}
                      </button>
                      <div className='w-6 h-6 flex justify-center items-center text-center'>
                        <button type='button' className='  text-red-500' onClick={()=>props.delete(item)}>x</button>
                      </div>
                    </div>

                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Index;
