import { Outlet, Route, Routes } from 'react-router-dom'
import { ProductContainer } from '../products/ProductContainer'
import { PlayGround } from '../playground/PlayGround'
import { AddProduct } from '../employee/AddProduct'
import { CustomerList } from '../customer/CustomerList'

export const EmployeeViews = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div className="pt4">
              <h1 className="tc f-6 mb2 mt2">RANDOM WINNER</h1>
            </div>
            <Outlet />
            
          </>
        }
        >
        <Route path="products" element={<ProductContainer />} />
        <Route path="addProduct" element={<AddProduct />} />
        <Route path="products/:productId" element={<PlayGround />} />
        <Route path="customerList" element={<CustomerList />} />
      </Route>
    </Routes>
  )
}
