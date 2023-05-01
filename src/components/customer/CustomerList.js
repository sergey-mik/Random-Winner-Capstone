import { useEffect, useState } from 'react'

export const CustomerList = () => {
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [bids, setBids] = useState([])

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

  const ClientInfo = products.map((product) => {
    if (product.productWon) {
      bids.map((bid) => {
        if (bid.productId === product.id) {
          if (product.productWon === bid.cellOrder) {
            clients.map((client) => {
              if (bid.userId === client.userId) {
                product.wonClientInfo = client
              }
            })
          }
        }
      })
    }
    return product
  })

  // console.log(ClientInfo)
  return (
    <>
      <section>
        <h2>Client Activity</h2>

        <article className="">
          {ClientInfo.map((product) => {
            if (product.wonClientInfo) {
              return (
                <div key={product.id}>
                  Product Name: {product.name}
                  <div>Client Name: {product.wonClientInfo.fullName}</div>
                  <div>Client Address: {product.wonClientInfo.address}</div>
                  <div>Client Email: {product.wonClientInfo.email}</div>
                </div>
              )
            }
          })}
        </article>
      </section>
    </>
  )
}
