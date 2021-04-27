import React from 'react';
import PropTypes from 'prop-types';
import context from '../../context';
import EditorFormatter from '../../common/formatter/editor-formatter';
import GalleryImage from './gallery-image';

const propTypes = {
  dtable: PropTypes.object.isRequired,
  viewRow: PropTypes.object.isRequired,
  imageColumn: PropTypes.object,
  titleColumn: PropTypes.object,
  shownColumns: PropTypes.array.isRequired,
  selectedView: PropTypes.object.isRequired,
  selectedTable: PropTypes.object.isRequired,
};

class GalleryItem extends React.Component {

  getShownImages = () => {
    const { viewRow, imageColumn } = this.props;
    const shownImages = (imageColumn && viewRow[imageColumn.name]) || [];
    return { shownImages };
  }

  getCellType = () => {
    const { dtable } = this.props;
    return dtable.getCellType();
  }

  getTables = () => {
    const { dtable } = this.props;
    return dtable.getTables();
  }

  getCollaborators = () => {
    const { dtable } = this.props;
    return dtable.getRelatedUsers();
  }

  getLinkCellValue = (linkId, table1Id, table2Id, rowId) => {
    const { dtable } = this.props;
    return dtable.getLinkCellValue(linkId, table1Id, table2Id, rowId);
  }

  getRowsByID = (table_id, rowIds) => {
    const { dtable } = this.props;
    return dtable.getRowsByID(table_id, rowIds);
  }

  getTableById = (table_id) => {
    const { dtable } = this.props;
    return dtable.getTableById(table_id);
  }

  getRowById = (table, rowID) => {
    const { dtable } = this.props;
    return dtable.getRowById(table, rowID)
  }

  getMediaUrl = () => {
    return context.getSetting('mediaUrl');
  }

  getUserCommonInfo = (email, avatar_size) => {
    return context.getUserCommonInfo(email, avatar_size);
  }

  renderEditorFormatter = () => {
    let { viewRow, shownColumns, selectedView, selectedTable, formulaRows } = this.props;
    const row = this.getRowById(selectedTable, viewRow._id);
    return shownColumns.map((column, index) => {
      return (
        <div className="gallery-editor-container" key={`editor-formatter-${index}`}>
          <EditorFormatter
            row={row}
            column={column}
            selectedView={selectedView}
            table={selectedTable}
            formulaRows={formulaRows}
            CellType={this.getCellType()}
            tables={this.getTables()}
            collaborators={this.getCollaborators()}
            getLinkCellValue={this.getLinkCellValue}
            getRowsByID={this.getRowsByID}
            getTableById={this.getTableById}
            getUserCommonInfo={this.getUserCommonInfo}
            getMediaUrl={this.getMediaUrl}
          />
        </div>
      );
    });
  }

  renderRowTitle = () => {
    const { titleColumn, viewRow, selectedView, selectedTable } = this.props; 
    const row = this.getRowById(selectedTable, viewRow._id);

    return (
      <div className="row-title">
        <EditorFormatter
          type="row_title"
          row={row}
          column={titleColumn}
          selectedView={selectedView}
          table={selectedTable}
          CellType={this.getCellType()}
          tables={this.getTables()}
          collaborators={this.getCollaborators()}
          getLinkCellValue={this.getLinkCellValue}
          getRowsByID={this.getRowsByID}
          getTableById={this.getTableById}
          getUserCommonInfo={this.getUserCommonInfo}
          getMediaUrl={this.getMediaUrl}
        />
      </div>
    );
  }

  render() {
    const { shownImages } = this.getShownImages(); 
    return (
      <div className="col-xl-2 col-md-3 col-sm-6 col-xm-12">
        <div className="gallery-item">
          <div className="image-container">
            <GalleryImage shownImages={shownImages} />
          </div>
          <div className="title-container">
            {this.renderRowTitle()}
          </div>
          <div className="row-content-container">
            {this.renderEditorFormatter()}
          </div>
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = propTypes;

export default GalleryItem;
