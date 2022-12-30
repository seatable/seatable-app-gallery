import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import { MultipleSelectFormatter, NumberFormatter, DateFormatter, CTimeFormatter,
  MTimeFormatter, CheckboxFormatter, LongTextFormatter } from 'dtable-ui-component';
import { CellType, FORMULA_RESULT_TYPE, getDurationDisplayString, getGeolocationDisplayString,
  getMultipleOptionName } from 'dtable-store';
import { EVENT_BUS_TYPE } from '../constants/event-bus-type';
import { getFormulaArrayValue, isArrayFormalColumn, getFormulaDisplayString } from '../../utils/link-format-utils';
import CreatorFormatter from './creator-formatter';
import LinkCollaboratorItemFormatter from './link-collaborator-item-formatter';
import ExpandIcon from './link-formatter-widgets/expand-icon';
import { COLUMN_CONFIG_KEY } from '../constants/column-config-key';

import '../../assets/css/link-formatter.css';

const PREVIEWER = 'previewer';
const ADDITION = 'addition';

export default class LinkFormatter extends React.Component {

  static propTypes = {
    column: PropTypes.object.isRequired,
    value: PropTypes.any,
    containerClassName: PropTypes.string,
    renderEmptyFormatter: PropTypes.func,
    getOptionColors: PropTypes.func,
    isCellSelected: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      canOpenInternalLink: false,
      tooltipOpen: false,
      isHasMore: false,
    };
    this.rowRefs = [];
    this.addLinkRef = null;
    this.ellisRef = null;
    // this.canAddLink = this.canAddRecords();
  }

  componentWillReceiveProps(nextProps) {
    // When no cell was selected, the cell is now selected
    if (!this.props.isCellSelected && nextProps.isCellSelected) {
      // Determine the width of all current rows, and then whether it exceeds the width of the whole cell
      const containerWidth = this.linksContainerRef.clientWidth;
      let isHasMore = false;
      for (let j = 0; j < this.rowRefs.length; j++) {
        let dom = this.rowRefs[j];
        if (!dom) continue;
        let currentWidth = dom.offsetLeft + dom.clientWidth;
        // If one exceeds the width, set the status to display isHasMore ellipsis
        if (currentWidth + 50 > containerWidth) {
          isHasMore = true;
        }
        // and set all the following rows not to be displayed
        if (isHasMore) {
          dom.style.display = 'none';
        }
      }
      this.setState({ isHasMore });
    }
    // If the cell was originally selected, no cell is currently selected
    if (this.props.isCellSelected && !nextProps.isCellSelected) {
      for (let j = 0; j < this.rowRefs.length; j++) {
        let dom = this.rowRefs[j];
        if (!dom) continue;
        // Set all rows to be displayed
        dom.style.display = 'inline-block';
      }
      // Set ellipsis hide
      this.setState({ isHasMore: false });
    }
    return;
  }

  canAddRecords = () => {
    const { column, value } = this.props;
    const page = window.app.getPage();
    const { link_columns_settings: linkColumnSettings } = page;
    if (!linkColumnSettings || linkColumnSettings.length === 0) {
      return true;
    }
    const linkColumnSetting = linkColumnSettings.find(item => item.key === column.key);
    if (!linkColumnSetting) {
      return true;
    }
    if (linkColumnSetting[COLUMN_CONFIG_KEY.ENABLE_ADD_NEW_RECORDS]) {
      return true;
    }
    if (linkColumnSetting[COLUMN_CONFIG_KEY.ENABLE_LINK_EXISTING_RECORDS] && !linkColumnSetting[COLUMN_CONFIG_KEY.LINK_AT_MOST_ONE_RECORD]) {
      return true;
    }
    if (linkColumnSetting[COLUMN_CONFIG_KEY.ENABLE_LINK_EXISTING_RECORDS] && linkColumnSetting[COLUMN_CONFIG_KEY.LINK_AT_MOST_ONE_RECORD] && value.length === 0) {
      return true;
    }
    return false;
  }

  toggleTooltip = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  renderEmpty = () => {
    const { isCellSelected } = this.props;
    return (
      <>
        <div className="links-formatter">
          <div className='formatter-show' ref={ref => this.linksContainerRef = ref}>
            {isCellSelected &&
              <span className="link-add link p-1" onClick={this.addLink} ref={ref => this.addLinkRef = ref}>
                <i className="dtable-font dtable-icon-add-table"></i>
              </span>
            }
          </div>
        </div>
        {isCellSelected && <ExpandIcon onClick={this.expandLink}/>}
      </>
    );
  }

  expandLink = () => {
    window.app.eventBus.dispatch(EVENT_BUS_TYPE.OPEN_EDITOR, PREVIEWER);
  }

  addLink = () => {
    window.app.eventBus.dispatch(EVENT_BUS_TYPE.OPEN_EDITOR, ADDITION);
  }

  render () {
    const props = this.props;
    const { column, value, containerClassName } = props;
    const { data } = column;

    if (!Array.isArray(value) || value.length === 0) {
      return this.renderEmpty();
    }
    let { array_type:arrayType, display_column_key: displayColumnKey, array_data: arrayData } = data || {};
    const displayColumn = { type: arrayType, key: displayColumnKey, data: arrayData }
    if (!displayColumn) {
      return this.renderEmpty();
    }
    const { type: displayColumnType, data: displayColumnData } = displayColumn;
    const cellValue = getFormulaArrayValue(value, !isArrayFormalColumn(displayColumnType));

    if (!Array.isArray(cellValue) || cellValue.length === 0) {
      return this.renderEmpty();
    }

    let dom = null;
    switch (displayColumnType) {
      case CellType.TEXT:
      case CellType.AUTO_NUMBER:
      case CellType.EMAIL:
      case CellType.URL:
      case FORMULA_RESULT_TYPE.STRING: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div key={`link-${displayColumnType}-${index}`} className="dtable-link-item" ref={ref => this.rowRefs[index] = ref}>
                  {value}
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.NUMBER: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div key={`link-${displayColumnType}-${index}`} ref={ref => this.rowRefs[index] = ref}>
                  <NumberFormatter
                    containerClassName="dtable-link-item"
                    data={displayColumnData || {}}
                    value={value}
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.DATE: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              const { format } = displayColumnData || {};
              const sValue = typeof value !== 'string' ? '' : value;
              return (
                <div key={`link-${displayColumnType}-${index}`} ref={ref => this.rowRefs[index] = ref}>
                  <DateFormatter
                    value={sValue.replace('T', ' ').replace('Z', '')}
                    format={format}
                    containerClassName="dtable-link-item"
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.CTIME: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div key={`link-${displayColumnType}-${index}`} ref={ref => this.rowRefs[index] = ref}>
                  <CTimeFormatter
                    value={value}
                    containerClassName="dtable-link-item"
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.MTIME: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div ref={ref => this.rowRefs[index] = ref}>
                  <MTimeFormatter
                    key={`link-${displayColumnType}-${index}`}
                    value={value}
                    containerClassName="dtable-link-item"
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.DURATION: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div key={`link-${displayColumnType}-${index}`} className="dtable-link-item" ref={ref => this.rowRefs[index] = ref}>
                  {getDurationDisplayString(value, displayColumnData)}
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.CREATOR:
      case CellType.LAST_MODIFIER: {
        dom = <CreatorFormatter value={cellValue} />;
        break;
      }
      case CellType.SINGLE_SELECT: {
        if (!cellValue || cellValue.length === 0) return this.renderEmpty();
        const options = displayColumnData && Array.isArray(displayColumnData.options) ? displayColumnData.options : [];
        dom = (
          <MultipleSelectFormatter
            value={cellValue}
            options={options || []}
            containerClassName={`dtable-${displayColumnType}-formatter`}
          />
        );
        break;
      }
      case CellType.MULTIPLE_SELECT: {
        // not support yet.
        if (!cellValue || cellValue.length === 0) return this.renderEmpty();
        const options = displayColumnData && Array.isArray(displayColumnData.options) ? displayColumnData.options : [];
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              const valueDisplayString = Array.isArray(value) ? getMultipleOptionName(options, value) : getMultipleOptionName(options, [value]);
              return (
                <div key={`link-${displayColumnType}-${index}`} className="dtable-link-item" ref={ref => this.rowRefs[index] = ref}>
                  {valueDisplayString}
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.COLLABORATOR: {
        // not support yet.
        if (!cellValue || cellValue.length === 0) return this.renderEmpty();
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <div ref={ref => this.rowRefs[index] = ref}>
                  <LinkCollaboratorItemFormatter
                    key={`link-${displayColumnType}-${index}`}
                    value={Array.isArray(value) ? value : [ value ]}
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.CHECKBOX: {
        // not support yet.
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div ref={ref => this.rowRefs[index] = ref}>
                  <CheckboxFormatter
                    key={`link-${displayColumnType}-${index}`}
                    value={Boolean(value)}
                    containerClassName={`dtable-${displayColumnType}-item`}
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.GEOLOCATION: {
        // not support yet.
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <div key={`link-${displayColumnType}-${index}`} className="dtable-link-item" ref={ref => this.rowRefs[index] = ref}>
                  {getGeolocationDisplayString(value, displayColumnData)}
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.LONG_TEXT: {
        // not support yet.
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <div ref={ref => this.rowRefs[index] = ref}>
                  <LongTextFormatter
                    key={`link-${displayColumnType}-${index}`}
                    value={value}
                    containerClassName={`dtable-${displayColumnType}-item`}
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case CellType.FORMULA:
      case CellType.LINK_FORMULA: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div key={`link-${displayColumnType}-${index}`} className="dtable-link-item" ref={ref => this.rowRefs[index] = ref}>
                  {getFormulaDisplayString(value, displayColumn.data)}
                </div>
              );
            })}
          </div>
        );
        break;
      }
      case FORMULA_RESULT_TYPE.BOOL: {
        dom = (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              return (
                <div key={`link-${displayColumnType}-${index}`} className="dtable-link-item" ref={ref => this.rowRefs[index] = ref}>
                  {value + ''}
                </div>
              );
            })}
          </div>
        );
        break;
      }
      default: {
        return this.renderEmpty();
      }
    }

    const { isCellSelected } = this.props;
    const ellisId = `link-ellipsis-${column.key}`;
    return (
      <>
        <div className="links-formatter">
          <div className='formatter-show' ref={ref => this.linksContainerRef = ref}>
            <>
              {dom}
              <span
                id={ellisId}
                ref={ref => this.ellisRef = ref}
                className="link link-ellipsis mr-1 p-1"
                style={{display: this.state.isHasMore ? 'inline-flex' : 'none'}}
                onClick={this.expandLink}
              >
                <i className="dtable-font dtable-icon-more-level"></i>
              </span>
              <Tooltip
                placement='bottom'
                isOpen={this.state.tooltipOpen}
                toggle={this.toggleTooltip}
                target={ellisId}
                delay={{show: 0, hide: 0 }}
                fade={false}
              >
              </Tooltip>
            </>
            {isCellSelected &&
              <span className="link-add link p-1" onClick={this.addLink} ref={ref => this.addLinkRef = ref}>
                <i className="dtable-font dtable-icon-add-table"></i>
              </span>
            }
          </div>
        </div>
        {isCellSelected && <ExpandIcon onClick={this.expandLink}/>}
      </>
    );
  }
}
