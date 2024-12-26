import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    passwordInput: '',
    username: '',
    showSubmitError: false,
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
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
    const {username, passwordInput} = this.state
    const userDetails = {username, passwordInput}
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
    const {username} = this.state
    return (
      <>
        <label className="user-name" htmlFor="username">
          USERNAME
        </label>
        <input
          className="user-input"
          type="text"
          id="username"
          value={username}
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
        <label className="password" htmlFor="password-field">
          PASSWORD
        </label>
        <input
          type="password"
          className="password-input"
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
        <div className="login-form-container">
          <img
            className="login-image"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="form-container" onSubmit={this.submitForm}>
            <div className="input-container">{this.renderUserNameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            <button className="login-btn" type="submit">
              Login
            </button>
            {showSubmitError && <p className="error-text">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default LoginForm
