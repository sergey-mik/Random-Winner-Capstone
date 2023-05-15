import React, { useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import "./Login.css"

export const Login = () => {
    const [email, set] = useState("")
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        return fetch(`http://localhost:8088/users?email=${email}`)
            .then(res => res.json())
            .then(foundUsers => {
                if (foundUsers.length === 1) {
                    const user = foundUsers[0]
                    localStorage.setItem("random_user", JSON.stringify({
                        id: user.id,
                        staff: user.isStaff
                    }))

                    navigate("/products")
                }
                else {
                    window.alert("Invalid login")
                }
            })
    }

    return (
      <main className="container--login">
        <h1 className="tc f-6 mb2 mt5">RANDOM WINNER</h1>
        <section className="measure center">
          <form className="shadow br3" onSubmit={handleLogin}>
            <h2 className="pt3">Please Sign In</h2>
            <fieldset>
              <div className="db fw6 lh-copy tl pa3">
                <label htmlFor="inputEmail"> Email address: </label>
                <input
                  type="email"
                  value={email}
                  onChange={(evt) => set(evt.target.value)}
                  className="pa2 w-100"
                  placeholder=""
                  required
                />
              </div>
            </fieldset>
            <fieldset>
              <button
                className="f6 link dim br3 ph3 pv2 dib white bg-near-black"
                type="submit"
              >
                Sign in
              </button>
            </fieldset>
            <section className="link--register pa3">
              <Link to="/register">Not a member yet?</Link>
            </section>
          </form>
        </section>
      </main>
    )
}

