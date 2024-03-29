import React from 'react';
import PropTypes from 'prop-types';
import { CellType } from 'dtable-utils';
import { 
  TextFormatter,
  NumberFormatter,
  CheckboxFormatter,
  DateFormatter,
  SingleSelectFormatter,
  MultipleSelectFormatter,
  CollaboratorFormatter,
  ImageFormatter,
  FileFormatter,
  GeolocationFormatter,
  SimpleLongTextFormatter,
  FormulaFormatter,
  CTimeFormatter,
  CreatorFormatter,
  LastModifierFormatter,
  MTimeFormatter,
  AutoNumberFormatter,
  UrlFormatter,
  EmailFormatter,
  DurationFormatter,
  RateFormatter,
  ButtonFormatter,
} from 'dtable-ui-component';
import intl from 'react-intl-universal';
import context from '../../context';
import eventBus from '../../utils/event-bus';
import LinkFormatter from './link-formatter';

import '../../assets/css/formatter.css';

const propTypes = {
  type: PropTypes.string,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  getOptionColors: PropTypes.func,
};

class EditorFormatter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collaborators: context.getCollaboratorsFromCache(),
    }
    this.isBaiduMap = context.isBaiduMap();
  }

  componentDidMount() {
    this.calculateCollaboratorData(this.props);
    this.listenCollaboratorsUpdated = eventBus.subscribe('collaborators-updated', this.updateCollaborators);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateCollaboratorData(nextProps);
  }

  componentWillUnmount() {
    this.listenCollaboratorsUpdated();
  }

  updateCollaborators = () => {
    this.setState({
      collaborators: context.getCollaboratorsFromCache(),
    });
  }

  calculateCollaboratorData = (props) => {
    const { row, column } = props;
    if (column.type === CellType.CREATOR || column.type === CellType.LAST_MODIFIER) {
      const email = row[column.name];
      context.loadCollaborator(email);
    }
    else if (column.type === CellType.COLLABORATOR) {
      const emails = row[column.name];
      if (Array.isArray(emails)) {
        emails.forEach(email => {
          context.loadCollaborator(email);
        });
      }
    }
  }

  renderColumnFormatter = (formatter) => {
    const { column } = this.props;
    const { name: columnName } = column;
    return (
      <>
        <div className="gallery-editor-title">
          <span className="gallery-editor-title-text">{columnName}</span>
        </div>
        <div style={{minHeight: 28}}>
          {formatter}
        </div>
      </>
    );
  }

  renderEmptyFormatter = () => {
    const { displayFieldsName } = this.props;
    let emptyFormatter = <span className="row-cell-empty d-inline-block"></span>;
    if (this.props.type === 'row_title') {
      emptyFormatter = <span>{intl.get('Unnamed_record')}</span>;
    }
    if (displayFieldsName)  {
      emptyFormatter = this.renderColumnFormatter(emptyFormatter);
    }
    return emptyFormatter;
  }

  renderFormatter = () => {
    const { column, row, displayFieldsName } = this.props;
    let { type: columnType, name: columnName } = column;
    const { collaborators } = this.state;
    switch(columnType) {
      case CellType.TEXT: {
        let textFormatter = <TextFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
        if (!row[columnName]) {
          textFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          textFormatter = this.renderColumnFormatter(textFormatter);
        }
        return textFormatter;
      }
      case CellType.COLLABORATOR: {
        if (!row[columnName] || row[columnName].length === 0) {
          return this.renderEmptyFormatter();
        }
        let collaboratorFormatter = <CollaboratorFormatter value={row[columnName]} collaborators={collaborators} />;
        if (displayFieldsName) {
          collaboratorFormatter = this.renderColumnFormatter(collaboratorFormatter);
        }
        return collaboratorFormatter;
      }
      case CellType.LONG_TEXT: {
        let longTextFormatter = <SimpleLongTextFormatter value={row[columnName]} />;
        if (!row[columnName]) {
          longTextFormatter =  this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          longTextFormatter = this.renderColumnFormatter(longTextFormatter);
        }
        return longTextFormatter;
      }
      case CellType.IMAGE: {
        let imageFormatter = <ImageFormatter value={row[columnName]} isSample />;
        if (!row[columnName] || row[columnName].length === 0) {
          imageFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          imageFormatter = this.renderColumnFormatter(imageFormatter);
        }
        return imageFormatter;
      }
      case CellType.GEOLOCATION : {
        const cellValue = row[columnName];
        if (!cellValue) {
          return this.renderEmptyFormatter();
        }
        let geolocationFormatter = (
          <GeolocationFormatter
            value={cellValue}
            containerClassName="gallery-text-editor"
            isBaiduMap={this.isBaiduMap}
          />
        );
        if (displayFieldsName) {
          return this.renderColumnFormatter(geolocationFormatter);
        }
        return geolocationFormatter;
      }
      case CellType.NUMBER: {
        let numberFormatter = <NumberFormatter value={row[columnName]} data={column.data} />;
        if (!row[columnName]) {
          numberFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          numberFormatter = this.renderColumnFormatter(numberFormatter);
        }
        return numberFormatter;
      }
      case CellType.DATE: {
        let dateFormatter = <DateFormatter value={row[columnName]} format={column.data.format} />;
        if (!row[columnName]) {
          dateFormatter =  this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          dateFormatter = this.renderColumnFormatter(dateFormatter);
        }
        return dateFormatter;
      }
      case CellType.MULTIPLE_SELECT: {
        const options = (column.data && column.data.options) || [];
        let multipleSelectFormatter = <MultipleSelectFormatter value={row[columnName]} options={options} />;
        if (!row[columnName] || row[columnName].length === 0) {
          multipleSelectFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          multipleSelectFormatter = this.renderColumnFormatter(multipleSelectFormatter);
        }
        return multipleSelectFormatter;
      }
      case CellType.SINGLE_SELECT: {
        const options = (column.data && column.data.options) || [];
        let singleSelectFormatter = <SingleSelectFormatter value={row[columnName]} options={options} />;
        if (!row[columnName]) {
          singleSelectFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          singleSelectFormatter = this.renderColumnFormatter(singleSelectFormatter);
        }
        return singleSelectFormatter;
      }
      case CellType.FILE: {
        let fileFormatter = <FileFormatter value={row[columnName]} isSample />;
        if (!row[columnName] || row[columnName].length === 0) {
          fileFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          fileFormatter = this.renderColumnFormatter(fileFormatter);
        }
        return fileFormatter;
      }
      case CellType.CHECKBOX: {
        let checkboxFormatter = <CheckboxFormatter value={row[columnName]} />;
        if (displayFieldsName) {
          checkboxFormatter = this.renderColumnFormatter(checkboxFormatter);
        }
        return checkboxFormatter;
      }
      case CellType.CTIME: {
        let cTimeFormatter = <CTimeFormatter value={row._ctime} />;
        if (!row._ctime) {
          cTimeFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          cTimeFormatter = this.renderColumnFormatter(cTimeFormatter);
        }
        return cTimeFormatter;
      }
      case CellType.MTIME: {
        let mTimeFormatter = <MTimeFormatter value={row._mtime} />;
        if (!row._mtime) {
          mTimeFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          mTimeFormatter = this.renderColumnFormatter(mTimeFormatter);
        }
        return mTimeFormatter;
      }
      case CellType.CREATOR: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        let creatorFormatter = <CreatorFormatter collaborators={collaborators} value={row[columnName]} />;
        if (displayFieldsName) {
          creatorFormatter = this.renderColumnFormatter(creatorFormatter);
        }
        return creatorFormatter;
      }
      case CellType.LAST_MODIFIER: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        let lastModifierFormatter = <LastModifierFormatter collaborators={collaborators} value={row[columnName]} />;
        if (displayFieldsName) {
          lastModifierFormatter = this.renderColumnFormatter(lastModifierFormatter);
        }
        return lastModifierFormatter;
      }
      case CellType.LINK_FORMULA:
      case CellType.FORMULA: {
        let formulaValue = row[columnName];
        if (!formulaValue && formulaValue !== 0) {
          return this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          return this.renderColumnFormatter(
            <FormulaFormatter
              value={formulaValue}
              column={column}
              collaborators={collaborators}
              containerClassName="gallery-formula-container"
            />
          );
        }
        return (
          <FormulaFormatter
            value={formulaValue}
            column={column}
            collaborators={collaborators}
            containerClassName="gallery-formula-container"
          />
        );
      }
      case CellType.LINK: {
        const value = row[columnName];
        if (!Array.isArray(value) || value.length === 0) return this.renderEmptyFormatter();
        let linkFormatter = (
          <LinkFormatter
            value={value}
            column={column}
            containerClassName="dtable-link-formatter"
            renderEmptyFormatter={this.renderEmptyFormatter}
            getOptionColors={this.props.getOptionColors}
          />
        );
        if (displayFieldsName) {
          linkFormatter = this.renderColumnFormatter(linkFormatter);
        }
        return linkFormatter;
      }
      case CellType.AUTO_NUMBER: {
        let autoNumberFormatter = <AutoNumberFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
        if (!row[columnName]) {
          autoNumberFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          autoNumberFormatter = this.renderColumnFormatter(autoNumberFormatter);
        }
        return autoNumberFormatter;
      }
      case CellType.URL: {
        let urlFormatter = <UrlFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
        if (!row[columnName]) {
          urlFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          urlFormatter = this.renderColumnFormatter(urlFormatter);
        }
        return urlFormatter;
      }
      case CellType.EMAIL: {
        let emailFormatter = <EmailFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
        if (!row[columnName]) {
          emailFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          emailFormatter = this.renderColumnFormatter(emailFormatter);
        }
        return emailFormatter;
      }
      case CellType.DURATION: {
        let durationFormatter = <DurationFormatter value={row[columnName]} format={column.data.duration_format} containerClassName="gallery-text-editor" />;
        if (!row[columnName]) {
          durationFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          durationFormatter = this.renderColumnFormatter(durationFormatter);
        }
        return durationFormatter;
      }
      case CellType.RATE: {
        let rateFormatter = <RateFormatter value={row[columnName]} data={column.data} containerClassName="gallery-text-editor" />;
        if (!row[columnName]) {
          rateFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          rateFormatter = this.renderColumnFormatter(rateFormatter);
        }
        return rateFormatter;
      }
      case CellType.BUTTON: {
        const { data = {} } = column;
        const optionColors = this.props.getOptionColors();
        let buttonFormatter = <ButtonFormatter data={data} optionColors={optionColors} containerClassName="text-center" />;
        if (!data.button_name) {
          buttonFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          buttonFormatter = this.renderColumnFormatter(buttonFormatter);
        }
        return buttonFormatter;
      }
      default:
        return null
    }
  }

  render() {
    return this.renderFormatter();
  }
}

EditorFormatter.propTypes = propTypes;

export default EditorFormatter;
