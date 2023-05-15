import { EmployeeViews } from './EmployeeViews'
import { CustomerViews } from './CustomerViews'

export const ApplicationViews = () => {
const localRandomUser = localStorage.getItem('random_user')
const randomUserObject = JSON.parse(localRandomUser)

  if (randomUserObject.staff) {
    // Return employee views
    return <EmployeeViews />
  } else {
    // Return customer views
    return <CustomerViews /> 
  }

}
