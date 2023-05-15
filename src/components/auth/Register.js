import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

export const Register = (props) => {
    const [customer, setCustomer] = useState({
        email: "",
        fullName: "",
        isStaff: false
    })
    let navigate = useNavigate()

    const registerNewUser = () => {
        return fetch("http://localhost:8088/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        })
            .then(res => res.json())
            .then(createdUser => {
                if (createdUser.hasOwnProperty("id")) {
                    localStorage.setItem("honey_user", JSON.stringify({
                        id: createdUser.id,
                        staff: createdUser.isStaff
                    }))

                    navigate("/")
                }
            })
    }

    const handleRegister = (e) => {
        e.preventDefault()
        return fetch(`http://localhost:8088/users?email=${customer.email}`)
            .then(res => res.json())
            .then(response => {
                if (response.length > 0) {
                    // Duplicate email. No good.
                    window.alert("Account with that email address already exists")
                }
                else {
                    // Good email, create user.
                    registerNewUser()
                }
            })
    }

    const updateCustomer = (evt) => {
        const copy = {...customer}
        copy[evt.target.id] = evt.target.value
        setCustomer(copy)
    }

    return (
      <main className="">
        <h1 className="f-6 mb2 mt5 ">RANDOM WINNER</h1>
        <form className="measure center shadow br3" onSubmit={handleRegister}>
          <h2 className="pt3">Register</h2>
          <fieldset>
            <div className="db fw6 lh-copy tl pa3">
              <label htmlFor="fullName"> Full name: </label>
              <input
                onChange={updateCustomer}
                type="text"
                id="fullName"
                className="pa2 w-100"
                placeholder=""
                required
              />
            </div>
          </fieldset>
          <fieldset>
            <div className="db fw6 lh-copy tl pa3">
              <label htmlFor="email"> Email address: </label>
              <input
                onChange={updateCustomer}
                type="email"
                id="email"
                className="pa2 w-100"
                placeholder=""
                required
              />
            </div>
          </fieldset>
          <fieldset>
            <input
              onChange={(evt) => {
                const copy = { ...customer }
                copy.isStaff = evt.target.checked
                setCustomer(copy)
              }}
              type="checkbox"
              id="isStaff"
            />
            <label htmlFor="email"> I am an employee </label>
          </fieldset>
          <fieldset>
            <button
              className="f6 link dim br3 ph3 pv2 dib white bg-near-black"
              type="submit"
            >
              Register
            </button>
          </fieldset>
        </form>
      </main>
    )
}

