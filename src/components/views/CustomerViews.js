import { Outlet, Route, Routes } from 'react-router-dom'
import { ProductContainer } from '../products/ProductContainer'
import { PlayGround } from '../playground/PlayGround'
import { ProfilePage } from '../customer/ProfilePage'

export const CustomerViews = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1>Random Winner</h1>

            <Outlet />
          </>
        }
      >
        <Route path="products" element={<ProductContainer />} />
        <Route path="products/:productId" element={<PlayGround />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
