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

  return (
    <>
      <section className="measure center shadow br3 ma3 grow bw3">
        <h2 className="mt4 pt3">Ready To Ship</h2>

        <article>
          {ClientInfo.map((product) => {
            if (product.wonClientInfo) {
              return (
                <article className="pb3" key={product.id}>
                  <hr />
                  <div className="pl4 pb1 tl">Product Name: {product.name}</div>
                  <div className="pl5 tl">
                    Client Name: {product.wonClientInfo.fullName}
                  </div>
                  <div className="pl5 tl">
                    Client Address: {product.wonClientInfo.address}
                  </div>
                  <div className="pl5 tl">
                    Client Email: {product.wonClientInfo.email}
                  </div>
                </article>
              )
            }
          })}
        </article>
      </section>
    </>
  )
}
