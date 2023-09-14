export function transformCategoryData(sanityData: any) {
  return {
    id: sanityData._id,
    name: sanityData.name,
    description: sanityData.description,
  };
}

export function transformProductData(sanityData: any) {
  return {
    id: sanityData._id,
    name: sanityData.name,
    description: sanityData.description?.[0]?.children?.join('\n\n') ?? '',
    categoryIds: sanityData.categories?.map((x: any) => x._id) ?? [],
    variants:
      sanityData.variants?.map((v: any) => ({
        id: v._id,
        name: v.name,
        price: v.price,
      })) ?? [],
  };
}
