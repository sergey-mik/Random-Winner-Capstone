import { Link } from 'react-router-dom'

export const Product = ({ productObject, isStaff, getAllProducts }) => {
  const deleteButton = () => {
    return (
      <button
        onClick={() => {
          fetch(`http://localhost:8088/products/${productObject.id}`, {
            method: 'DELETE',
          }).then(() => {
            getAllProducts()
          })
        }}
        className="f6 link dim br3 ph3 pv2 mb2 dib white bg-red"
      >
        Delete
      </button>
    )
  }

  return (
    <section className="products dib br3 ma3 grow bw3 tc">
      <img
        className="product_img mt3"
        alt="cover"
        src={productObject.coverImage}
      />

      <header className="tc pa3">
        {isStaff ? (
          `${productObject.name}`
        ) : (
          <Link
            className="link underline-hover f4 black"
            to={`/products/${productObject.id}`}
          >
            {productObject.name}
          </Link>
        )}
      </header>
      <div className="i dib measure-narrow pa2 mb2 dark-blue">
        {productObject.condition}
      </div>
      <div></div>
      <div className="pl1 di f4 dark-green">
        Open Cells: {10 - productObject.productBids.length}
      </div>
      <div className="pr1 di ml5 f4 dark-green">
        Price: ${(productObject.price / 10).toFixed(2)}
      </div>
      <div className="mb3"></div>
      <div>{isStaff ? deleteButton() : ''}</div>
    </section>
  )
}
