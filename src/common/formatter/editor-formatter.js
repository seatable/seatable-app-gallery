import React from 'react';
import PropTypes from 'prop-types';
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
  // LinkFormatter,
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
  ButtonFormatter
} from 'dtable-ui-component';
import intl from 'react-intl-universal';
import context from '../../context';
import '../../assets/css/formatter.css';

const propTypes = {
  type: PropTypes.string,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  CellType: PropTypes.object,
  getOptionColors: PropTypes.func,
};

class EditorFormatter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      collaborators: context.getCollaboratorsFromCache(),
    }
  }

  componentDidMount() {
    this.calculateCollaboratorData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateCollaboratorData(nextProps);
  }

  calculateCollaboratorData = (props) => {
    const { row, column, CellType } = props;
    if (column.type === CellType.CREATOR || column.type === CellType.LAST_MODIFIER) {
      const email = row[column.name];
      this.getCollaborator(email);
    }
    else if (column.type === CellType.COLLABORATOR) {
      const emails = row[column.name];
      if (Array.isArray(emails)) {
        emails.forEach(email => {
          this.getCollaborator(email);
        });
      }
    }
  }

  getCollaborator = (email) => {
    if (!email) {
      this.setState({ isDataLoaded: true });
      return;
    }
    this.setState({ isDataLoaded: false });

    // If found from the current state, then return directly
    let { collaborators } = this.state;
    let collaborator = collaborators && collaborators.find(c => c.email === email);
    if (collaborator) {
      this.setState({ isDataLoaded: true });
      return;
    }
    
    // If not found email request on demand
    console.log(email);
    context.getUserCommonInfo(email).then(res => {
      collaborator = res.data;
      context.updateCollaboratorsCache(email, collaborator);
      this.setState({
        isDataLoaded: true,
        collaborators: context.getCollaboratorsFromCache(),
      });
    }).catch(() => {
      // If the network request is wrong, set the default avatar
      let mediaUrl = context.getSetting('mediaUrl');
      let defaultAvatarUrl = `${mediaUrl}/avatars/default.png`;
      collaborator = {
        name: email,
        avatar_url: defaultAvatarUrl,
      };
      context.updateCollaboratorsCache(email, collaborator);
      this.setState({
        isDataLoaded: true,
        collaborators: context.getCollaboratorsFromCache(),
      });
    });
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
    const { column, row, CellType, displayFieldsName } = this.props;
    let { type: columnType, name: columnName } = column;
    const { isDataLoaded, collaborators } = this.state;
    
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
        if (!row[columnName] || row[columnName].length === 0 || !isDataLoaded) {
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
       let geolocationFormatter = <GeolocationFormatter value={row[columnName]} containerClassName="gallery-text-editor" />;
        if (!row[columnName]) {
          geolocationFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          geolocationFormatter = this.renderColumnFormatter(geolocationFormatter);
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
        if (!isDataLoaded) return null;
        let creatorFormatter = <CreatorFormatter collaborators={collaborators} value={row[columnName]} />;
        if (displayFieldsName) {
          creatorFormatter = this.renderColumnFormatter(creatorFormatter);
        }
        return creatorFormatter;
      }
      case CellType.LAST_MODIFIER: {
        if (!row[columnName]) return this.renderEmptyFormatter();
        if (!isDataLoaded) return null;
        let lastModifierFormatter = <LastModifierFormatter collaborators={collaborators} value={row[columnName]} />;
        if (displayFieldsName) {
          lastModifierFormatter = this.renderColumnFormatter(lastModifierFormatter);
        }
        return lastModifierFormatter;
      }
      case CellType.FORMULA: {
        let formulaValue = row[columnName];
        let formulaFormatter = <FormulaFormatter value={formulaValue} column={column} collaborators={collaborators} tables={[]} containerClassName="gallery-formula-container" />;
        if (!formulaValue) {
          formulaFormatter = this.renderEmptyFormatter();
        } else if (displayFieldsName) {
          formulaFormatter = this.renderColumnFormatter(formulaFormatter);
        }
        return formulaFormatter;
      }
      case CellType.LINK: {
        // todo ?? return null
        return this.renderEmptyFormatter();
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
    return(
      <>
        {this.renderFormatter()}
      </>
    );
  }
}

EditorFormatter.propTypes = propTypes;

export default EditorFormatter;
