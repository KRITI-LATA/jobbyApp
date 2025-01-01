import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="navbar-large-container">
        <Link to="/">
          <img
            className="logo-image"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt=" website logo"
          />
        </Link>
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
          <li className="desk-btn">
            <button
              className="logout-btn"
              type="button"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div className="nav-mobile-container">
        <Link to="/">
          <img
            className="logo-image"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt=" website logo"
          />
        </Link>
        <ul className="mobile-nav-list">
          <li>
            <Link to="/">
              <AiFillHome className="nav-item-mobile-link" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <BsFillBriefcaseFill className="nav-item-mobile-link" />
            </Link>
          </li>
          <li>
            <button
              className="logout-mob-btn"
              type="button"
              onClick={onClickLogout}
            >
              <FiLogOut />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
