import { Link } from 'react-router-dom'

export const Product = ({ productObject, isStaff, getAllProducts }) => {

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
      <div className="product_cells">Open Cells: {productObject.openCells}</div>
      <div className="product_price">Price: ${productObject.price}</div>
      <div>
        {
        isStaff 
        ? deleteButton() : ''
        }</div>
    </section>
  )
}
