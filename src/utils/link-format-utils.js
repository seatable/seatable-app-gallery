import {
  CellType, getNumberDisplayString, getOptionName, getMultipleOptionName, getCollaboratorsName,
  getDurationDisplayString, COLLABORATOR_COLUMN_TYPES, DateUtils, FORMULA_RESULT_TYPE,
  getGeolocationDisplayString,
} from 'dtable-store';
import context from '../context';

const getLongtextDisplayString = (value) => {
  let { text } = value || {};
  if (!text) {
    return null;
  }
  return text;
};

export const getFormulaArrayValue = (value, isFlat = true) => {
  if (!Array.isArray(value)) return [];
  if (!isFlat) return getTwoDimensionArrayValue(value);
  return value
    .map(item => {
      if (Object.prototype.toString.call(item) !== '[object Object]') {
        return item;
      }
      if (!Object.prototype.hasOwnProperty.call(item, 'display_value')) return item;
      const { display_value } = item;
      if (!Array.isArray(display_value) || display_value.length === 0) return display_value;
      return display_value.map(i => {
        if (Object.prototype.toString.call(i) === '[object Object]') {
          if (!Object.prototype.hasOwnProperty.call(i, 'display_value')) return i;
          const { display_value } = i;
          return display_value;
        }
        return i;
      });
    })
    .flat();
};

export const getTwoDimensionArrayValue = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => {
      if (Object.prototype.toString.call(item) !== '[object Object]') {
        return item;
      }
      if (!Object.prototype.hasOwnProperty.call(item, 'display_value')) return item;
      const { display_value } = item;
      if (!Array.isArray(display_value) || display_value.length === 0) return display_value;
      return display_value.map(i => {
        if (Object.prototype.toString.call(i) === '[object Object]') {
          if (!Object.prototype.hasOwnProperty.call(i, 'display_value')) return i;
          const { display_value } = i;
          return display_value;
        }
        return i;
      });
    });
};

export const getCellDisplayValue = (record, column) => {
  const { type, data, key } = column;
  const cellValue = record[key];
  switch (type) {
    case CellType.NUMBER: {
      return getNumberDisplayString(cellValue, data);
    }
    case CellType.DATE: {
      if (!cellValue || typeof cellValue !== 'string') return '';
      const { format } = data || {};
      return DateUtils.format(cellValue, format);
    }
    case CellType.COLLABORATOR: {
      if (!Array.isArray(cellValue)) return '';
      const collaborators = Object.values(context.collaboratorsCache);
      return getCollaboratorsName(cellValue, collaborators);
    }
    case CellType.CREATOR:
    case CellType.LAST_MODIFIER: {
      if (!cellValue) return '';
      if (cellValue === 'anonymous') return cellValue;
      const collaborators = Object.values(context.collaboratorsCache);
      return getCollaboratorsName([cellValue], collaborators);
      
    }
    case CellType.SINGLE_SELECT: {
      if (!data) return '';
      const { options } = data;
      return getOptionName(options, cellValue);
    }
    case CellType.MULTIPLE_SELECT: {
      if (!data) return '';
      let { options = [] } = data;
      return getMultipleOptionName(options, cellValue);
    }
    case CellType.FORMULA:
    case CellType.LINK_FORMULA: {
      return getFormulaDisplayString(cellValue, data);
    }
    case CellType.LONG_TEXT: {
      return getLongtextDisplayString(cellValue);
    }
    case CellType.DURATION: {
      return getDurationDisplayString(cellValue, data);
    }
    case CellType.CTIME:
    case CellType.MTIME: {
      return DateUtils.format(cellValue.replace('T', ' ').replace('Z', ''), 'YYYY-MM-DD HH:MM:SS');
    }
    case CellType.GEOLOCATION: {
      return getGeolocationDisplayString(cellValue, data);
    }
    case CellType.FILE:
    case CellType.IMAGE:  { 
      return '';
    }
    // not support
    case CellType.BUTTON: { 
      return '';
    }
    default: {
      return cellValue ? cellValue + '' : '';
    }
  }
};


export const getFormulaDisplayString = (cellValue, columnData) => {
  if (!columnData) return null;
  const { result_type } = columnData;
  if (result_type === FORMULA_RESULT_TYPE.NUMBER) {
    return getNumberDisplayString(cellValue, columnData);
  }
  if (result_type === FORMULA_RESULT_TYPE.DATE) {
    const { format } = columnData;
    return DateUtils.format(cellValue, format);
  }
  if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
    const { array_type, array_data } = columnData;
    if (!array_type) {
      return null;
    }
    if (COLLABORATOR_COLUMN_TYPES.includes(array_type)) {
      return cellValue;
    }
    const collaborators = Object.values(context.collaboratorsCache);
    if (isArrayFormalColumn(array_type) && Array.isArray(cellValue)) {
      return cellValue.map((val) => {
        return getCellDisplayValue(
          {'FORMULA_ARRAY': val  },
          { type: array_type, key: 'FORMULA_ARRAY', data: array_data },
          collaborators
        );
      }).join(', ');
    }

    return getCellDisplayValue(
      {'FORMULA_ARRAY': cellValue},
      { type: array_type, key: 'FORMULA_ARRAY', data: array_data },
      collaborators,
    );
  }
  if (Object.prototype.toString.call(cellValue) === '[object Boolean]') {
    return cellValue + '';
  }
  return cellValue;
};

export function isArrayFormalColumn(columnType) {
  return [
    CellType.IMAGE,
    CellType.FILE,
    CellType.MULTIPLE_SELECT,
    CellType.COLLABORATOR
  ].includes(columnType);
}
