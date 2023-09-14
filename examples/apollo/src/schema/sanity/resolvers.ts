import { getAllCategories, getAllProducts } from './queries';
import { transformCategoryData, transformProductData } from './transformers';

export default {
  Query: {
    async allCategories() {
      const categories = await getAllCategories();
      return categories.map(transformCategoryData);
    },

    async allProducts() {
      const products = await getAllProducts();
      return products.map(transformProductData);
    },

    async categoriesWithProducts() {
      const categories = await this.allCategories();
      const products = await this.allProducts();

      return categories.map((category: any) => ({
        ...category,
        products: products.filter((product: any) => product.categoryIds?.includes(category.id)),
      }));
    },
  },
};
