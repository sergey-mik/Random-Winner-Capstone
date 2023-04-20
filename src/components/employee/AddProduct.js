import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AddProduct = () => {
  const navigate = useNavigate()
  const [addProduct, update] = useState({
    name: '',
    coverImage: '',
    condition: '',
    productBidId: '',
    price: '',
    openCells: 10,
  })

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  const handleSaveButtonClick = (event) => {
    event.preventDefault()

    const addProductToAPI = {
      userId: randomUserObject.id,
      name: addProduct.name,
      coverImage: addProduct.coverImage,
      condition: addProduct.condition,
      productBidId: addProduct.productBidId,
      price: addProduct.price,
      openCells: addProduct.openCells,
    }

    //----------------- POST product to the API ---------->
    return fetch(`http://localhost:8088/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addProductToAPI),
    })
      .then((response) => response.json())
      .then(() => {
        navigate('/products')
      })
  }

  return (
    <form className="addProductForm">
      <h2 className="addProductForm_title">Add New Product</h2>
      <fieldset>
        <div className="form-group">
          <label htmlFor="condition">Product Name:</label>
          <input
            required
            autoFocus
            type="text"
            className="form-control"
            value={addProduct.name}
            onChange={(evt) => {
              const copy = { ...addProduct }
              copy.name = evt.target.value
              update(copy)
            }}
          />
        </div>
      </fieldset>

      <fieldset>
        <div className="form-group">
          <label htmlFor="condition">Product Condition:</label>
          <input
            type="text"
            className="form-control"
            value={addProduct.condition}
            onChange={(evt) => {
              const copy = { ...addProduct }
              copy.condition = evt.target.value
              update(copy)
            }}
          />
        </div>
      </fieldset>

      <fieldset>
        <div className="form-group">
          <label htmlFor="condition">Product Image:</label>
          <input
            type="text"
            className="form-control"
            value={addProduct.coverImage}
            onChange={(evt) => {
              const copy = { ...addProduct }
              copy.coverImage = evt.target.value
              update(copy)
            }}
          />
        </div>
      </fieldset>

      <fieldset>
        <div className="form-group">
          <label htmlFor="price">Product Price:</label>
          <input
            type="number"
            className="form-control"
            value={addProduct.price}
            onChange={(evt) => {
              const copy = { ...addProduct }
              copy.price = parseFloat(evt.target.value, 2)
              update(copy)
            }}
          />
        </div>
      </fieldset>

      <fieldset>
        <div className="form-group">
          <label htmlFor="price">SKU:</label>
          <input
            type="number"
            className="form-control"
            value={addProduct.productBidId}
            onChange={(evt) => {
              const copy = { ...addProduct }
              copy.productBidId = parseFloat(evt.target.value, 2)
              update(copy)
            }}
          />
        </div>
      </fieldset>

      <button
        onClick={(event) => handleSaveButtonClick(event)}
        className="btn btn-primary"
      >
        Add Product
      </button>
    </form>
  )
}
