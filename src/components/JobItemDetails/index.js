import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiJobDetailConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiJobDetailConstant.initial,
    updatedJobDetails: [],
    similarJobData: [],
  }

  componentDidMount() {
    this.getJobDetailData()
  }

  getFormattedJobData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    id: data.id,
    skills: data.skills.map(eachSkills => ({
      name: eachSkills.name,
      imageUrl: eachSkills.image_url,
    })),

    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getFormattedSimilarJobData = eachJobs => ({
    companyLogoUrl: eachJobs.company_logo_url,
    employmentType: eachJobs.employment_type,
    jobDescription: eachJobs.job_description,
    id: eachJobs.id,
    location: eachJobs.location,
    rating: eachJobs.rating,
    title: eachJobs.title,
  })

  getJobDetailData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiJobDetailConstant.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiJobUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiJobUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const particularJobDetails = this.getFormattedJobData(
        fetchedData.job_details,
      )
      console.log(particularJobDetails)
      const updatedSimilarJobs = fetchedData.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSimilarJobData(eachSimilarJob),
      )
      this.setState({
        updatedJobDetails: particularJobDetails,
        similarJobData: updatedSimilarJobs,
        apiStatus: apiJobDetailConstant.success,
      })
    } else {
      this.setState({apiStatus: apiJobDetailConstant.failure})
    }
  }

  renderLoadingPage = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="failure-btn"
        type="button"
        onClick={this.onRetryJobDetailAgain}
      >
        Retry
      </button>
    </div>
  )

  onRetryJobDetailAgain = () => {
    this.getJobDetailData()
  }

  renderJobDetailsView = () => {
    const {updatedJobDetails, similarJobData} = this.state
    if (updatedJobDetails.length >= 1) {
      const {
        id,
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        skills,
        location,
        packagePerAnnum,
        rating,
        lifeAtCompany,
        title,
      } = updatedJobDetails[0]

      return (
        <>
          <div className="job-item-detail">
            <div className="company-container">
              <div className="logo-container">
                <img
                  src={companyLogoUrl}
                  className="logo-image"
                  alt="company logo"
                />
              </div>
              <div className="job-name-container">
                <h1 className="job-name-heading">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-job-detail">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location-text">{location}</p>
              </div>
              <div className="job-type-container">
                <BsFillBriefcaseFill className="icons-jobs" />
                <p className="job-type-text">{employmentType}</p>
              </div>
              <h1 className="salary">{packagePerAnnum}</h1>
            </div>
            <hr />
            <div className="description-container">
              <h1 className="job-desc">Description</h1>
              <div className="site-container">
                <a className="site-link" href={companyWebsiteUrl}>
                  Visit
                </a>
                <BiLinkExternal className="visit-icon" />
              </div>
              <p className="description">{jobDescription}</p>
            </div>
            <div className="skills-container">
              <h1 className="skills-heading">Skills</h1>
              <ul className="sill-name-image-container">
                {skills.map(eachSkills => (
                  <li className="li-job-detail-container" key={eachSkills.name}>
                    <img
                      className="image-skills"
                      src={eachSkills.imageUrl}
                      alt={eachSkills.name}
                    />
                    <p className="sill-name">{eachSkills.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="life-company-container">
              <div className="desc-container">
                <h1 className="life-heading">Life at Company</h1>
                <p className="life-desc">{lifeAtCompany.description}</p>
              </div>
              <img
                className="company-image"
                src={lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
          <div className="similar-job-detail">
            <h1 className="similar-job-heading">Similar Jobs</h1>
            <ul className="similar-job-list">
              {similarJobData.map(eachData => (
                <SimilarJobs
                  key={eachData.id}
                  similarJobDetails={eachData}
                  employmentType={employmentType}
                />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }

  onRenderJobDetailsStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiJobDetailConstant.success:
        return this.renderJobDetailsView()
      case apiJobDetailConstant.failure:
        return this.renderFailureView()
      case apiJobDetailConstant.inProgress:
        return this.renderLoadingPage()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-item-detail-container">
        {this.onRenderJobDetailsStatusView()}
      </div>
    )
  }
}
export default JobItemDetails
