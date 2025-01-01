import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import JobsItem from '../JobsItem'

import './index.css'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    apiJobStatus: apiJobStatusConstant.initial,
    searchInput: '',
    checkboxInput: [],
    radioInput: '',
    profileData: [],
    jobDetails: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobDetails()
  }

  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedProfileDetails = [await response.json()]
      const profileDetail = fetchedProfileDetails.map(eachDetails => ({
        name: eachDetails.profile_details.name,
        profileImageUrl: eachDetails.profile_details.profile_image_url,
        shortBio: eachDetails.profile_details.short_bio,
      }))
      this.setState({
        profileData: profileDetail,
        apiStatus: apiStatusConstant.success,
        responseSuccess: true,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiJobStatusConstant.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {checkboxInput, radioInput, searchInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, optionsJobs)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedJobDetails = fetchedData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        apiJobStatus: apiJobStatusConstant.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstant.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobDetails)
  }

  onGetInputOption = event => {
    const {checkboxInput} = this.state
    const inputNotInList = checkboxInput.filter(
      eachInput => eachInput === event.target.id,
    )

    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filterData = checkboxInput.filter(
        eachInput => eachInput !== event.target.id,
      )
      this.setState(
        prevState => ({checkboxInput: filterData}),
        this.getJobDetails,
      )
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failue"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="filure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button className="failure-btn" type="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profile-container">
          <img className="profile-image" src={profileImageUrl} alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.renderProfileView()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-button-container">
      <button
        className="failure-btn"
        type="button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderProfileView()
      case apiStatusConstant.failure:
        return this.renderProfileFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderGetJobsView = () => {
    const {jobDetails} = this.state
    const noJobs = jobDetails.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          className="no-jobs-image"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-desc">
          We could not find any jobs. Try other filters
        </p>
      </div>
    ) : (
      <ul className="jobs-item.container">
        {jobDetails.map(eachDetail => (
          <JobsItem key={eachDetail.id} jobsData={eachDetail} />
        ))}
      </ul>
    )
  }

  onRetryJobs = () => {
    this.renderGetJobsView()
  }

  onRenderJobDetailStatus = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiJobStatusConstant.success:
        return this.renderGetJobsView()
      case apiJobStatusConstant.failure:
        return this.renderFailureView()
      case apiJobStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchInput = () => {
    this.getJobDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-detail-container">
            {this.onRenderProfileStatus()}
            <hr />
            <div className="type-employment-container">
              <h1 className="emp-type">Type of Employment</h1>
              <ul className="emp-list">
                {employmentTypesList.map(eachItem => (
                  <li className="emp-type-list">
                    <input
                      type="checkbox"
                      className="emp-checkbox"
                      id={eachItem.employmentTypeId}
                      onChange={this.onGetInputOption}
                    />
                    <label
                      className="label-option"
                      htmlFor={eachItem.employmentTypeId}
                    >
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="salary-range-container">
              <h1 className="salary-range">Salary Range</h1>
              <ul className="salary-range-list">
                {salaryRangesList.map(eachList => (
                  <li className="emp-salary-list">
                    <input
                      type="radio"
                      className="salary-radio"
                      id={eachList.salaryRangeId}
                      onChange={this.onGetRadioOption}
                    />
                    <label
                      className="salary-label"
                      htmlFor={eachList.salaryRangeId}
                    >
                      {eachList.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-detail-container">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.onRenderJobDetailStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
