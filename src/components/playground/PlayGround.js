import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import credit from '../../img/dollar.png'
import bids from '../../img/bid.png'
import won from '../../img/won.gif'
import lose from '../../img/lose.gif'
import './playground.css'

export const PlayGround = () => {
  const [product, postToProduct] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const { productId } = useParams()
  const [dropedd, post] = useState({
    userId: '',
    name: '',
    productId: '',
    cellOrder: '',
  })

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  //----------------- get product from JSON ---------->
  const getProducts = useCallback(() => {
    fetch(`http://localhost:8088/products?_embed=productBids&id=${productId}`)
      .then((response) => response.json())
      .then((data) => {
        const productObject = data[0]
        postToProduct(productObject)
      })
  }, [productId, postToProduct])

  useEffect(() => {
    getProducts()
  }, [getProducts])

  //------------------ post bids to product ------------------->
  const postBidsToAPIOnDrop = () => {
    // Create the objects to be saved to the API
    const postBidsToAPI = {
      userId: randomUserObject.id,
      name: product.name,
      productId: product.id,
      cellOrder: dropedd.cellOrder,
    }

    return fetch(`http://localhost:8088/productBids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBidsToAPI),
    })
      .then((response) => response.json())
      .then(() => {
        getProducts()
      })
  }

  // --------------- Update productWon in Products --------->
  const updateWonProduct = useCallback(
    (winner) => {
      const copy = {
        userId: product.userId,
        name: product.name,
        coverImage: product.coverImage,
        condition: product.condition,
        price: product.price,
        productWon: winner,
      }

      return fetch(`http://localhost:8088/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(copy),
      })
        .then((response) => response.json())
        .then(getProducts)
    },
    [product, getProducts]
  )

  // --------------- Handle Drag and Drop --------->
  const handleOnDragStart = (evt) => {
    evt.dataTransfer.setData('credit', evt.target.id)
  }

  const handleOnDragOver = (evt) => {
    evt.preventDefault()

    const copyCellOrder = { ...product }
    copyCellOrder.cellOrder = evt.target.id
    post(copyCellOrder)

    if (evt.target.className === 'cells tl bg-white') {
      document.getElementById('box1').innerHTML = 'Excellent choice!'
      evt.target.style.border = '1px solid red'
    }
    evt.dataTransfer.dropEffect = 'move'
  }

  const handleDragLeave = (evt) => {
    if (evt.target.className === 'cells tl bg-white') {
      document.getElementById('box1').innerHTML = 'Drop inside the cell!'
      evt.target.style.border = ''
    }
  }

  const handleOnDrop = (evt) => {
    evt.preventDefault()
    postBidsToAPIOnDrop(evt)

    if (product.productBids.length === 9) {
      evt.target.style.border = ''
      blink()
      setTimeLeft(5)
    } else {
      const data = evt.dataTransfer.getData('credit')
      console.log(data)
      document.getElementById('box1').innerHTML = 'Place more bids!'
      evt.target.style.border = ''
    }
  }

  // ----Random Pick------>
  const randomPhrase = useCallback(() => {
    let ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    let divs = document.getElementsByClassName('cells')
    let item = document.getElementsByClassName('item-1')
    let divId

    while (divs.length > 0) {
      let i = Math.floor(Math.random() * ids.length)
      divs[0].classList.add('item-' + ids[i])
      ids.splice(i, 1)
      divs = [].slice.call(divs, 1)
    }

    if (item.length > 0) {
      divId = item[0].id
      console.log(divId)
      updateWonProduct(divId)
    } else {
      console.log('No items found')
    }
  }, [updateWonProduct])

  const blink = () => {
    for (let i = 0; i < 10; i++) {
      const x = document.querySelectorAll('.cells')
      x[i].style.animation = 'pusate .5s infinite alternate'
    }
  }

  const BlinkNot = useCallback(() => {
    const cells = document.querySelectorAll('.cells')
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.animation = ''
    }
  }, [])

  // ----Timer---->
  useEffect(() => {
    if (timeLeft === 0) {
      console.log('time left 0')
      randomPhrase()
      BlinkNot()
      setTimeLeft(null)
    }
    // exit early when we reach 0
    if (!timeLeft) return
    // save intervalId to clear the interval when the component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId)
    // add timeLeft as a dependency to re-run the effect when we update it
  }, [timeLeft, randomPhrase, BlinkNot])

  // place "used" image once credit is droped
  const cells = product.productBids?.map((cell) => {
    return cell.cellOrder
  })

  // compare current user and the one already placed bids
  const userBids = product.productBids
    ?.filter((cell) => cell.userId === randomUserObject.id)
    .map((cell) => cell.cellOrder)

  const notUserBids = product.productBids
    ?.filter((cell) => cell.userId !== randomUserObject.id)
    .map((cell) => cell.cellOrder)

  // loads credit and used images inside appropriate cells
  const Cell = ({ num }) => {
    if (product.id && cells.includes(num)) {
      if (userBids.includes(num)) {
        return (
          <img src={credit} alt="taken" className="player" draggable="false" />
        )
      } else {
        return (
          <img src={bids} alt="taken" className="player" draggable="false" />
        )
      }
    }
  }

  const Winner = ({ num }) => {
    if (product.id && cells.includes(num)) {
      if (product.productWon.includes(num)) {
        return (
          <div
            style={{
              backgroundColor: '#90dda7',
              width: '155px',
              height: '75px',
            }}
          ></div>
        )
      }
    }
  }

  const CoverImage = () => {
    if (product.id) {
      let picture = ''
      if (userBids.includes(product.productWon)) {
        picture = won
      } else if (notUserBids.includes(product.productWon)) {
        picture = lose
      } else {
        picture = product.coverImage
      }
      return (
        <img
          src={picture}
          className="cover"
          alt="game-cover"
          draggable="false"
        />
      )
    }
  }

  return (
    <>
      <div className="pa3 mb3 f2">{product.name}</div>

      <div className="playground">
        <div
          className="cells tl bg-white"
          id="one"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="one" />
          <Winner num="one" />
        </div>
        <div
          className="cells tl bg-white"
          id="two"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="two" />
          <Winner num="two" />
        </div>
        <div
          className="cells tl bg-white"
          id="three"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="three" />
          <Winner num="three" />
        </div>
        <div
          className="cells tl bg-white"
          id="four"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="four" />
          <Winner num="four" />
        </div>
        <div
          className="cells tl bg-white"
          id="five"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="five" />
          <Winner num="five" />
        </div>
        <div
          className="cells tl bg-white"
          id="six"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="six" />
          <Winner num="six" />
        </div>
        <div
          className="cells tl bg-white"
          id="seven"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="seven" />
          <Winner num="seven" />
        </div>
        <div
          className="cells tl bg-white"
          id="eight"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="eight" />
          <Winner num="eight" />
        </div>
        <div
          className="cells tl bg-white"
          id="nine"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="nine" />
          <Winner num="nine" />
        </div>
        <div
          className="cells tl bg-white"
          id="ten"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="ten" />
          <Winner num="ten" />
        </div>

        <div className="tl" id="cover">
          <CoverImage />
        </div>

        <div className="pb3 pt4" id="info">
          Your Credit
        </div>

        {/* <!-- Player's Cell --> */}
        <div className="tl bg-white" id="div1">
          <img
            className="player"
            src={credit}
            alt="credit"
            draggable="true"
            onDragStart={handleOnDragStart}
            id="credit1"
            name="credit.png"
          />
        </div>
      </div>

      <div className="mt5">
        <div id="box1">Drop inside the cell!</div>
      </div>

      <div className="pt4" id="box2">
        DO not spend MORE than you can afford to LOSE!
      </div>

      <div className="mt5">
        <div className="di pr6 pl6 pt1 pb1 normal bg-black-70" id="box3">
          One Credit = ${(product.price / 10).toFixed(2)}
        </div>
        <div className="di pl6 pr6 pt1 pb1 normal bg-black-70" id="box3">
          Money Spent: ${((product.price / 10) * userBids?.length).toFixed(2)}
        </div>
      </div>
    </>
  )
}
