import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails
  return (
    <li className="jobs-list-container">
      <div className="company-container">
        <div className="logo-container">
          <img src={companyLogoUrl} className="logo-image" alt="company logo" />
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
      </div>
      <hr />
      <div className="description-container">
        <h1 className="job-desc">Description</h1>
        <p className="description">{jobDescription}</p>
      </div>
    </li>
  )
}
export default SimilarJobs
