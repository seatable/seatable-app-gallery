import React from 'react';
import PropTypes from 'prop-types';
import GalleryMain from '../container/gallery-main';
import GallerySettings from '../container/gallery-settings';

import '../assets/css/layout.css'

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
    const { table_name, view_name } = viewConfig.settings;
    const selectedTable = tables.find(table => table.name === table_name) || tables[0];
    const views = dtable.getViews(selectedTable);
    const selectedView = views.find(view => view.name === view_name) || views[0];
    const columns = dtable.getColumns(selectedTable);
    const viewRows = this.getRows(selectedTable.name, selectedView.name);
    
    const formulaRows = this.getTableFormulaRows(selectedTable, selectedView);
    const titleColumns = this.getTitleColumns(columns);
    const imageColumns = this.getImageColumns(columns);
    
    return (
      <div className="seatable-app seatable-app-gallery row no-gutters">
        <div className="col-auto seatable-app-gallery-main">
          <div className="row no-gutters gallery-main-header">
            <div className="col-auto gallery-name">
              <span>name</span>
              <span className="dtable-font dtable-icon-rename"></span>
            </div>
            <div className="col-md-4 d-none d-md-block">
              <div className="gallery-options">
                <div className="option-item">share</div>
                <div className="option-item">open</div>
              </div>
            </div>
            <div className="d-md-none col-6">
              <div className="gallery-options">
                <div className="option-item">share</div>
                <div className="option-item">open</div>
                <div className="option-item">settings</div>
              </div>
            </div>
          </div>
          <div className="gallery-main-content">
            <GalleryMain
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
        <div className="col-md-3 col-lg-2 seatable-app-gallery-settings">
          <GallerySettings 
            dtable={dtable}
            viewConfig={viewConfig}
            tables={tables}
            views={views}
            titleColumns={titleColumns}
            imageColumns={imageColumns}
            columns={columns}
            onUpdateViewConfig={this.props.updateViewConfig}
          />
        </div>
      </div>
    );
  }
}

Gallery.propTypes = propTypes;

export default Gallery;
