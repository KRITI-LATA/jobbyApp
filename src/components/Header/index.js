import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="nav-header">
      <img
        className="logo-image"
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt=" website logo"
      />
      <div className="navbar-large-container">
        <ul className="nav-menu">
          <li className="nav-menu-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>

          <li className="nav-menu-item">
            <Link className="nav-link" to="/jobs">
              Jobs
            </Link>
          </li>
        </ul>
        <button className="logout-btn" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
export default withRouter(Header)
