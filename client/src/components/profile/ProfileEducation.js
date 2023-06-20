import React from 'react'
import PropTypes from 'prop-types';
import Moment from 'react-moment';

function ProfileEducation({education:{
    school,degree,fieldofstudy,current,to,from,description
}}) {
  return (
    <div>
        <h3 className='text-dark'>{school}</h3>
        <p>
            <Moment className='YYYY/MM/DD'>{from}</Moment>{'- '}
            {!to ? 'Now':<Moment className='YYYY/MM/DD'>{to}</Moment>}
        </p>
        <p><strong>Degree:</strong>{degree}</p>
        <p><strong>Field of Studey:</strong>{fieldofstudy}</p>
        <p><strong>Description:</strong>{description}</p>
    </div>
  )
}

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
}

export default ProfileEducation;
