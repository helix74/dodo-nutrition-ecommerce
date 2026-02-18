import { type SchemaTypeDefinition } from 'sanity'

import { bannerType } from './bannerType'
import { brandType } from './brandType'
import { categoryType } from './categoryType'
import { customerType } from './customerType'
import { heroSlideType } from './heroSlideType'
import { invoiceType } from './invoiceType'
import { orderType } from './orderType'
import { packType } from './packType'
import { productType } from './productType'
import { reviewType } from './reviewType'
import { supplierType } from './supplierType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [bannerType, brandType, categoryType, customerType, heroSlideType, invoiceType, packType, productType, orderType, reviewType, supplierType],
}

