import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    passwordInput: '',
    userInput: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUserName = event => {
    this.setState({userInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userInput, passwordInput} = this.state
    const userDetails = {username: userInput, password: passwordInput}
    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUserNameField = () => {
    const {userInput} = this.state
    return (
      <>
        <label className="user-name-pass" htmlFor="username">
          USERNAME
        </label>
        <input
          className="name-password-input"
          type="text"
          id="username"
          value={userInput}
          placeholder="Username"
          onChange={this.onChangeUserName}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {passwordInput} = this.state

    return (
      <>
        <label className="user-name-pass" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="name-password-input"
          value={passwordInput}
          placeholder="Password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            className="login-image"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <div className="input-container">{this.renderUserNameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button className="login-btn" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default LoginForm
