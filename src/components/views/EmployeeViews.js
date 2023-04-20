import { Outlet, Route, Routes } from "react-router-dom"
import { ProductContainer } from "../products/ProductContainer"
import { PlayGround } from "../products/PlayGround"
import { AddProduct } from "../employee/AddProduct"


export const EmployeeViews = () => {
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
        <Route path="addProduct" element={<AddProduct />} />
        <Route path="products/:productId" element={<PlayGround />} />
      </Route>
    </Routes>
  )
}
