import { Outlet, Route, Routes } from 'react-router-dom'
import { ProductContainer } from '../products/ProductContainer'
import { PlayGround } from '../playground/PlayGround'
import { ProfilePage } from '../customer/ProfilePage'
import { CustomerSummary } from '../customer/CustomerSummary'

export const CustomerViews = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
          <div className="pt4">
            <h1 className='tc f-6 mb2 mt2 '>RANDOM WINNER</h1>
          </div>
            <Outlet />
          </>
        }
      >
        <Route path="products" element={<ProductContainer />} />
        <Route path="products/:productId" element={<PlayGround />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="summary" element={<CustomerSummary />} />
      </Route>
    </Routes>
  )
}
