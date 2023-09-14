import { useQuery } from 'urql';

import { CATEGORIES_WITH_PRODUCTS_QUERY } from '../queries';

export default function Sanity() {
  const [result, refresh] = useQuery({
    query: CATEGORIES_WITH_PRODUCTS_QUERY,
    requestPolicy: 'network-only',
  });

  return (
    <div className="thingy">
      <h2>Formidable Boulangerie products:</h2>
      {result.fetching ? (
        <p>Loading categories and products...</p>
      ) : (
        (() => {
          const categoriesWithProducts = result.data?.categoriesWithProducts;
          if (!categoriesWithProducts) return null;

          return (
            <div className="flex flex-row gap-4">
              {categoriesWithProducts.map((category: any) => (
                <div key={category.id} className="flex-1">
                  <h3>{category.name}</h3>
                  <div className="flex flex-col gap-2">
                    {category.products.map((product: any) => {
                      return product.variants.map((variant: any) => (
                        <div className="flex flex-row justify-between ml-4 mr-12">
                          <div>{variant.name}</div>
                          <div>${variant.price.toFixed(2)}</div>
                        </div>
                      ));
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}
      <div className="button-container">
        <button onClick={() => refresh()}>Refresh</button>
      </div>
    </div>
  );
}
