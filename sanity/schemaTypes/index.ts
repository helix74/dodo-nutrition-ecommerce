import { type SchemaTypeDefinition } from 'sanity'

import { bannerType } from './bannerType'
import { brandType } from './brandType'
import { categoryType } from './categoryType'
import { customerType } from './customerType'
import { orderType } from './orderType'
import { packType } from './packType'
import { productType } from './productType'
import { reviewType } from './reviewType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [bannerType, brandType, categoryType, customerType, packType, productType, orderType, reviewType],
}

