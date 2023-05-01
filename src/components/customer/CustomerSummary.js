import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const CustomerSummary = () => {
  const [productBids, setProductBids] = useState([])
  const [filteredProductBids, setFilteredProductBids] = useState([])
  
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [bids, setBids] = useState([])

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  const getAllProducts = () => {
    fetch(`http://localhost:8088/products`)
      .then((response) => response.json())
      .then((productObject) => {
        setProducts(productObject)
      })
  }

  const getProductsBids = () => {
    fetch(`http://localhost:8088/productBids`)
      .then((response) => response.json())
      .then((productBidsObject) => {
        setBids(productBidsObject)
      })
  }

  useEffect(() => {
    getAllProducts()
    getProductsBids()

    fetch(`http://localhost:8088/customers`)
      .then((response) => response.json())
      .then((employeeArray) => {
        setClients(employeeArray)
      })
  }, [])

  const WonProducts = products.map((product) => {
    if (product.productWon) {
      bids.map((bid) => {
        if (bid.userId === randomUserObject.id) {
          if ((bid.productId === product.id) && (product.productWon === bid.cellOrder)) {
            product.wonCustomerId = bid.userId
          }
        }
      })
    }
    return product
  })

  // get bids
  useEffect(() => {
    fetch(`http://localhost:8088/productBids`)
      .then((response) => response.json())
      .then((productArray) => {
        setProductBids(productArray)
      })
  }, [])

  // filter bids and show only one title
  useEffect(() => {
    const title = [
      ...new Map(
        productBids.map((product) => [product.productId, product])
      ).values(),
    ]
    const myBids = title.filter(
      (productTitle) => productTitle.userId === randomUserObject.id
    )
    setFilteredProductBids(myBids)
  }, [productBids])


  return (
    <>
      <section>
        <h2>Summary</h2>

        <article className="">
          {filteredProductBids.map((bid) => (
            <div key={bid.id}>
              Your Bids:
              <Link to={`/products/${bid.productId}`}> {bid.name}</Link>
            </div>
          ))}

          {WonProducts.map((product) => {
            if (
              product.wonCustomerId &&
              randomUserObject.id === product.wonCustomerId
            ) {
              return (
                <div key={product.id}>
                  Product Won:
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </div>
              )
            }
          })}

          {WonProducts.map((product) => {
            if (
              product.productWon &&
              randomUserObject.id !== product.wonCustomerId
            ) {
              return (
                <div key={product.id}>
                  Product Lost:
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </div>
              )
            }
          })}
        </article>
      </section>
    </>
  )
}
