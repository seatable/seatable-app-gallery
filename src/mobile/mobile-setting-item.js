
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';

const propTypes = {
  title: PropTypes.string,
  selectedConfigType: PropTypes.string,
  selectedName: PropTypes.string,
  getSelectConfigOptions: PropTypes.func,
};

const Item = List.Item;

class MobileSettingItem extends Component {

  onClick = () => {
    this.props.getSelectConfigOptions(this.props.selectedConfigType)
  }

  render() { 
    const { title, selectedName } = this.props;

    return (
      <div className="mobile-setting-item">
        <List renderHeader={title}>
          <Item onClick={this.onClick} extra={<i className="dtable-font dtable-icon-right"></i>}>
            {selectedName || ''}
          </Item>
        </List>
      </div>
    )
  }
}

MobileSettingItem.propTypes = propTypes;
 
export default MobileSettingItem;
