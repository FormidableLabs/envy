import { Event, HttpRequestState } from '@envyjs/core';

import { elapseTime, requestData } from './util';

const pdp = `{"operationName":"Variants","query":"query Variants($input: VariantsInput!, $includeComparisonFields: Boolean = false) {\n  variants(input: $input) {\n    __typename\n    id\n    masterId\n    productPrice {\n      price\n      salePrice\n      promotionPrice\n      __typename\n    }\n    percentageDiscountBadge\n    name\n    orderable\n    colorValue\n    displayOutOfStock {\n      displayValue\n      __typename\n    }\n    images {\n      href\n      alt\n      __typename\n    }\n    technology @include(if: $includeComparisonFields)\n    runTerrain @include(if: $includeComparisonFields)\n    weight @include(if: $includeComparisonFields)\n    heelToToeDrop @include(if: $includeComparisonFields)\n    fastener @include(if: $includeComparisonFields)\n    pronation @include(if: $includeComparisonFields)\n  }\n}","variables":{"input":{"styleNumberIds":["379233_01","379327_01","622823_01","622831_01","622821_02","622826_01","622822_01","625664_01"]}}}`;

const responseBody = `
{
  "data": {
      "variants": [
          {
              "__typename": "Variant",
              "id": "379233_01",
              "masterId": "379233",
              "productPrice": {
                  "price": 125,
                  "salePrice": 125,
                  "promotionPrice": null,
                  "__typename": "ProductPrice"
              },
              "percentageDiscountBadge": 0,
              "name": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes",
              "orderable": true,
              "colorValue": "01",
              "displayOutOfStock": null,
              "images": [
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/sv01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/mod03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/mod01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/mod02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/bv/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/sv02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/sv03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/sv04/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379233/01/dt01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Men's-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Men's Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  }
              ]
          },
          {
              "__typename": "Variant",
              "id": "379327_01",
              "masterId": "379327",
              "productPrice": {
                  "price": 105,
                  "salePrice": 105,
                  "promotionPrice": null,
                  "__typename": "ProductPrice"
              },
              "percentageDiscountBadge": 0,
              "name": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes",
              "orderable": false,
              "colorValue": "01",
              "displayOutOfStock": {
                  "displayValue": "Sold Out",
                  "__typename": "DisplayOutOfStock"
              },
              "images": [
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379327/01/sv01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Big-Kids'-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379327/01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Big-Kids'-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379327/01/bv/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Big-Kids'-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379327/01/sv02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Big-Kids'-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379327/01/sv03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Big-Kids'-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379327/01/sv04/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Big-Kids'-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/379327/01/dt01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.03-LaFrancé-Big-Kids'-Basketball-Shoes",
                      "alt": "PUMA x LAMELO BALL MB.03 LaFrancé Big Kids' Basketball Shoes, Fluro Green Pes-PUMA Green-Fluro Yellow Pes, extralarge",
                      "__typename": "ProductImage"
                  }
              ]
          },
          {
              "__typename": "Variant",
              "id": "622823_01",
              "masterId": "622823",
              "productPrice": {
                  "price": 40,
                  "salePrice": 40,
                  "promotionPrice": null,
                  "__typename": "ProductPrice"
              },
              "percentageDiscountBadge": 0,
              "name": "PUMA x LAMELO BALL LaFrancé Men's Tee",
              "orderable": true,
              "colorValue": "01",
              "displayOutOfStock": null,
              "images": [
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622823/01/mod01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Tee, PUMA White, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622823/01/mod02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Tee, PUMA White, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622823/01/mod03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Tee, PUMA White, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622823/01/mod04/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Tee, PUMA White, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622823/01/mod05/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Tee, PUMA White, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622823/01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Tee, PUMA White, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622823/01/bv/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Tee, PUMA White, extralarge",
                      "__typename": "ProductImage"
                  }
              ]
          },
          {
              "__typename": "Variant",
              "id": "622831_01",
              "masterId": "622831",
              "productPrice": {
                  "price": 45,
                  "salePrice": 45,
                  "promotionPrice": null,
                  "__typename": "ProductPrice"
              },
              "percentageDiscountBadge": 0,
              "name": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee",
              "orderable": true,
              "colorValue": "01",
              "displayOutOfStock": null,
              "images": [
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622831/01/mod01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-AOP-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee, PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622831/01/mod02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-AOP-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee, PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622831/01/mod03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-AOP-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee, PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622831/01/mod04/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-AOP-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee, PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622831/01/mod05/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-AOP-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee, PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622831/01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-AOP-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee, PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622831/01/bv/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-AOP-Men's-Tee",
                      "alt": "PUMA x LAMELO BALL LaFrancé AOP Men's Tee, PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  }
              ]
          },
          {
              "__typename": "Variant",
              "id": "622826_01",
              "masterId": "622826",
              "productPrice": {
                  "price": 110,
                  "salePrice": 110,
                  "promotionPrice": null,
                  "__typename": "ProductPrice"
              },
              "percentageDiscountBadge": 0,
              "name": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket",
              "orderable": true,
              "colorValue": "01",
              "displayOutOfStock": null,
              "images": [
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622826/01/mod01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Work-Jacket",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket, Teak-Chestnut Brown, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622826/01/mod02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Work-Jacket",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket, Teak-Chestnut Brown, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622826/01/mod03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Work-Jacket",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket, Teak-Chestnut Brown, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622826/01/mod04/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Work-Jacket",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket, Teak-Chestnut Brown, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622826/01/mod05/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Work-Jacket",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket, Teak-Chestnut Brown, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622826/01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Work-Jacket",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket, Teak-Chestnut Brown, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622826/01/bv/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Work-Jacket",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Work Jacket, Teak-Chestnut Brown, extralarge",
                      "__typename": "ProductImage"
                  }
              ]
          },
          {
              "__typename": "Variant",
              "id": "622822_01",
              "masterId": "622822",
              "productPrice": {
                  "price": 90,
                  "salePrice": 90,
                  "promotionPrice": null,
                  "__typename": "ProductPrice"
              },
              "percentageDiscountBadge": 0,
              "name": "PUMA x LAMELO BALL LaFrancé Men's Track Pants",
              "orderable": true,
              "colorValue": "01",
              "displayOutOfStock": null,
              "images": [
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622822/01/mod01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Track-Pants",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Track Pants, Chestnut Brown-Sand Dune-Green Gecko, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622822/01/mod02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Track-Pants",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Track Pants, Chestnut Brown-Sand Dune-Green Gecko, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622822/01/mod03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Track-Pants",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Track Pants, Chestnut Brown-Sand Dune-Green Gecko, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622822/01/mod04/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Track-Pants",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Track Pants, Chestnut Brown-Sand Dune-Green Gecko, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622822/01/mod05/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Track-Pants",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Track Pants, Chestnut Brown-Sand Dune-Green Gecko, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622822/01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Track-Pants",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Track Pants, Chestnut Brown-Sand Dune-Green Gecko, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/622822/01/bv/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Men's-Track-Pants",
                      "alt": "PUMA x LAMELO BALL LaFrancé Men's Track Pants, Chestnut Brown-Sand Dune-Green Gecko, extralarge",
                      "__typename": "ProductImage"
                  }
              ]
          },
          {
              "__typename": "Variant",
              "id": "625664_01",
              "masterId": "625664",
              "productPrice": {
                  "price": 85,
                  "salePrice": 85,
                  "promotionPrice": null,
                  "__typename": "ProductPrice"
              },
              "percentageDiscountBadge": 0,
              "name": "PUMA x LAMELO BALL LaFrancé Hoodie",
              "orderable": true,
              "colorValue": "01",
              "displayOutOfStock": null,
              "images": [
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/625664/01/mod01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Hoodie",
                      "alt": "PUMA x LAMELO BALL LaFrancé Hoodie, Chestnut Brown-PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/625664/01/mod02/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Hoodie",
                      "alt": "PUMA x LAMELO BALL LaFrancé Hoodie, Chestnut Brown-PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/625664/01/mod03/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Hoodie",
                      "alt": "PUMA x LAMELO BALL LaFrancé Hoodie, Chestnut Brown-PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/625664/01/mod04/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Hoodie",
                      "alt": "PUMA x LAMELO BALL LaFrancé Hoodie, Chestnut Brown-PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/625664/01/mod05/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Hoodie",
                      "alt": "PUMA x LAMELO BALL LaFrancé Hoodie, Chestnut Brown-PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/625664/01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Hoodie",
                      "alt": "PUMA x LAMELO BALL LaFrancé Hoodie, Chestnut Brown-PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  },
                  {
                      "href": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/625664/01/bv/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-LaFrancé-Hoodie",
                      "alt": "PUMA x LAMELO BALL LaFrancé Hoodie, Chestnut Brown-PUMA Green, extralarge",
                      "__typename": "ProductImage"
                  }
              ]
          }
      ]
  }
}`;

// Large GQL query
const gqlQuery: Event = {
  id: '277',
  parentId: undefined,
  serviceName: 'web',
  timestamp: elapseTime(0.1),
  http: {
    ...requestData('POST', 'localhost', 3000, '/api/graphql'),
    state: HttpRequestState.Received,
    requestHeaders: {
      'authorization':
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o',
      'content-type': ['application/json'],
      'Accept': ['*/*'],
      'User-Agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
      'Accept-Encoding': ['gzip,deflate'],
    },
    requestBody: JSON.stringify({
      query: pdp,
      operationName: 'PDP',
      variables: {
        id: 12,
      },
    }),
    // ---------
    statusCode: 200,
    statusMessage: 'OK',
    responseHeaders: {
      'x-powered-by': 'Express',
      'cache-control': 'private, no-store',
      'surrogate-key': 'all',
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'content-type': 'application/json',
      'content-length': '28',
      'vary': 'Accept-Encoding',
      'date': 'Thu, 17 Mar 2022 19:51:01 GMT',
      'connection': 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    responseBody,
    duration: 500,
  },
  graphql: {
    operationType: 'Query',
    query: pdp,
    operationName: 'PDP',
    variables: { id: 12 },
  },
};

export default [gqlQuery];
