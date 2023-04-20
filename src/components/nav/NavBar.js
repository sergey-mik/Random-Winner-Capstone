import { EmployeeNav } from "./EmployeeNav"
import { CustomerNav } from "./CustomerNav"
import "./NavBar.css"

export const NavBar = () => {
const localRandomUser = localStorage.getItem('random_user')
const randomUserObject = JSON.parse(localRandomUser)

  if (randomUserObject.staff) {
    // Return employee views
    return <EmployeeNav />
  } else {
    // Return customer views
    return <CustomerNav />
  }
}