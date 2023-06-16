import create from 'zustand';

const useStore = create((set, get) => ({
  searchText: '',
  setSearchText: (text) => set(() => ({ searchText: text })),
  productData: {},
  setProductData: (data) => set(() => ({ productData: data })),
  isProductsChanged: false,
  setIsProductsChanged: (state) => set(() => ({ isProductsChanged: state })),
  getIsProductsChanged: () => get().isProductsChanged, // 添加用于获取状态的方法
}));

export default useStore;
