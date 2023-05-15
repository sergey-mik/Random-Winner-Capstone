import { useEffect, useState } from 'react'

export const ProfilePage = () => {
  // Provide initial state for profile
  const [profile, updateProfile] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    userId: 0,
  })
  const [feedback, setFeedback] = useState('')

  const localRandomUser = localStorage.getItem('random_user')
  const randomUserObject = JSON.parse(localRandomUser)

  useEffect(() => {
    if (feedback !== '') {
      // Clear feedback to make entire element disappear after 3 seconds
      setTimeout(() => setFeedback(''), 3000)
    }
  }, [feedback])

  // Get customer profile info from API and update state
  useEffect(() => {
    fetch(`http://localhost:8088/customers?userId=${randomUserObject.id}`)
      .then((response) => response.json())
      .then((data) => {
        const customerObject = data[0]
        updateProfile(customerObject)
      })
  }, [])

  const handleSaveButtonClick = (event) => {
    event.preventDefault()

    return fetch(`http://localhost:8088/customers/${profile.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    }).then(() => {
      setFeedback('Customer profile successfully saved')
    })
  }

  

  return (
    <>
      <div
        className={`${feedback.includes('Error') ? 'error' : 'feedback'} ${
          feedback === '' ? 'invisible' : 'visible'
        }`}
      >
        {feedback}
      </div>
      <form className="shadow measure center br3">
        <h2 className="pt3">Customer Profile</h2>

        <fieldset>
          <div className="b fw6 lh-copy tl">
            <label htmlFor="specialty">Full Name:</label>
            <input
              type="text"
              className="pa2 w-100"
              value={profile.fullName}
              onChange={(evt) => {
                //Update name property
                const copy = { ...profile }
                copy.fullName = evt.target.value
                updateProfile(copy)
              }}
            />
          </div>
        </fieldset>

        <fieldset>
          <div className="db fw6 lh-copy tl">
            <label htmlFor="specialty">Address:</label>
            <input
              type="text"
              className="pa2 w-100"
              value={profile.address}
              onChange={(evt) => {
                //Update address property
                const copy = { ...profile }
                copy.address = evt.target.value
                updateProfile(copy)
              }}
            />
          </div>
        </fieldset>

        <fieldset>
          <div className="db fw6 lh-copy tl">
            <label htmlFor="name">Phone Number:</label>
            <input
              type="tel"
              className="pa2 w-100"
              value={profile.phoneNumber}
              onChange={(evt) => {
                //Update phone# property
                const copy = { ...profile }
                copy.phoneNumber = evt.target.value
                updateProfile(copy)
              }}
            />
          </div>
        </fieldset>

        <fieldset>
          <div className="db fw6 lh-copy tl">
            <label htmlFor="specialty">Email:</label>
            <input
              type="text"
              className="pa2 w-100"
              value={profile.email}
              onChange={(evt) => {
                //Update address property
                const copy = { ...profile }
                copy.email = evt.target.value
                updateProfile(copy)
              }}
            />
          </div>
        </fieldset>

        <button
          onClick={(clickEvent) => {
            handleSaveButtonClick(clickEvent)
          }}
          className="f6 link dim br3 ph3 pv2 mt2 mb3 dib white bg-near-black"
        >
          Save Profile
        </button>
      </form>
    </>
  )
}
