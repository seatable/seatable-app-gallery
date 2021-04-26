import React from 'react';
import PropTypes from 'prop-types';

import '../assets/css/layout.css'
import GalleryEditor from '../container/gallery-editor';
import GallerySettings from '../container/gallery-settings';

const propTypes = {
  dtable: PropTypes.object.isRequired,
  viewConfig: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  updateViewConfig: PropTypes.func.isRequired,
};

class Gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSettings: null,
      isShowSharedDialog: false,
    };
  }

  componentDidMount() {
    // init currentSettings
  }

  initGallerySettings() {

  }

  updateGallerySettings() {

  }

  updateTableSettings() {

  }

  updateViewSettings() {

  }

  updateColumnSettings() {

  }

  getRows = (tableName, viewName) => {
    const { dtable } = this.props;
    let rows = [];
    dtable.forEachRow(tableName, viewName, (row) => {
      rows.push(row);
    });
    return rows;
  }

  getTitleColumns = (columns) => {
    const { dtable } = this.props;
    const CellType = dtable.getCellType();
    const SHOW_TITLE_COLUMN_TYPE = [
      CellType.TEXT, CellType.SINGLE_SELECT, CellType.MULTIPLE_SELECT, 
      CellType.NUMBER, CellType.FORMULA,CellType.DATE, CellType.COLLABORATOR, 
      CellType.GEOLOCATION, CellType.CTIME, CellType.MTIME, CellType.CREATOR, 
      CellType.LAST_MODIFIER];
    return columns.filter(column => SHOW_TITLE_COLUMN_TYPE.find(type => type === column.type));
  }

  getImageColumns = (columns) => {
    return columns.filter(column => column.type === 'image');
  }

  getTableFormulaRows = (table, view) => {
    const { dtable } = this.props;
    let rows = dtable.getViewRows(view, table);
    return dtable.getTableFormulaResults(table, rows);
  }

  render() {
    const { dtable, viewConfig } = this.props;
    const tables = dtable.getTables();
    // todo
    const selectedTable = tables[0];
    const views = dtable.getViews(selectedTable);
    const selectedView = views[0];
    const columns = dtable.getColumns(selectedTable);
    const viewRows = this.getRows(selectedTable.name, selectedView.name);
    
    const formulaRows = this.getTableFormulaRows(selectedTable, selectedView);
    // todo: handle link cell values
    const titleColumns = this.getTitleColumns(columns);
    const imageColumns = this.getImageColumns(columns);
    
    return (
      <div className="seatable-app seatable-app-gallery row no-gutters">
        <div className="col-auto seatable-app-gallery-main">
          <div className="gallery-main-header">
            <div className="gallery-name">
              <span>name</span>
              <span className="dtable-font dtable-icon-rename"></span>
            </div>
            <div className="gallery-options">
              <div className="option-item">share</div>
              <div className="option-item">open</div>
            </div>
          </div>
          <div className="gallery-main-content">
            <GalleryEditor
              dtable={dtable}
              viewConfig={viewConfig}
              viewRows={viewRows}
              columns={columns}
              titleColumns={titleColumns}
              imageColumns={imageColumns}
              selectedView={selectedView}
              selectedTable={selectedTable}
              formulaRows={formulaRows}
            />
          </div>
        </div>
        <div className="col-lg-2 col-md-3 seatable-app-gallery-settings">
          <GallerySettings 
            viewConfig={viewConfig}
            tables={tables}
            views={views}
            columns={columns}
            titleColumns={titleColumns}
            imageColumns={imageColumns}
            onUpdateViewConfig={this.props.updateViewConfig}
          />
        </div>
      </div>
    );
  }
}

Gallery.propTypes = propTypes;

export default Gallery;
