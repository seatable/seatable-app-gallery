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

  onCopy = () => {
    const { shareLink } = this.props;
    copy(shareLink);
    let message = intl.get('The_share_link_has_been_copied');
    toaster.success(message);
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
              <span className="share-link-content">{shareLink}</span>
              <Button color="primary" onClick={this.onCopy} className="share-link-btn" title={intl.get('Copy')}>{intl.get('Copy')}</Button>
            </div>
          </div>
          <div className="share-link-qrcode">
            <div className="share-link-qrcode-content">
              <QRCode value={shareLink} size={80} />
            </div>
            <div className="share-link-qrcode-tip">
              <span className="qrcode-tip-content">{intl.get('Scan_QR_code')}</span>
              <span className="qrcode-tip-content">{intl.get('Open_directly')}</span>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

ShareLinkDialog.propTypes = propTypes;

export default ShareLinkDialog;
