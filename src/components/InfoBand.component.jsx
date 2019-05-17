import React from 'react';
import PropTypes from 'prop-types';

const InfoBand = ({ infoText, isError }) => (
  <div className={`info-band info-band--${isError ? 'error' : 'normal'} ${infoText === '' ? 'info-band--hide' : ''}`}>{infoText}</div>
);

InfoBand.propTypes = {
  infoText: PropTypes.string,
  isError: PropTypes.bool,
};

InfoBand.defaultProps = {
  infoText: '',
  isError: false,
};

export default InfoBand;
