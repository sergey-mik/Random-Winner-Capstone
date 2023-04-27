import { useEffect, useState } from 'react'

export const ProfilePage = () => {
  // TODO: Provide initial state for profile
  const [profile, updateProfile] = useState({
    address: '',
    phoneNumber: '',
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
  
  // TODO: Get employee profile info from API and update state
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
      <form className="profile">
        <h2 className="profile__title">Customer Profile</h2>
        <fieldset>
          <div className="form-group">
            <label htmlFor="specialty">Address:</label>
            <input
              type="text"
              className="form-control"
              value={profile.address}
              onChange={(evt) => {
                // TODO: Update address property
                const copy = { ...profile }
                copy.address = evt.target.value
                updateProfile(copy)
              }}
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <label htmlFor="name">Phone Number:</label>
            <input
              type="tel"
              className="form-control"
              value={profile.phoneNumber}
              onChange={(evt) => {
                // TODO: Update rate property
                const copy = { ...profile }
                copy.phoneNumber = evt.target.value
                updateProfile(copy)
              }}
            />
          </div>
        </fieldset>
        <button
          onClick={(clickEvent) => {
            handleSaveButtonClick(clickEvent)
          }}
          className="btn btn-primary"
        >
          Save Profile
        </button>
      </form>
    </>
  )
}
