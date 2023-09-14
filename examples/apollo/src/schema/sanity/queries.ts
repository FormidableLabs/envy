import { q } from 'groqd';

import Sanity from '../../utils/sanityClient';

const categorySelection = {
  _id: q.string(),
  name: q.string(),
  description: q.string(),
};

export function getAllCategories() {
  const client = new Sanity();
  return client.runQuery(q('*').filterByType('category').grab$(categorySelection));
}

const productsSelection = {
  _id: q.string(),
  name: q.string(),
  description: q.contentBlocks(),
  categories: q('categories').filter().deref().grab$({ _id: q.string() }),
  variants: q('variants').filter().deref().grab$({
    _id: q.string(),
    name: q.string(),
    price: q.number(),
  }),
};

export function getAllProducts() {
  const client = new Sanity();
  return client.runQuery(q('*').filterByType('product').grab$(productsSelection));
}
