import { Menu, Transition } from '@headlessui/react';
import { FC, Fragment, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface Props {
  items: { text: string; fc: () => void }[];
}

const Index: FC<Props> = (props) => {
  const [selectedItem, setSelectedItem] = useState<string>('所有类别');

  return (
    <div className='w-56 text-left'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button
            className='inline-flex w-full justify-center rounded-md bg-blue-500  px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
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
              {props.items.map((item, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 ' : selectedItem === item.text ? 'bg-gray-200' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}

                      onClick={() => {
                        item.fc();
                        setSelectedItem(item.text);
                      }}

                    >
                      {item.text}
                    </button>
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
