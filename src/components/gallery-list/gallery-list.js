import React from 'react';
import PropTypes from 'prop-types';
import GalleryItem from './gallery-item';

const propTypes = {
  dtableUtils: PropTypes.object.isRequired,
  viewRows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  titleColumn: PropTypes.object,
  imageColumn: PropTypes.object,
  shownColumns: PropTypes.array.isRequired,
};

class GalleryList extends React.Component {

  render() {
    const { dtableUtils, viewRows, imageColumn, titleColumn, shownColumns } = this.props;

    return (
      <div className="row no-gutters gallery-list">
        {viewRows.map(row => {
          return (
            <GalleryItem
              key={row._id}
              viewRow={row}
              dtableUtils={dtableUtils}
              imageColumn={imageColumn}    
              titleColumn={titleColumn}    
              shownColumns={shownColumns}
            />
          );
        })}
      </div>
    );
  }
}

GalleryList.propTypes = propTypes;

export default GalleryList;
