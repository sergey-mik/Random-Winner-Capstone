import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  useEffect(() => {
    fetch(`http://localhost:8088/products`)
      .then((response) => response.json())
      .then((productArray) => {
        setProducts(productArray)
      })
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
        {filteredProducts.map((product) => {
          return (
            <section className="product" key={product.id}>
              <Link className="product_header" to={`/products/${product.id}`}>
                {product.name}
              </Link>
              <div className="product_description">{product.condition}</div>
              <div className="product_cells">Open Cells: {product.openCells}</div>
              <div className="product_price">Price: ${product.price}</div>
            </section>
          )
        })}
      </article>
    </>
  )
}
