import * as _ from 'lodash';
import {TreeviewItem} from 'ngx-treeview';

function keysToCamelCase(object) {
  const camelCaseObject = _.cloneDeep(object);
  return new TreeviewItem({
    value: camelCaseObject['id'] + ',' + camelCaseObject['displayName'],
    text: camelCaseObject['displayName'],
    collapsed: true,
    checked: false,
    children: _.map(camelCaseObject['children'], keysToCamelCase)
  });
}


export default keysToCamelCase;
