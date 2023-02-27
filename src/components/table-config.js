import { DateTimeForm, formatDateTime, matchDateTime } from './table-date-filter-forms';

export const COLUMN_DIFINITIONS = [
  {
    id: "email",
    header: "Email",
    cell: e => e.email,
    sortingField: "email"
  },
  {
    id: "event",
    header: "Event",
    cell: e => e.event,
    sortingField: "event"
  },
  {
    id: "type",
    header: "type",
    cell: e => e.type,
    sortingField: "type"
  },  { 
    id: "created", 
    header: "Created", 
    cell: e => e.created,
    sortingField: "created"
  },
  {
    id: "msg_id",
    header: "Message ID",
    cell: e => e.msg_id,
    sortingField: "msg_id"
  },
  {
    id: "smtp_id",
    header: "SMTP ID",
    cell: e => e.smtp_id,
    sortingField: "smtp_id"
  },
  {
    id: "reason",
    header: "Reason",
    cell: e => e.reason,
    sortingField: "reason"
  },
  {
    id: "ip",
    header: "IP",
    cell: e => e.ip,
    sortingField: "ip"
  },
  {
    id: "subject",
    header: "Subject",
    cell: e => e.subject,
    sortingField: "subject"
  },
  {
    id: "category",
    header: "Category",
    cell: e => JSON.stringify(e.category),
    sortingField: "category"
  },
  {
    id: "unique_arguments",
    header: "Unique arguments",
    cell: e => JSON.stringify(e.unique_arguments),
    sortingField: "unique_arguments"
  },
  {
    id: "url",
    header: "URL",
    cell: e => e.url,
    sortingField: "url"
  },
  {
    id: "asm_group_id",
    header: "asm_group_id",
    cell: e => e.asm_group_id,
    sortingField: "asm_group_id"
  },
];

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 Events' },
  { value: 30, label: '30 Events' },
  { value: 50, label: '50 Events' },
];

export const VISIBLE_CONTENT_OPTIONS = [
  {
    label: 'Properties',
    options: [
      { id: 'email', label: 'Email' },
      { id: 'event', label: 'Event' },
      { id: 'type', label: 'Type' },
      { id: 'created', label: 'Created' },
      { id: 'msg_id', label: 'Message ID' },
      { id: 'smtp_id', label: 'SMTP ID' },
      { id: 'reason', label: 'Reason' },
      { id: 'ip', label: 'IP' },
      { id: 'subject', label: 'Subject' },
      { id: 'category', label: 'Category' },
      { id: 'unique_arguments', label: 'Unique arguments' },
      { id: 'url', label: 'URL' },
      { id: 'asm_group_id', label: 'ASM group ID' },
    ],
  },
];

export const DEFAULT_PREFERENCES = {
  pageSize: 30,
  visibleContent: ['email', 'event', 'type', 'created', 'reason', 'category', 'subject'],
  wraplines: false,
  stripedRows: true,
};

export const FILTERING_PROPERTIES = [
  {
    propertyLabel: 'Email',
    key: 'email',
    groupValuesLabel: 'Email values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'Event',
    key: 'event',
    groupValuesLabel: 'Event values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'Type',
    key: 'type',
    groupValuesLabel: 'Type values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'Message ID',
    key: 'msg_id',
    groupValuesLabel: 'Message ID values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'SMTP ID',
    key: 'smtp_id',
    groupValuesLabel: 'SMTP ID values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'Reason',
    key: 'reason',
    groupValuesLabel: 'Reason values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'IP',
    key: 'ip',
    groupValuesLabel: 'IP values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'Subject',
    key: 'subject',
    groupValuesLabel: 'Subject values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'Category',
    key: 'category',
    groupValuesLabel: 'Category values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'Unique arguments',
    key: 'unique_arguments',
    groupValuesLabel: 'Unique arguments values',
    operators: [':', '!:', '=', '!='],
  },
  {
    propertyLabel: 'URL',
    key: 'url',
    groupValuesLabel: 'URL values',
    operators: [':', '!:', '=', '!='],
  },  
  {
    propertyLabel: 'ASM group ID',
    key: 'asm_group_id',
    groupValuesLabel: 'ASM group ID values',
    operators: [':', '!:', '=', '!='],
  },  
  {
    key: 'created',
    propertyLabel: 'Created',
    groupValuesLabel: 'Created value',
    defaultOperator: '>=',
    operators: ['<=', '>='].map(operator => ({
      operator,
      form: DateTimeForm,
      format: formatDateTime,
      match: (itemValue, tokenValue) => matchDateTime(operator, itemValue, tokenValue),
    })),
  },
  // Example for date(only) property:
  // {
  //   key: 'createdAt',
  //   propertyLabel: 'Created at',
  //   groupValuesLabel: '',
  //   operators: ['=', '!=', '<', '<=', '>', '>='].map(operator => ({
  //     operator,
  //     form: DateForm,
  //     match: 'date',
  //   })),
  // },
].sort((a, b) => a.propertyLabel.localeCompare(b.propertyLabel));
