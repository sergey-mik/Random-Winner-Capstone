import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

// Custom hook to fetch data from a given URL
const useFetchData = (url) => {
  const [fetchedData, setFetchedData] = useState([])

  // Fetch data using useEffect and update the fetchedData state
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setFetchedData(data))
  }, [url])

  return fetchedData
}

export const CustomerSummary = () => {
  // Get the random user object from localStorage
  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  // Fetch data using custom hook
  const products = useFetchData('http://localhost:8088/products')
  const productBids = useFetchData('http://localhost:8088/productBids')

  // Filter bids and show only one title
  const filteredProductBids = useMemo(() => {
    const title = [
      ...new Map(
        productBids.map((product) => [product.productId, product])
      ).values(),
    ]
    return title.filter(
      (productTitle) => productTitle.userId === randomUserObject.id
    )
  }, [productBids, randomUserObject.id])

  // Update products based on whether they are won or lost
  const WonProducts = products.map((product) => {
    if (product.productWon) {
      productBids.forEach((bid) => {
        if (
          bid.userId === randomUserObject.id &&
          bid.productId === product.id &&
          product.productWon === bid.cellOrder
        ) {
          product.wonCustomerId = bid.userId
        }
      })
    }
    return product
  })


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
            return null // Return null or some other value when the condition is not met
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
            return null // Return null or some other value when the condition is not met
          })}
        </article>

        <article className="shadow br3 ma3 grow bw3">
          <h2 className="mt4 pt3">Your Bids</h2>
          {filteredProductBids.map((bid) => {
            // Find the corresponding product
            const product = WonProducts.find(
              (product) => product.name === bid.name
            )

            // Check if the product hasn't been won or lost by the current user
            const notWonOrLost =
              !product.productWon ||
              (product.productWon &&
                product.productWon === randomUserObject.email)

            return (
              notWonOrLost && (
                <div className="pb2" key={bid.id}>
                  <Link
                    className="link underline-hover f4 dark-blue"
                    to={`/products/${bid.productId}`}
                  >
                    {bid.name}
                  </Link>
                </div>
              )
            )
          })}
        </article>
      </section>
    </>
  )
}
