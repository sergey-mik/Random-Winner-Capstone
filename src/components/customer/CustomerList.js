import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const CustomerList = () => {
  const [clients, getClients] = useState([])
  const [products, getProducts] = useState([])
  const [bids, getBids] = useState([])

    const getAllProducts = () => {
    fetch(`http://localhost:8088/products`)
      .then((response) => response.json())
      .then((productObject) => {
        getProducts(productObject)
      })
  }

  const getProductsBids = () => {
    fetch(`http://localhost:8088/productBids`)
      .then((response) => response.json())
      .then((productBidsObject) => {
        getBids(productBidsObject)
      })
  }

    useEffect(
      () => {
        getAllProducts()
        getProductsBids()
        
        fetch(`http://localhost:8088/customers`)
          .then((response) => response.json())
          .then((employeeArray) => {
            getClients(employeeArray)
          })
      },
      [] 
    )   

    //console.log(bids)
    console.log(products)

  return (
    <>
      <section>
        <h2>Client Activity</h2>

        <article className="">
          {/* <div>Address: {clients?.address}</div>
          <div>Phone Number: {clients?.phoneNumber}</div> */}
          <div>
            {products.map((product) => {
              
              // <div>Product Name: {product}</div>
              if (product.productWon) {
                return <div>Product Name: {product.name}</div>
              }
            })}
          </div>
        </article>
      </section>
    </>
  )
}
