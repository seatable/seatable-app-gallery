import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '@seafile/react-image-lightbox';
import '@seafile/react-image-lightbox/style.css';

ImagePreviewerLightbox.propTypes = {
  imageItems: PropTypes.array.isRequired,
  imageIndex: PropTypes.number.isRequired,
  closeImagePopup: PropTypes.func.isRequired,
  moveToPrevImage: PropTypes.func.isRequired,
  moveToNextImage: PropTypes.func.isRequired,
};

function ImagePreviewerLightbox(props) {
  const { imageItems, imageIndex } = props;
  const imageItemsLength = imageItems.length;
  const URL = imageItems[imageIndex];

  // Handle URL has special symbol %$
  let imageTitle = '';
  try {
    imageTitle = URL ? decodeURI(URL.slice(URL.lastIndexOf('/') + 1)) : '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  const downloadImage = () => {
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      canvas.getContext('2d').drawImage(this, 0, 0);

      let eleA = document.createElement('a');
      eleA.href = canvas.toDataURL('image/png');
      eleA.download = imageTitle;
      eleA.click();
    };
    image.src = URL;
  };

  return (
    <Lightbox
      imageTitle={imageTitle}
      mainSrc={imageItems[imageIndex]}
      nextSrc={imageItems[(imageIndex + 1) % imageItemsLength]}
      prevSrc={imageItems[(imageIndex + imageItemsLength - 1) % imageItemsLength]}
      onCloseRequest={props.closeImagePopup}
      onMovePrevRequest={props.moveToPrevImage}
      onMoveNextRequest={props.moveToNextImage}
      animationDisabled={true}
      onClickDownload={downloadImage}
    />
  );
}

export default ImagePreviewerLightbox;
