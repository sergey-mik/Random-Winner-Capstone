import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const CustomerSummary = () => {
  const [productBids, setProductBids] = useState([])
  const [filteredProductBids, setFilteredProductBids] = useState([])
  const [productWon, setProductWon] = useState([])
  const [productLost, setProductLost] = useState([])
  const [filteredProductWon, setFilteredProductWon] = useState([])
  const [filteredProductLost, setFilteredProductLost] = useState([])

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  // get bids
  useEffect(() => {
    fetch(`http://localhost:8088/productBids`)
      .then((response) => response.json())
      .then((productArray) => {
        setProductBids(productArray)
      })
  }, [])

  // get won products
  useEffect(() => {
    fetch(`http://localhost:8088/products`)
      .then((response) => response.json())
      .then((productArray) => {
        setProductWon(productArray)
      })
  }, [])

  // get lost products
  useEffect(() => {
    fetch(`http://localhost:8088/products`)
      .then((response) => response.json())
      .then((productArray) => {
        setProductLost(productArray)
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

  // filter won product
  useEffect(() => {
    const wonProduct = productWon.filter(
      (won) => won.userId !== randomUserObject.id && won.productWon !== ''
    )
    setFilteredProductWon(wonProduct)
  }, [productWon])

  // filter lost product
  useEffect(() => {
    const lostProduct = productLost.filter(
      (lost) => lost.userId !== randomUserObject.id 
    )
    setFilteredProductLost(lostProduct)
  }, [productLost])

// console.log(filteredProductBids)

  return (
    <>
      <section>
        <h2>Summary</h2>

        <article className="">
          {filteredProductBids.map((bids) => (
            <div key={bids.id}>
              Your Bids:
              <Link to={`/products/${bids.productId}`}> {bids.name}</Link>
            </div>
          ))}
          {filteredProductWon.map((won) => (
            <div key={won.id}>
              Product Won:
              <Link to={`/products/${won.id}`}> {won.name}</Link>
            </div>
          ))}
          {filteredProductLost.map((lost) => (
            <div key={lost.id}>
              Product Lost:
              <Link to={`/products/${lost.id}`}> {lost.name}</Link>
            </div>
          ))}
        </article>
      </section>
    </>
  )
}