import { gql } from 'urql';

export const RANDOM_CAT_FACT_QUERY = gql`
  query RandomCatFact {
    randomCatFact {
      id
      fact
    }
  }
`;

export const RANDOM_COCKTAIL_QUERY = gql`
  query RandomCocktail {
    randomCocktail {
      id
      name
      ingredients
      instructions
      imageUrl
    }
  }
`;

export const LATEST_XKCD_QUERY = gql`
  query LatestXkcd {
    latestXkcd {
      id
      title
      imageUrl
    }
  }
`;

export const CATEGORIES_WITH_PRODUCTS_QUERY = gql`
  query CategoriesWithProducts {
    categoriesWithProducts {
      id
      name
      description
      products {
        id
        name
        description
        categoryIds
        variants {
          id
          name
          price
        }
      }
    }
  }
`;
