import React from 'react';
import PropTypes from 'prop-types';
import context from '../../context';
import EditorFormatter from '../../common/formatter/editor-formatter';
import { checkDesktop } from '../../utils/utils';
import GalleryImage from './gallery-image';

const propTypes = {
  dtableUtils: PropTypes.object.isRequired,
  viewRow: PropTypes.object.isRequired,
  imageColumn: PropTypes.object,
  titleColumn: PropTypes.object,
  shownColumns: PropTypes.array.isRequired,
};

class GalleryItem extends React.Component {

  getShownImages = () => {
    const { viewRow, imageColumn } = this.props;
    const shownImages = (imageColumn && viewRow[imageColumn.name]) || [];
    return { shownImages };
  }

  getCellType = () => {
    const { dtableUtils } = this.props;
    return dtableUtils.getCellType();
  }

  getCollaborators = () => {
    const { dtableUtils } = this.props;
    return dtableUtils.getRelatedUsers();
  }
  
  getOptionColors = () => {
    const { dtableUtils } = this.props;
    return dtableUtils.getOptionColors();
  }

  getMediaUrl = () => {
    return context.getSetting('mediaUrl');
  }

  getUserCommonInfo = (email, avatar_size) => {
    return context.getUserCommonInfo(email, avatar_size);
  }

  renderEditorFormatter = () => {
    let { viewRow, shownColumns, displayFieldsName, columnIconConfig } = this.props;
    return shownColumns.map((column, index) => {
      return (
        <div className="gallery-editor-container" key={`editor-formatter-${index}`}>
          <EditorFormatter
            type={''}
            row={viewRow}
            column={column}
            CellType={this.getCellType()}
            collaborators={this.getCollaborators()}
            getUserCommonInfo={this.getUserCommonInfo}
            getMediaUrl={this.getMediaUrl}
            getOptionColors={this.getOptionColors}
            displayFieldsName={displayFieldsName}
            columnIconConfig={columnIconConfig}
          />
        </div>
      );
    });
  }

  renderRowTitle = () => {
    const { titleColumn, viewRow } = this.props; 

    return (
      <div className="row-title">
        <EditorFormatter
          type="row_title"
          row={viewRow}
          column={titleColumn}
          CellType={this.getCellType()}
          collaborators={this.getCollaborators()}
          getUserCommonInfo={this.getUserCommonInfo}
          getMediaUrl={this.getMediaUrl}
        />
      </div>
    );
  }

  render() {
    const { shownImages } = this.getShownImages(); 
    const isDesktop = checkDesktop();
    return (
      <div className={`col-xl-2 col-md-3 col-sm-6 col-xm-12 ${isDesktop ? '' : 'col-6' }`}>
        <div className="gallery-item">
          <div className="image-container">
            <GalleryImage shownImages={shownImages} />
          </div>
          <div className="text-truncate gallery-app-row-container">
            <div className="title-container">
              {this.renderRowTitle()}
            </div>
            <div className="row-content-container">
              {this.renderEditorFormatter()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = propTypes;

export default GalleryItem;
