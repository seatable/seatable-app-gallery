import React from 'react';
import PropTypes from 'prop-types';
import GalleryList from '../components/gallery-list/gallery-list';

import '../assets/css/gallery-editor.css';

const propTypes = {
  dtable: PropTypes.object.isRequired,
  viewConfig: PropTypes.object.isRequired,
  viewRows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  titleColumns: PropTypes.array.isRequired,
  imageColumns: PropTypes.array.isRequired,
  selectedView: PropTypes.object.isRequired,
  selectedTable: PropTypes.object.isRequired,
  formulaRows: PropTypes.object.isRequired,
};

class GalleryMain extends React.Component {

  getImageColumn = () => {
    const { viewConfig, imageColumns } = this.props;
    const { shown_image_name } = viewConfig.settings;
    let imageColumn = imageColumns[0];
    if (shown_image_name) {
      imageColumn = imageColumns.find(column => column.name === shown_image_name);
    }
    return imageColumn;
  }

  getTitleColumn = () => {
    const { viewConfig, titleColumns } = this.props;
    const { shown_title_name } = viewConfig.settings;
    let titleColumn = titleColumns[0];
    if (shown_title_name) {
      titleColumn = titleColumns.find(column => column.name === shown_title_name);
    }
    return titleColumn;
  }
  
  getShownColumns = () => {
    const { viewConfig, columns } = this.props;
    const { shown_column_names } = viewConfig.settings;
    let shownColumns = [];
    if (shown_column_names && Array.isArray(shown_column_names) && shown_column_names.length > 0) {
      shownColumns = columns.filter(column => shown_column_names.includes(column.name));
    }
    return shownColumns;
  }

  render() {
    const { dtable, viewConfig, viewRows, columns, selectedTable, selectedView, formulaRows } = this.props;
    const imageColumn = this.getImageColumn();
    const titleColumn = this.getTitleColumn();
    const shownColumns = this.getShownColumns();
    return (
      <div className="gallery-main-container container-fluid" style={{height: window.innerHeight - 50}}>
        <GalleryList 
          dtable={dtable}
          viewConfig={viewConfig} 
          viewRows={viewRows} 
          columns={columns}
          imageColumn={imageColumn} 
          titleColumn={titleColumn}
          shownColumns={shownColumns}
          selectedView={selectedView}
          selectedTable={selectedTable}
          formulaRows={formulaRows}
        />
      </div>
    );
  }
}

GalleryMain.propTypes = propTypes;

export default GalleryMain;
