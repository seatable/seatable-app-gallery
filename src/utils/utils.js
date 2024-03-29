import intl from 'react-intl-universal';
import {
  CellType,
  generatorBase64Code,
} from 'dtable-utils';
import context from '../context';

export const generatorViewId = (views) => {
  let view_id, isUnique = false;
  while (!isUnique) {
    view_id = generatorBase64Code(4);

    // eslint-disable-next-line
    isUnique = views.every(item => {return item._id !== view_id;});
    if (isUnique) {
      break;
    }
  }
  return view_id;
};

export const getImageThumbnailUrl = (url) => {
  const server = context.getSetting('server');
  let isInternalLink = url.indexOf(server) > -1;
  if (isInternalLink) {
    let imageThumbnailUrl = url.replace('/workspace', '/thumbnail/workspace') + '?size=256';
    return imageThumbnailUrl;
  }
  return url;
};

export const calculateColumns = (galleryColumnsName, currentColumns) => {
  let newColumns = [];
  galleryColumnsName.forEach(columnName => {
    let column = currentColumns.find(column => columnName === column.name);
    if (column) {
      newColumns.push(column);
    }
  });
  return newColumns;
};

export const calculateColumnsName = (currentColumns, galleryColumnsName) => {
  let newColumnsName = [];
  currentColumns.forEach(column => {
    newColumnsName.push(column.name);
  });
  if (galleryColumnsName) {
    let columnsName = Array.from(new Set([...galleryColumnsName, ...newColumnsName]));
    newColumnsName = columnsName.filter(columnName => newColumnsName.some(c => c === columnName));
  }
  return newColumnsName;
};

export const checkDesktop = () => {
  return window.innerWidth >= 768;
};

export const isEditAppPage = () => {
  return context.getSetting('isEditAppPage');
}

export const getTitleColumns = (dtable, columns) => {
  const SHOW_TITLE_COLUMN_TYPE = [
    CellType.TEXT, CellType.SINGLE_SELECT, CellType.MULTIPLE_SELECT, 
    CellType.NUMBER, CellType.FORMULA,CellType.DATE, CellType.COLLABORATOR, 
    CellType.GEOLOCATION, CellType.CTIME, CellType.MTIME, CellType.CREATOR, 
    CellType.LAST_MODIFIER];
  return columns.filter(column => SHOW_TITLE_COLUMN_TYPE.find(type => type === column.type));
}

export const getImageColumns = (columns) => {
  return columns.filter(column => column.type === 'image');
}

export const validateName = (name) => {
  name = name.trim();
  if (name === '') {
    return { isValid: false, message: intl.get('Name_is_required') };
  }
  if (name.includes('/')) {
    return { isValid: false, message: intl.get('Name_cannot_contain_slash') };
  }
  if (name.includes('\\')) {
    return { isValid: false, message: intl.get('Name_cannot_contain_backslash') };
  }
  return { isValid: true, message: name };
};
