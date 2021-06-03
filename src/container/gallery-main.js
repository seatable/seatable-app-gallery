import React from 'react';
import PropTypes from 'prop-types';
import GalleryList from '../components/gallery-list/gallery-list';

import '../assets/css/gallery-editor.css';

const propTypes = {
  dtableUtils: PropTypes.object.isRequired,
  appConfig: PropTypes.object.isRequired,
  viewRows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  titleColumns: PropTypes.array.isRequired,
  imageColumns: PropTypes.array.isRequired,
};

class GalleryMain extends React.Component {

  getImageColumn = () => {
    const { appConfig, imageColumns } = this.props;
    const { shown_image_name } = appConfig.settings;
    let imageColumn = imageColumns[0];
    if (shown_image_name) {
      imageColumn = imageColumns.find(column => column.name === shown_image_name);
    }
    return imageColumn;
  }

  getTitleColumn = () => {
    const { appConfig, titleColumns } = this.props;
    const { shown_title_name } = appConfig.settings;
    let titleColumn = titleColumns[0];
    if (shown_title_name) {
      titleColumn = titleColumns.find(column => column.name === shown_title_name);
    }
    return titleColumn;
  }
  
  getShownColumns = () => {
    const { appConfig, columns } = this.props;
    const { shown_column_names } = appConfig.settings;
    let shownColumns = [];
    if (shown_column_names && Array.isArray(shown_column_names) && shown_column_names.length > 0) {
      shownColumns = columns.filter(column => shown_column_names.includes(column.name));
    }
    return shownColumns;
  }

  render() {
    const { dtableUtils, appConfig, viewRows, columns } = this.props;
    const imageColumn = this.getImageColumn();
    const titleColumn = this.getTitleColumn();
    const shownColumns = this.getShownColumns();
    return (
      <div className="gallery-main-container container-fluid" style={{height: window.innerHeight - 50}}>
        <GalleryList 
          dtableUtils={dtableUtils}
          appConfig={appConfig} 
          viewRows={viewRows} 
          columns={columns}
          imageColumn={imageColumn} 
          titleColumn={titleColumn}
          shownColumns={shownColumns}
        />
      </div>
    );
  }
}

GalleryMain.propTypes = propTypes;

export default GalleryMain;
