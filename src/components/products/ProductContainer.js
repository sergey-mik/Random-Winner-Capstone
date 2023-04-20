import { useState } from 'react'
import { ProductList } from './ProductList'
import { ProductSearch } from './ProductSeach'

export const ProductContainer = () => {
  const [searchTerms, setSearchTerms] = useState('')

  return (
    <>
      <ProductSearch setterFunction={setSearchTerms} />
      <ProductList searchTermState={searchTerms} />
    </>
  )
}
