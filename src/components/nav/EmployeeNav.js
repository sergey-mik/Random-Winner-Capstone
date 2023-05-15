import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const EmployeeNav = () => {
    const navigate = useNavigate()

    return (
      <header className="bg-black-90 w-100 ph3 pv3 ph4-m ph5-l">
        <nav className="f6 fw6 ttu tracked">
          <ul className="navbar">
            <li className="navbar__item">
              <Link className="link dim white dib mr3" to="/products">
                PRODUCTS
              </Link>
            </li>
            <li className="navbar__item">
              <Link className="link dim white dib mr3" to="/addProduct">
                ADD PRODUCT
              </Link>
            </li>
            <li className="navbar__item">
              <Link className="link dim white dib mr3" to="/customerList">
                CUSTOMER LIST
              </Link>
            </li>
            {localStorage.getItem('random_user') ? (
              <li className="navbar__item navbar__logout">
                <Link
                  className="link dim white dib"
                  to=""
                  onClick={() => {
                    localStorage.removeItem('random_user')
                    navigate('/', { replace: true })
                  }}
                >
                  LOGOUT
                </Link>
              </li>
            ) : (
              ''
            )}
          </ul>
        </nav>
      </header>
    )
}