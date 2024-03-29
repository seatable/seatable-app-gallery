import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import {
  CellType,
  FORMULA_RESULT_TYPE,
  getDurationDisplayString,
  getFormulaDisplayString,
} from 'dtable-utils';
import {
  MultipleSelectFormatter, NumberFormatter, DateFormatter, CTimeFormatter,
  MTimeFormatter,
} from 'dtable-ui-component';
import CreatorFormatter from './creator-formatter';

import '../../assets/css/link-formatter.css';

export default class LinkFormatter extends React.Component {

  static propTypes = {
    column: PropTypes.object.isRequired,
    value: PropTypes.any,
    containerClassName: PropTypes.string,
    renderEmptyFormatter: PropTypes.func,
    getOptionColors: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      canOpenInternalLink: false,
      tooltipOpen: false,
      isHasMore: false,
    };
    this.rowRefs = [];
    this.ellisRef = null;
  }

  toggleTooltip = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  render () {
    const props = this.props;
    const { column, value, containerClassName } = props;
    const { data } = column;
    if (!Array.isArray(value) || value.length === 0) {
      return this.props.renderEmptyFormatter();
    }

    const { array_type: arrayType, display_column_key: displayColumnKey, array_data: arrayData } = data || {};
    const displayColumn = { type: arrayType, key: displayColumnKey, data: arrayData }
    const { type: displayColumnType, data: displayColumnData } = displayColumn;
    const cellValue = value.map((link) => link && link.display_value).filter(Boolean);
    if (!Array.isArray(cellValue) || cellValue.length === 0) {
      return this.props.renderEmptyFormatter();
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
              return (
                <div key={`link-${displayColumnType}-${index}`} ref={ref => this.rowRefs[index] = ref}>
                  <DateFormatter
                    value={value}
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
        if (!cellValue || cellValue.length === 0) return this.props.renderEmptyFormatter();
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
      case CellType.COLLABORATOR: {
        // not support yet.
        this.props.renderEmptyFormatter();
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
        return this.props.renderEmptyFormatter();
      }
    }

    const ellisId = `link-ellipsis-${column.key}`;
    return (
      <div className="links-formatter">
        <div className='formatter-show' ref={ref => this.linksContainerRef = ref}>
          <>
            {dom}
            <span
              id={ellisId}
              ref={ref => this.ellisRef = ref}
              className="link link-ellipsis mr-1 p-1"
              style={{display: this.state.isHasMore ? 'inline-flex' : 'none'}}
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
        </div>
      </div>
    );
  }
}
