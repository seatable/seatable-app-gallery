import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import { ActionSheet } from 'antd-mobile';
import Rename from '../common/rename';
import GalleryMain from '../container/gallery-main';
import GallerySettings from '../container/gallery-settings';
import { getImageColumns, getTitleColumns, isEditAppPage, checkDesktop } from '../utils/utils';
import ShareLinkDialog from '../components/dialogs/share-link-dialog';
import context from '../context';
import GalleryMobileSettings from '../mobile/gallery-mobile-settings';

import '../assets/css/layout.css'

const propTypes = {
  dtableUtils: PropTypes.object.isRequired,
  appConfig: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isShowSaveMessage: PropTypes.bool.isRequired,
  updateAppConfig: PropTypes.func.isRequired,
};

class Gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSettings: null,
      isShowSharedDialog: false,
      isShowSetting: false
    };
  }

  onUpdateCurrentName = (newName) => {
    const { appConfig } = this.props;
    const { app_name } = appConfig;
    if (app_name === newName) return;
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.app_name = app_name;
    this.props.updateAppConfig(newAppConfig);
  }

  onShareDialogToggle = () => {
    this.setState({isShowSharedDialog: !this.state.isShowSharedDialog})
  }
  
  onOpenShareApp = () => {
    const url = this.getAppShareLink();
    window.open(url);
  }

  onSettingsToggle = () => {
    this.setState({isShowSetting: !this.state.isShowSetting})
  }

  getAppIcon = () => {
    const mediaUrl = context.getSetting('mediaUrl');
    const appType = context.getSetting('appType');
    const iconUrl = `${mediaUrl}dtable-apps/${appType}/icon.png`;
    return iconUrl;
  }
  
  getAppShareLink = () => {
    const server = context.getSetting('server');
    const appToken = context.getSetting('appToken');
    const shareLink = `${server}/dtable/external-apps/${appToken}/`;
    return shareLink;
  }

  showActionSheet = () => {
    let buttons = [(<div className="my-am-action"><i className='dtable-font dtable-icon-share'></i>{intl.get('Share')}</div>), 
      (<div className="my-am-action"><i className="item-icon dtable-font dtable-icon-leave"></i>{intl.get('App_page')}</div>),
      (<div className="my-am-action"><i className="dtable-font dtable-icon-settings"></i>{intl.get('Settings')}</div>)
    ];
    ActionSheet.showActionSheetWithOptions({ 
      options: buttons, 
      maskClosable: true,
      className: 'dtable-antd-mobile'
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        this.onShareDialogToggle();
      } else if (buttonIndex === 1) {
        this.onOpenShareApp();
      } else if (buttonIndex === 2) {
        this.onSettingsToggle();
      }
    });
  }

  renderMobileGalleryHeader = () => {
    return (
      <div className="gallery-options">
        <button className="btn btn-outline" onClick={this.showActionSheet}>
          <i className="dtable-font dtable-icon-more-level"></i>
        </button>
      </div>
    )
  }

  render() {
    const isDesktop = checkDesktop();
    const { appConfig, dtableUtils, tables, views, columns, rows } = this.props;
    const titleColumns = getTitleColumns(dtableUtils, columns);
    const imageColumns = getImageColumns(columns);
    const { isSaving, isShowSaveMessage } = this.props;
    const { isShowSetting, isShowSharedDialog } = this.state;
    
    return (
      <Fragment>
        <div className="seatable-app seatable-app-gallery row no-gutters">
          <div className="col-auto seatable-app-gallery-main">
            <div className="row no-gutters gallery-main-header">
              <div className="col-auto gallery-name">
                <Rename isSupportRename={isEditAppPage()} currentName={appConfig.app_name} onUpdateCurrentName={this.onUpdateCurrentName}/>
                {isShowSaveMessage && isSaving && <span className="tip-message">{intl.get('Saving')}</span>}
                {isShowSaveMessage && !isSaving && <span className="tip-message">{intl.get('All_changes_saved')}</span>}
              </div>
              {isEditAppPage() && isDesktop && (
                <Fragment>
                  <div className="col-md-6 d-none d-md-block">
                    <div className="gallery-options">
                      <button className="btn btn-outline-primary option-item" onClick={this.onShareDialogToggle}>
                        <i className="dtable-font dtable-icon-share mr-2"></i>
                        <span>{intl.get('Share')}</span>
                      </button>
                      <button className="btn btn-outline-primary option-item" onClick={this.onOpenShareApp}>
                        <i className="dtable-font dtable-icon-table mr-2"></i>
                        <span>{intl.get('App_page')}</span>
                      </button>
                    </div>
                  </div>
                  <div className="d-md-none col-6">
                    <div className="gallery-options">
                      <button className="btn btn-outline-primary option-item" onClick={this.onShareDialogToggle}>
                        <i className="dtable-font dtable-icon-share"></i>
                      </button>
                      <button className="btn btn-outline-primary option-item" onClick={this.onOpenShareApp}>
                        <i className="dtable-font dtable-icon-leave"></i>
                      </button>
                      <button className="btn btn-outline-primary option-item" onClick={this.onSettingsToggle}>
                        <i className="dtable-font dtable-icon-settings"></i>
                      </button>
                    </div>
                  </div>
                </Fragment>
              )}
              {isEditAppPage() && !isDesktop && (
                this.renderMobileGalleryHeader()
              )}
              {isEditAppPage() && isShowSetting &&
                <GalleryMobileSettings 
                  toggleSettingDialog={this.onSettingsToggle}
                  dtableUtils={dtableUtils}
                  appConfig={appConfig}
                  tables={tables}
                  views={views}
                  titleColumns={titleColumns}
                  imageColumns={imageColumns}
                  columns={columns}
                  onUpdateAppConfig={this.props.updateAppConfig}
                />
              }
            </div>
            <div className="gallery-main-content">
              <GalleryMain
                dtableUtils={dtableUtils}
                appConfig={appConfig}
                viewRows={rows}
                columns={columns}
                titleColumns={titleColumns}
                imageColumns={imageColumns}
              />
            </div>
          </div>
          {isEditAppPage() && (
            <div className="col-md-3 col-lg-2 seatable-app-gallery-settings" onClick={this.onSettingsToggle}>
              <GallerySettings 
                dtableUtils={dtableUtils}
                appConfig={appConfig}
                tables={tables}
                views={views}
                titleColumns={titleColumns}
                imageColumns={imageColumns}
                columns={columns}
                onUpdateAppConfig={this.props.updateAppConfig}
              />
            </div>
          )}
        </div>
        {isShowSharedDialog && (
          <ShareLinkDialog 
            itemIcon={this.getAppIcon()}
            itemName={appConfig.app_name}
            shareLink={this.getAppShareLink()}
            shareCancel={this.onShareDialogToggle}
          />
        )}
      </Fragment>
      
    );
  }
}

Gallery.propTypes = propTypes;

export default Gallery;
