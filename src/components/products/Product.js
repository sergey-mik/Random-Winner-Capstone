import { Link } from 'react-router-dom'

export const Product = ({ productObject, isStaff, getAllProducts, updateOpenCells }) => {

  const deleteButton = () => {
    return (
      <button onClick={() => {
          fetch(`http://localhost:8088/products/${productObject.id}`, {
            method: 'DELETE'
          })
          .then(() => {
            getAllProducts()
          })
        }} className="product_delete">Delete</button>
    )
  }

// console.log(productObject.productBids.length)

  return (
    <section className="product">
      <header className="product_header">
        {
        isStaff 
        ? `${productObject.name}`
        : <Link to={`/products/${productObject.id}`}>{productObject.name}</Link>
        }
      </header>
      <div className="product_description">{productObject.condition}</div>
      <div className="product_cells">Open Cells: {10 - productObject.productBids.length}</div>
      <div className="product_price">Price: ${productObject.price / 10}</div>
      <div>
        {
        isStaff 
        ? deleteButton() : ''
        }</div>
    </section>
  )
}
