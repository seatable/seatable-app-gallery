import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import intl from 'react-intl-universal';
import toaster from '../../common/toaster';

import '../../assets/css/link-share-dialog.css';

const propTypes = {
  fontIcon: PropTypes.string,
  itemIcon: PropTypes.string,
  itemName: PropTypes.string.isRequired,
  shareLink: PropTypes.string.isRequired,
  shareCancel: PropTypes.func.isRequired,
};

class ShareLinkDialog extends React.Component {

  toggle = () => {
    this.props.shareCancel();
  }

  onCopyLink = () => {
    copy(this.props.shareLink);
    let message = intl.get('The_share_link_has_been_copied');
    toaster.success(message);
  }

  onCopy = () => {
    const { shareLink, itemName } = this.props;
    const copyContent = `${shareLink}\n${intl.get('App')} ${itemName}, ${intl.get('Click_link_to_view')}`
    copy(copyContent);
    let message = intl.get('The_share_link_has_been_copied');
    toaster.success(message);
  }

  onOpenShareLink = () => {
    const { shareLink } = this.props;
    window.open(shareLink);
  }

  getConvertShareLink = () => {
    const { shareLink } = this.props;
    const convertLink = shareLink.slice(0, 25) + '...' + shareLink.slice(-25);
    return convertLink;
  }

  renderIcon = () => {
    const { fontIcon, itemIcon } = this.props;
    if (fontIcon) {
      return <i className={`dtable-font dtable-icon-${fontIcon} share-item-icon`}></i>;
    }
    return <img src={itemIcon} width={20} height={20} alt="icon"></img>;
  }

  render() {
    const { itemName, shareLink } = this.props;
    const convertLink = this.getConvertShareLink()

    return (
      <Modal isOpen={true} toggle={this.toggle} className="share-link-dialog">
        <ModalHeader toggle={this.toggle}>{intl.get('Share')}</ModalHeader>
        <ModalBody className="share-link-container">
          <div className="share-link-info">
            <div className="share-item">
              {this.renderIcon()}
              <span className="share-item-text">{itemName}</span>
            </div>
            <div className="share-link">
              <span className="share-link-content" onClick={this.onOpenShareLink}>{convertLink}</span>
              <div className="share-link-description">
                {intl.getHTML('App')} {itemName}, {intl.get('Click_link_to_view')}
              </div>
            </div>
            <Button color="primary" onClick={this.onCopyLink} outline={true} className="mt-4 mb-6" title={intl.get('Copy_link_only')}>{intl.get('Copy_link_only')}</Button>
            <Button color="primary" onClick={this.onCopy} className="mt-4 mb-6 ml-4" title={intl.get('Copy')}>{intl.get('Copy')}</Button>
          </div>
          <div className="share-link-qrcode">
            <div className="share-link-qrcode-content">
              <QRCode value={shareLink} size={80} />
            </div>
            <div className="seatable-tip-default mt-2 mx-2">{intl.get('Scan_QR_code_to_open_app')} {itemName}</div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

ShareLinkDialog.propTypes = propTypes;

export default ShareLinkDialog;
