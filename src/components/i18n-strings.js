export const tableAriaLabels = {
  allItemsSelectionLabel: () => 'select all',
  itemSelectionLabel: (data, row) => `select ${row.id}`,
  selectionGroupLabel: 'Distribution selection',
};

export const getHeaderCounterText = ( items, selectedItem ) => {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items.length})` : `(${items.length})`;
};

export const getTextFilterCounterText = (count) => `${count} ${count === 1 ? 'match' : 'matches'}`;

export const paginationAriaLabels = {
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
};

export const propertyFilterI18nStrings = {
  filteringAriaLabel: 'your choice',
  dismissAriaLabel: 'Dismiss',
  clearAriaLabel: 'Clear',

  filteringPlaceholder: 'Filter events by text, property or value',
  groupValuesText: 'Values',
  groupPropertiesText: 'Properties',
  operatorsText: 'Operators',

  operationAndText: 'and',
  operationOrText: 'or',

  operatorLessText: 'Less than',
  operatorLessOrEqualText: 'Less than or equal',
  operatorGreaterText: 'Greater than',
  operatorGreaterOrEqualText: 'Greater than or equal',
  operatorContainsText: 'Contains',
  operatorDoesNotContainText: 'Does not contain',
  operatorEqualsText: 'Equals',
  operatorDoesNotEqualText: 'Does not equal',

  editTokenHeader: 'Edit filter',
  propertyText: 'Property',
  operatorText: 'Operator',
  valueText: 'Value',
  cancelActionText: 'Cancel',
  applyActionText: 'Apply',
  allPropertiesLabel: 'All properties',

  tokenLimitShowMore: 'Show more',
  tokenLimitShowFewer: 'Show fewer',
  clearFiltersText: 'Clear filters',
  removeTokenButtonAriaLabel: token => `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
  enteredTextLabel: text => `Use: "${text}"`,
};