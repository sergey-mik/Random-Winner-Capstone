import { useEffect, useReducer, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import credit from '../../img/dollar.png'
import bids from '../../img/bid.png'
import counter from '../../img/random.gif'

export const PlayGround = () => {
  const [product, updateProduct] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const { productId } = useParams()
  // const ref = useRef(null)
  const [droped, update] = useState({
    userId: '',
    name: '',
    productId: '',
    cellOrder: '',
  })

  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0)

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  //----------------- get product from JSON ---------->
  useEffect(() => {
    fetch(
      `http://localhost:8088/products?_embed=productBids&productBidId=${productId}`
    )
      .then((response) => response.json())
      .then((data) => {
        const productObject = data[0]
        updateProduct(productObject)
      })
  }, [productId, reducerValue])

  //------------------ post bids to product ------------------->
  const postBidsToAPIOnDrop = () => {
    // Create the object to be saved to the API
    const postBidsToAPI = {
      userId: randomUserObject.id,
      name: product.name,
      productId: product.id,
      cellOrder: droped.cellOrder,
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
        forceUpdate()
      })
  }

  // --------------- Handle Drag and Drop --------->
  const handleOnDragStart = (evt) => {
    // console.log("start", evt);
    evt.dataTransfer.setData('image', evt.target.id)

    //   console.log(
    //     "ProductList() :: handleOnDragStart() :: evt.target.name=" + evt.target.name + " evt.target.value=" + evt.target.value);
  }

  const handleOnDragOver = (evt) => {
    evt.preventDefault()

    const copy = { ...product }
    copy.cellOrder = evt.target.id
    update(copy)

    if (evt.target.className === 'boxes') {
      document.getElementById('box1').innerHTML = 'Excellent choice!'
      // evt.target.style.border = '1px solid red'
    }
    evt.dataTransfer.dropEffect = 'move'

    // console.log('ProductList() :: handleOnDragOver() :: evt.target.name=' + evt.target.name +' evt.target.value=' + evt.target.value)
  }

  const handleDragLeave = (evt) => {
    if (evt.target.className === 'boxes') {
      document.getElementById('box1').innerHTML = 'Drop inside the box!'
      evt.target.style.border = ''
    }
  }

  const handleOnDrop = (evt) => {
    evt.preventDefault()
    postBidsToAPIOnDrop(evt)

    if (navigator.onLine === true) {
      const data = evt.dataTransfer.getData('image')
      console.log('data', data)
      // evt.target.style.animation = 'pusate .5s infinite alternate'
      document.getElementById('box1').innerHTML = 'Place more bids!'
      evt.target.style.border = ''
      const div = evt.target.id
      console.log('div', div)
    }

    // console.log(
    //   'ProductList() :: handleOnDrop() :: evt.target.name=' + evt.target.name + ' evt.target.value=' + evt.target.value)
  }

  // ----Random Pick------>
  const randomPhrase = () => {
    let ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    let divs = document.getElementsByClassName('boxes')
    let item = document.getElementsByClassName('item-1')
    let divId

    while (divs.length > 0) {
      var i = Math.floor(Math.random() * ids.length)
      divs[0].classList.add('item-' + ids[i])
      ids.splice(i, 1)
      divs = [].slice.call(divs, 1)
    }
    item = document.getElementsByClassName('item-1')
    divId = item[0].id
  }

  const blink = () => {
    for (let i = 0; i < 10; i++) {
      const x = document.querySelectorAll('.boxes')
      x[i].style.animation = 'pusate .5s infinite alternate'
    }
  }

  const blinkNot = () => {
    for (let i = 0; i < 10; i++) {
      const x = document.querySelectorAll('.boxes')
      x[i].style.animation = ''
    }
    return <img src={counter} alt="taken" draggable="false" />
  }

  // ----Timer---->
  useEffect(() => {
    if (timeLeft === 0) {
      console.log('TIME LEFT IS 0')
      randomPhrase()
      blinkNot()
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

  // place "used" image once credit is droped
  const cells = product.productBids?.map((cell) => {
    return cell.cellOrder
  })

  const users = product.productBids?.map((cell) => {
    return cell.userId
  })

  const userBids = product.productBids?.map((cell) => {
    if (cell.userId === randomUserObject.id) {
      return cell.cellOrder
    }
  })

  // money spent calculation
  const MoneySpent = () => {
    if (userBids) {
    return <div>Money Spent: ${product.price / 10 + users}</div>
    }
  }
  console.log(product.userId)

  // loads credit and used images inside appropriate cells
  const CellOne = () => {
    if (product.id && cells.includes('one')) {
      if (userBids.includes('one')) {
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

  const CellTwo = () => {
    if (product.id && cells.includes('two')) {
      if (userBids.includes('two')) {
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

  const CellThree = () => {
    if (product.id && cells.includes('three')) {
      if (userBids.includes('three')) {
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

  const CellFour = () => {
    if (product.id && cells.includes('four')) {
      if (userBids.includes('four')) {
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

  const CellFive = () => {
    if (product.id && cells.includes('five')) {
      if (userBids.includes('five')) {
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

  const CellSix = () => {
    if (product.id && cells.includes('six')) {
      if (userBids.includes('six')) {
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

  const CellSeven = () => {
    if (product.id && cells.includes('seven')) {
      if (userBids.includes('seven')) {
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

  const CellEight = () => {
    if (product.id && cells.includes('eight')) {
      if (userBids.includes('eight')) {
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

  const CellNine = () => {
    if (product.id && cells.includes('nine')) {
      if (userBids.includes('nine')) {
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

  const CellTen = () => {
    if (product.id && cells.includes('ten')) {
      if (userBids.includes('ten')) {
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

  return (
    <>
      <button
        onClick={(evt) => {
          evt.preventDefault()
          blink()
          setTimeLeft(5)
        }}
      >
        Winner
      </button>

      <div>{product.name}</div>

      <div className="playground">
        <div
          className="boxes"
          id="one"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellOne />
        </div>
        <div
          className="boxes"
          id="two"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellTwo />
        </div>
        <div
          className="boxes"
          id="three"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellThree />
        </div>
        <div
          className="boxes"
          id="four"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellFour />
        </div>
        <div
          className="boxes"
          id="five"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellFive />
        </div>
        <div
          className="boxes"
          id="six"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellSix />
        </div>
        <div
          className="boxes"
          id="seven"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellSeven />
        </div>
        <div
          className="boxes"
          id="eight"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellEight />
        </div>
        <div
          className="boxes"
          id="nine"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellNine />
        </div>
        <div
          className="boxes"
          id="ten"
          onDragOver={(evt) => handleOnDragOver(evt)}
          onDragLeave={(evt) => handleDragLeave(evt)}
          onDrop={handleOnDrop}
        >
          <CellTen />
        </div>

        <div id="cover">
          <img
            src={product.coverImage}
            className="cover"
            alt="game-cover"
            draggable="false"
          />
        </div>

        <h3 id="info">Your credit</h3>

        {/* <!-- Player's Box --> */}
        <div id="div1">
          {/* <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit10"  name="credit.png"/>
        <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit9"  name="credit.png"/>
            <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit8"  name="credit.png"/>
                <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit7"  name="credit.png"/>
                    <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit6"  name="credit.png"/>
                    <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit5"  name="credit.png"/>
                <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit4"  name="credit.png"/>
            <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit3"  name="credit.png"/>
        <img className="player" src={credit} alt="credit" draggable="true" ondragstart="drag(event)" id="credit2"  name="credit.png"/> */}

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
        <div id="box3">
          <MoneySpent />
        </div>
      </div>
    </>
  )
}
