import { getCellValueDisplayString } from 'dtable-utils';
import context from '../context';

export const getCellDisplayValue = (record, column) => {
  const { type, data, key } = column;
  const collaborators = Object.values(context.collaboratorsCache);
  return getCellValueDisplayString(record, type, key, {
    data, collaborators, geolocationHyphen: ' ',
  });
};
