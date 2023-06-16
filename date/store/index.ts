import create from 'zustand';


const useStore = create((set, get) => ({
  searchText: '',
  setSearchText: (text:string) => set(() => ({ searchText: text })),
  productData: {},
  setProductData: (data:any) => set(() => ({ productData: data })),
  isProductsChanged: false,
  setIsProductsChanged: (state:boolean) => set(() => ({ isProductsChanged: state })),
  // @ts-ignore
  getIsProductsChanged: () => get().isProductsChanged, // 添加用于获取状态的方法
}));

export default useStore;
