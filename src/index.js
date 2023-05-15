import { RandomWinner } from './components/RandomWinner'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './app.css'
import 'tachyons'
import { Footer } from './components/footer/Footer'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <BrowserRouter>
    <RandomWinner />
    <Footer/>
  </BrowserRouter>
)
