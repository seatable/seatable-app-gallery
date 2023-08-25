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

  constructor(props) {
    super(props);
    this.columnIconConfig = props.dtableUtils.getColumnIconConfig();
  }

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
    const { shown_column_names, fields_key = [] } = appConfig.settings;
    let shownColumns = [];
    if (shown_column_names && Array.isArray(shown_column_names) && shown_column_names.length > 0) {
      const columnsMap = columns.reduce((map, column) => {
        map[column.key] = column;
        return map;
      }, {});

      fields_key.forEach(key => {
        const column = columnsMap[key];
        const columnName = column.name;
        if (shown_column_names.includes(columnName)) {
          shownColumns.push(column);
        }
      });
    }
    return shownColumns;
  }

  getDisplayFieldsName = () => {
    const { appConfig } = this.props;
    const { display_field_name } = appConfig.settings;
    return !!display_field_name;
  }

  render() {
    const { dtableUtils, appConfig, viewRows, columns } = this.props;
    const imageColumn = this.getImageColumn();
    const titleColumn = this.getTitleColumn();
    const shownColumns = this.getShownColumns();
    const displayFieldsName = this.getDisplayFieldsName();

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
          displayFieldsName={displayFieldsName}
          columnIconConfig={this.columnIconConfig}
        />
      </div>
    );
  }
}

GalleryMain.propTypes = propTypes;

export default GalleryMain;
