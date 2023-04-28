import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const Landing = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      console.log(isAuthenticated);
      return navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Developer Connector</h1>
          <p className='lead'>
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up{' '}
            </Link>
            <Link to='/login' className='btn btn-primary'>
              Login{' '}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(Landing);
