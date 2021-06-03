import React from 'react';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import ImageLazyLoad from '../../common/image/ImageLazyLoad';
import ImagePreviewerLightbox from '../../common/image-preview-lightbox';

const propTypes = {
  shownImages: PropTypes.array.isRequired,
};

class GalleryImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowLargeImage: false,
      largeImageIndex: 0,
    }
  }

  onImageClick = (event, index) => {
    event.stopPropagation();
    this.setState({
      isShowLargeImage: true,
      largeImageIndex: index,
    });
  }

  hideLargeImage = () => {
    this.setState({
      isShowLargeImage: false,
      largeImageIndex: 0
    });
  }

  moveNext = (e) => {
    e.preventDefault();
    const { shownImages } = this.props;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + 1) % shownImages.length,
    }));
  }

  movePrev = (e) => {
    e.preventDefault();
    const { shownImages } = this.props;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + shownImages.length - 1) % shownImages.length,
    }));
  }

  render() {
    const { shownImages } = this.props;
    const { largeImageIndex } = this.state;
    return (
      <Fragment>
        <div className="gallery-image">
          {shownImages.length === 0 && null}
          {shownImages.length === 1 && <ImageLazyLoad imageUrl={shownImages[0]} onImageClick={this.onImageClick}/>}
          {shownImages.length > 1 && (
            <Fragment>
              <ImageLazyLoad imageUrl={shownImages[0]} onImageClick={this.onImageClick}/>
              <div>{shownImages.length}</div>
            </Fragment>
          )}
        </div>
        {this.state.isShowLargeImage && (
          <ImagePreviewerLightbox
            imageItems={shownImages}
            imageIndex={largeImageIndex}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
          />
        )}
      </Fragment>
    );
  }
}

GalleryImage.propTypes = propTypes;

export default GalleryImage;
