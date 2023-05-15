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
          if (
            bid.productId === product.id &&
            product.productWon === bid.cellOrder
          ) {
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
      <section className="measure center">
        <article className="shadow br3 ma3 grow bw3">
          <h2 className="mt4 pt3">Product Won</h2>
          {WonProducts.map((product) => {
            if (
              product.wonCustomerId &&
              randomUserObject.id === product.wonCustomerId
            ) {
              return (
                <div className="pb2" key={product.id}>
                  <Link
                    className="link underline-hover f4 dark-green"
                    to={`/products/${product.id}`}
                  >
                    {product.name}
                  </Link>
                </div>
              )
            }
          })}
        </article>

        <article className="shadow br3 ma3 grow bw3">
          <h2 className="mt4 pt3">Product Lost</h2>
          {WonProducts.map((product) => {
            if (
              product.productWon &&
              randomUserObject.id !== product.wonCustomerId
            ) {
              return (
                <div className="pb2" key={product.id}>
                  <Link
                    className="link underline-hover f4 light-red"
                    to={`/products/${product.id}`}
                  >
                    {product.name}
                  </Link>
                </div>
              )
            }
          })}
        </article>

        <article className="shadow br3 ma3 grow bw3">
          <h2 className="mt4 pt3">Your Bids</h2>
          {filteredProductBids.map((bid) => (
            <div className="pb2" key={bid.id}>
              <Link
                className="link underline-hover f4 dark-blue"
                to={`/products/${bid.productId}`}
              >
                {bid.name}
              </Link>
            </div>
          ))}
        </article>
      </section>
    </>
  )
}
