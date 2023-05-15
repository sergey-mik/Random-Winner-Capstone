import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AddProduct = () => {
  const navigate = useNavigate()
  const [addProduct, update] = useState({
    name: '',
    coverImage: '',
    condition: '',
    price: ''
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
      price: addProduct.price,
      productWon: '',
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
    <form className="shadow measure center br3">
      <h2 className="pt3">Add New Product</h2>
      <fieldset>
        <div className="db fw6 lh-copy tl">
          <label htmlFor="condition">Product Name:</label>
          <input
            type="text"
            className="pa2 w-100"
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
        <div className="db fw6 lh-copy tl">
          <label htmlFor="condition">Product Condition:</label>
          <input
            type="text"
            className="pa2 w-100"
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
        <div className="db fw6 lh-copy tl">
          <label htmlFor="condition">Product Image:</label>
          <input
            type="text"
            className="pa2 w-100"
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
        <div className="db fw6 lh-copy tl">
          <label htmlFor="price">Product Price:</label>
          <input
            type="number"
            className="pa2 w-100"
            value={addProduct.price}
            onChange={(evt) => {
              const copy = { ...addProduct }
              copy.price = parseFloat(evt.target.value, 2)
              update(copy)
            }}
          />
        </div>
      </fieldset>

      <button
        onClick={(event) => handleSaveButtonClick(event)}
        className="f6 link dim br3 ph3 pv2 mt2 mb3 dib white bg-near-black"
      >
        Add Product
      </button>
    </form>
  )
}
