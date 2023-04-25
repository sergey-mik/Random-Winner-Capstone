import { useEffect, useState } from 'react'
import { Product } from './Product'
import './Products.css'

export const ProductList = ({ searchTermState }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFiltered] = useState([])

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  //----------------- product search bar ---------->
  useEffect(() => {
    const searchedProduct = products.filter((product) => {
      return product.name
        .toLowerCase()
        .startsWith(searchTermState.toLowerCase())
    })
    setFiltered(searchedProduct)
  }, [searchTermState])

  //----------------- get product from JSON ---------->
  const getAllProducts = () => {
    fetch(`http://localhost:8088/products?_embed=productBids`)
      .then((response) => response.json())
      .then((productArray) => {
        setProducts(productArray)
      })
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  //----------------- filter users and customers ---------->
  useEffect(() => {
    if (randomUserObject.staff) {
      // for employees
      setFiltered(products)
    } else {
      // for customers
      // const myProducts = products.filter(
      //   (product) => product.userId === randomUserObject.id
      // )
      setFiltered(products)
    }
  }, [products])

  return (
    <>
      <h2>List of Products</h2>

      <article className="products">
        {filteredProducts.map((product) => (
          <Product
            isStaff={randomUserObject.staff}
            key={`ticket--${product.id}`}
            getAllProducts={getAllProducts}
            productObject={product}
          />
        ))}
      </article>
    </>
  )
}
