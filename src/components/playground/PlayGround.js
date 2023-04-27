import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import credit from '../../img/dollar.png'
import bids from '../../img/bid.png'
import counter from '../../img/random.gif'
import won from '../../img/won.gif'
import lose from '../../img/lose.gif'

export const PlayGround = () => {
  const [product, postToProduct] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const { productId } = useParams()
  // const ref = useRef(null)
  const [dropedd, post] = useState({
    userId: '',
    name: '',
    productId: '',
    cellOrder: '',
  })

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  //----------------- get product from JSON ---------->
  const getProducts = () => {
    fetch(
      `http://localhost:8088/products?_embed=productBids&productBidId=${productId}`
    )
      .then((response) => response.json())
      .then((data) => {
        const productObject = data[0]
        postToProduct(productObject)
      })
  }

  useEffect(() => {
    getProducts()
  }, [productId])

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

  // --------------- Update productWon boolean --------->
  const updateWonProduct = (winner) => {
    const copy = {
      userId: randomUserObject.id,
      name: product.name,
      coverImage: product.coverImage,
      condition: product.condition,
      productBidId: product.productBidId,
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
  }

  // --------------- Handle Drag and Drop --------->
  const handleOnDragStart = (evt) => {
    evt.dataTransfer.setData('credit', evt.target.id)
  }

  const handleOnDragOver = (evt) => {
    evt.preventDefault()

    const copyCellOrder = { ...product }
    copyCellOrder.cellOrder = evt.target.id
    post(copyCellOrder)

    if (evt.target.className === 'cells') {
      document.getElementById('box1').innerHTML = 'Excellent choice!'
      // evt.target.style.border = '1px solid red'
    }
    evt.dataTransfer.dropEffect = 'move'
  }

  const handleDragLeave = (evt) => {
    if (evt.target.className === 'cells') {
      document.getElementById('box1').innerHTML = 'Drop inside the box!'
      evt.target.style.border = ''
    }
  }

  const handleOnDrop = (evt) => {
    evt.preventDefault()
    postBidsToAPIOnDrop(evt)

    if (product.productBids.length === 9) {
      blink()
      setTimeLeft(5)
    } else {
      const data = evt.dataTransfer.getData('credit')
      console.log(data)
      // evt.target.style.animation = 'pusate .5s infinite alternate'
      document.getElementById('box1').innerHTML = 'Place more bids!'
      evt.target.style.border = ''
    }
  }

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
    // add timeLeft as a dependency to re-rerun the effect when we update it
  }, [timeLeft])

  // ----Random Pick------>
  const randomPhrase = () => {
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
    // item = document.getElementsByClassName('item-1')
    divId = item[0].id
    console.log(divId)
    // console.log(cells)
    updateWonProduct(divId)
  }

  const blink = () => {
    for (let i = 0; i < 10; i++) {
      const x = document.querySelectorAll('.cells')
      x[i].style.animation = 'pusate .5s infinite alternate'
    }
  }

  const BlinkNot = () => {
    for (let i = 0; i < 10; i++) {
      const x = document.querySelectorAll('.cells')
      x[i].style.animation = ''
    }
  }

  // place "used" image once credit is droped
  const cells = product.productBids?.map((cell) => {
    return cell.cellOrder
  })

  // compare current user and the one already placed bids.filter(e => !e.selectedFields.includes("Red"))
  let userBids = (product.productBids?.map((cell) => {
      if (cell.userId === randomUserObject.id) {
        return cell.cellOrder
      }
    }))
     //.filter(x => x !== undefined)

  
  let notUserBids = product.productBids?.map((cell) => {
      if (cell.userId !== randomUserObject.id) {
        return cell.cellOrder
      }
    }).filter((x) => x !== undefined)

  const Credit = () => {
    return <div id="box3">One Credit = ${product.price / 10}</div>
  }

  const Money = () => {
    return (
      <div id="box3">
        Money Spent: ${(product.price / 10) * userBids?.length}
      </div>
    )
  }

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
              width: '151px',
              height: '71px',
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
      <button
        onClick={(evt) => {
          evt.preventDefault()
        }}
      >
        Winner
      </button>

      <div>{product.name}</div>

      <div className="playground">
        <div
          className="cells"
          id="one"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="one" />
          <Winner num="one" />
        </div>
        <div
          className="cells"
          id="two"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="two" />
          <Winner num="two" />
        </div>
        <div
          className="cells"
          id="three"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="three" />
          <Winner num="three" />
        </div>
        <div
          className="cells"
          id="four"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="four" />
          <Winner num="four" />
        </div>
        <div
          className="cells"
          id="five"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="five" />
          <Winner num="five" />
        </div>
        <div
          className="cells"
          id="six"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="six" />
          <Winner num="six" />
        </div>
        <div
          className="cells"
          id="seven"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="seven" />
          <Winner num="seven" />
        </div>
        <div
          className="cells"
          id="eight"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="eight" />
          <Winner num="eight" />
        </div>
        <div
          className="cells"
          id="nine"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="nine" />
          <Winner num="nine" />
        </div>
        <div
          className="cells"
          id="ten"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <Cell num="ten" />
          <Winner num="ten" />
        </div>

        <div id="cover">
          <CoverImage />
        </div>

        <h3 id="info">Your credit</h3>

        {/* <!-- Player's Cell --> */}
        <div id="div1">
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
        <br></br>
        <div className="transbox">
          <div id="box1"></div>
        </div>
        <div id="box2">DO not spend MORE than you can afford to LOSE!</div>

        <Credit />
        <Money />
      </div>
    </>
  )
}
