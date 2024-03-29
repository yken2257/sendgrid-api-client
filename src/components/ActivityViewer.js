import  { useState, useContext } from "react";
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  AppLayout,
  Button,
  Box,
  CollectionPreferences,
  Flashbar,
  FormField,
  Header,
  Input,
  Pagination,
  Popover,
  PropertyFilter,
  Select,
  SideNavigation,
  SpaceBetween,
  StatusIndicator,
  Table
} from "@cloudscape-design/components";
import { ApiKeyContext } from "./Contexts";
import MenuSideNavigation from "./MenuSideNavigation";
import { 
  PAGE_SIZE_OPTIONS, 
  VISIBLE_CONTENT_OPTIONS, 
  COLUMN_DIFINITIONS, 
  DEFAULT_PREFERENCES, 
  FILTERING_PROPERTIES 
} from "./table-config";
import {
  tableAriaLabels,
  getHeaderCounterText,
  getTextFilterCounterText,
  paginationAriaLabels,
  propertyFilterI18nStrings,
} from './i18n-strings';

const TableNoMatchState = props => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>No matches</b>
        <Box variant="p" color="inherit">
          We can't find a match.
        </Box>
      </div>
      <Button onClick={props.onClearFilter}>Clear filter</Button>
    </SpaceBetween>
  </Box>
);

const TableEmptyState = ({ resourceName }) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>No {resourceName.toLowerCase()}s</b>
        <Box variant="p" color="inherit">
          No {resourceName.toLowerCase()} associated with this resource.
        </Box>
      </div>
      <Button>Get {resourceName.toLowerCase()}</Button>
    </SpaceBetween>
  </Box>
);

const Preferences = ({
  preferences,
  setPreferences,
  disabled,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  visibleContentOptions = VISIBLE_CONTENT_OPTIONS,
}) => (
  <CollectionPreferences
    title="Preferences"
    confirmLabel="Confirm"
    cancelLabel="Cancel"
    disabled={disabled}
    preferences={preferences}
    onConfirm={({ detail }) => setPreferences(detail)}
    pageSizePreference={{
      title: 'Page size',
      options: pageSizeOptions,
    }}
    wrapLinesPreference={{
      label: 'Wrap lines',
      description: 'Check to see all the text and wrap the lines',
    }}
    stripedRowsPreference={{
      label: 'Striped rows',
      description: 'Check to add alternating shaded rows',
    }}
    visibleContentPreference={{
      title: 'Select visible columns',
      options: visibleContentOptions,
    }}
  />
);

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Tokyo'
};

export default function ActivityViewer () {
  const { apiKey, setApiKey, selectedKey, setSelectedKey } = useContext(ApiKeyContext);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [errMsg, setErrMsg] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const err = new Error();
    try {
      const headers = {
        "Authorization": `Bearer ${selectedKey.value}`,
        "Content-Type": "application/json"
      }
      const endpointUrl = new URL("https://api.sendgrid.com/v3/email_activity");
      const res = await fetch(endpointUrl, {
        method: "GET",
        headers: headers
      });
      const ok = res.ok;
      const status = res.status;
      const statusText = res.statusText;
      const responseBody = await res.json();
      if (ok) {
        const data = responseBody.map(obj => {
          const date = new Date(obj.created * 1000);
          const dateString = date.toLocaleString('ja-JP', dateOptions);
          return {
            ...obj,
            created: dateString
          }
        });
        setData(data);
      } else {
        err.message = `${status} ${statusText}; ${JSON.stringify(responseBody)}`;
        throw err;
      }
    } catch (error) {
      setFetchFailed(true);
      setErrMsg(error.message);
    }
    setIsLoading(false);
  };

  const { items, actions, filteredItemsCount, collectionProps, paginationProps, propertyFilterProps } = useCollection(
    data,
    {
      propertyFiltering: {
        filteringProperties: FILTERING_PROPERTIES,
        empty: <TableEmptyState resourceName="Distribution" />,
        noMatch: (
          <TableNoMatchState
            onClearFilter={() => {
              actions.setPropertyFiltering({ tokens: [], operation: 'and' });
            }}
          />
        ),
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: { defaultState: { sortingColumn: COLUMN_DIFINITIONS[3], isDescending: true } },
      selection: {},
    }
  );

  const FailFlash = () => (
    <Flashbar
      items={[{
      header: "Fetch API execution failed",
      type: "error",
      content: (<>{errMsg}</>),
      dismissible: true,
      onDismiss: () => setFetchFailed(false),
      id: "fetch_failed"
      }]}
    />
  );

  return (
    <AppLayout
      toolsHide={true}
      contentType="table"
      navigation={<MenuSideNavigation/>}
      notifications={fetchFailed && <FailFlash errMsg={errMsg} />}
      content={
        <Table
          sortingDisabled
          items={items}
          columnDefinitions={COLUMN_DIFINITIONS}
          visibleColumns={preferences.visibleContent}
          ariaLabels={tableAriaLabels}
          variant="full-page"
          stickyHeader={true}
          // resizableColumns={true}
          wrapLines={preferences.wrapLines}
          stripedRows={preferences.stripedRows}
          // onColumnWidthsChange={saveWidths}
          header={
            <Header
              description="Email Activityの表示検索ツール"
              counter={`(${data.length})`}
              actions={                
                  <FormField
                    label="API Key"
                    errorText={selectedKey ? "" : "No key selected"}
                  >
                    <SpaceBetween direction="horizontal" size="m">
                    {apiKey.length === 0 ?
                      <Popover
                        dismissButton={false}
                        size="small"
                        triggerType="custom"
                        content={
                          <StatusIndicator type="info">Set in menu bar</StatusIndicator>
                        }
                      >
                        <Select value={null} placeholder="Register your API key" disabled/>
                      </Popover>
                    :
                      <Select
                        selectedOption={selectedKey}
                        onChange={({ detail }) => setSelectedKey(detail.selectedOption)}
                        options={apiKey}
                        selectedAriaLabel="Selected"
                        placeholder="Choose your API key"
                      />
                    }
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!selectedKey} 
                      loading={isLoading}
                    >
                      Fetch data
                    </Button>
                    </SpaceBetween>
                  </FormField>
                  
                
              }
            >
              Email Activity Viewer
            </Header>
          }
          loadingText="Loading..."
          filter={
            <PropertyFilter
              {...propertyFilterProps}
              i18nStrings={propertyFilterI18nStrings}
              countText={getTextFilterCounterText(filteredItemsCount)}
              expandToViewport={true}
            />
          }
          pagination={<Pagination {...paginationProps} ariaLabels={paginationAriaLabels} />}
          preferences={<Preferences preferences={preferences} setPreferences={setPreferences} />}
        />
      }
    />
  )
};