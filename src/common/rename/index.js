import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import { toaster } from 'dtable-ui-component';
import { validateName } from '../../utils/utils';

const propTypes = {
  currentName: PropTypes.string,
  isSupportRename: PropTypes.bool,
  onUpdateCurrentName: PropTypes.func.isRequired,
};

class Rename extends React.Component {

  static defaultProps = {
    isSupportRename: true
  }

  constructor(props) {
    super(props);
    this.state = {
      isRenaming: false,
      name: props.currentName,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentName !== this.props.currentName) {
      this.setState({name: nextProps.currentName});
    }
  }

  onRenameClick = () => {
    this.setState({isRenaming: true}, () => {
      this.input.focus();
    });
  }

  onChange = (event) => {
    const { value } = event.target;
    this.setState({name: value});
  }
  
  onKeyDown = (event) => {
    let { selectionStart, selectionEnd, value } = event.currentTarget;
    if (isHotkey('enter', event)) {
      event.preventDefault();
      this.input.blur();
    } else if ((event.keyCode === 37 && selectionStart === 0) || 
      (event.keyCode === 39 && selectionEnd === value.length)
    ) {
      event.stopPropagation();
    }
  }

  onBlur = () => {
    const { isValid, message } = validateName(this.state.name);
    if (!isValid) {
      toaster.danger(message);
      return;
    } else {
      this.setState({isRenaming: false});
      this.props.onUpdateCurrentName(message);
    }   
  }

  setInputRef = (ref) => {
    this.input = ref;
  }

  render() {
    const { isRenaming, name } = this.state;
    return (
      <div className="gallery-app-table-rename-container d-flex">
        {isRenaming ?
          <input 
            ref={this.setInputRef} 
            type="text" 
            className="form-control"
            value={name} 
            onKeyDown={this.onKeyDown} 
            onBlur={this.onBlur} 
            onChange={this.onChange}
          />
          :
          <Fragment>
            <span className="mr-2 text-truncate">{name}</span>
            {this.props.isSupportRename && (
              <i className="dtable-font dtable-icon-rename edit" onClick={this.onRenameClick}></i>
            )}
          </Fragment>
        }
      </div>
    );
  }
}

Rename.propTypes = propTypes;

export default Rename;
