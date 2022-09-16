import React from 'react';
import PropTypes from 'prop-types';
import ImageLazyLoad from '../../common/image/ImageLazyLoad';
import ImagePreviewerLightbox from '../../common/image-preview-lightbox';
import { getImageThumbnailUrl } from '../../utils/utils'

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

  moveNext = () => {
    const { shownImages } = this.props;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + 1) % shownImages.length,
    }));
  }

  movePrev = () => {
    const { shownImages } = this.props;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + shownImages.length - 1) % shownImages.length,
    }));
  }

  renderImage = (url) => {
    return <ImageLazyLoad imageUrl={getImageThumbnailUrl(url)} onImageClick={this.onImageClick}/>;
  }

  render() {
    const { shownImages } = this.props;
    const { largeImageIndex } = this.state;
    return (
      <>
        <div className="gallery-image">
          {shownImages.length === 0 && null}
          {shownImages.length === 1 && this.renderImage(shownImages[0])}
          {shownImages.length > 1 && (
            <>
              {this.renderImage(shownImages[0])}
              <div>{shownImages.length}</div>
            </>
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
      </>
    );
  }
}

GalleryImage.propTypes = propTypes;

export default GalleryImage;
