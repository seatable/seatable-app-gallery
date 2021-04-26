import React from 'react';
import PropTypes from 'prop-types';

import '../assets/css/gallery-settings.css';

const propTypes = {
  viewConfig: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  titleColumns: PropTypes.array.isRequired,
  imageColumns: PropTypes.array.isRequired
};

class GallerySettings extends React.Component {

  render() {
    return (
      <div className="gallery-settings-container">
        <div className="gallery-settings-header">Settings</div>
        <div className="gallery-settings-content">
          setting items
        </div>
      </div>
    );
  }
}

GallerySettings.propTypes = propTypes;

export default GallerySettings;
