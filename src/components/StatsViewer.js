import  { useState, useContext } from "react";
import {
  AppLayout,
  Button,
  Box,
  Container,
  ContentLayout,
  DateRangePicker,
  Flashbar,
  Form,
  FormField,
  Grid,
  Header,
  Input,
  LineChart,
  Popover,
  Select,
  SideNavigation,
  SpaceBetween,
  StatusIndicator
} from "@cloudscape-design/components";
import { ApiKeyContext } from "./Contexts";
import MenuSideNavigation from "./MenuSideNavigation";

export default function StatsViewer () {
  const { apiKey, setApiKey, selectedKey, setSelectedKey } = useContext(ApiKeyContext);
  const [aggregation, setAggrigation] = useState({"label": "Aggregated by day", "value": "day"});
  const [dateInput, setDateInput] = useState(undefined);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const METRICS = ["requests", "deferred", "delivered", "blocks", "bounces", "invalid_emails", "opens", "clicks", "unique_opens", "unique_clicks", "unsubscribes", "spam_reports", "bounce_drops", "unsubscribe_drops", "spam_report_drops"];
  const DEFAULT_METRICS = ["requests", "deferred", "delivered", "blocks", "bounces", "invalid_emails"]
  const [dataset, setDataset] = useState(
    METRICS.map(metric => ({
      title: metric,
      type: "line",
      data: []
    }))
  );
  const [visibleData, setVisibleData] = useState();

  const handleDateInputChange = ({detail}) => {
    if (detail.value.type == "absolute") {
      setStartDate(detail.value.startDate);
      setEndDate(detail.value.endDate);
    }
    if (detail.value.type == "relative") {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const today = new Date();
      setEndDate(today.toLocaleDateString("ja-JP", options).replace(/\//g, '-'));
      const start = new Date();
      if (detail.value.unit == "week") {
        start.setDate(today.getDate() - 7*detail.value.amount);
      } else if (detail.value.unit == "month") {
        start.setMonth(today.getMonth() - detail.value.amount);
      } else if (detail.value.unit == "year") {
        start.setFullYear(today.getFullYear() - detail.value.amount);
      }
      setStartDate(start.toLocaleDateString("ja-JP", options).replace(/\//g, '-'));
    }
    setDateInput(detail.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const err = new Error();
    try {
      const headers = {
        "Authorization": `Bearer ${selectedKey.value}`,
        "Content-Type": "application/json"
      }
      const queries = {
        "aggregated_by": aggregation.value,
        "start_date": startDate,
        "end_date": endDate
      }
      const endpointUrl = new URL("https://api.sendgrid.com/v3/stats");
      endpointUrl.search = new URLSearchParams(queries);
      const res = await fetch(endpointUrl, {
        method: "GET",
        headers: headers
      });
      const ok = res.ok;
      const status = res.status;
      const statusText = res.statusText;
      const responseBody = await res.json();
      if (!ok) {
        err.message = `${status} ${statusText}; ${JSON.stringify(responseBody)}`;
        throw err;
      } else {
        const result = METRICS.map(metric => ({
          title: metric,
          type: "line",
          data: []
        }));

        responseBody.forEach(item => {
          const date = new Date(item.date);
          const stats = item.stats[0].metrics;
          
          METRICS.forEach(metric => {
            result.find(r => r.title === metric).data.push({ x: date, y: stats[metric] });
          });
        });
        setDataset(result);
        setVisibleData(result.filter(item => DEFAULT_METRICS.includes(item.title)));
      }
    } catch (error) {
      setFetchFailed(true);
      setErrMsg(error.message);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (event) => {
    console.log(event);
  };

  const customDataRangePicker = (
    <DateRangePicker
    onChange={handleDateInputChange}
    value={dateInput}
    relativeOptions={[
      {
        key: "previous-1-week",
        amount: 1,
        unit: "week",
        type: "relative"
      },
      {
        key: "previous-1-month",
        amount: 1,
        unit: "month",
        type: "relative"
      },
      {
        key: "previous-3-months",
        amount: 3,
        unit: "month",
        type: "relative"
      },
      {
        key: "previous-6-months",
        amount: 6,
        unit: "month",
        type: "relative"
      },
      {
        key: "previous-1-year",
        amount: 1,
        unit: "year",
        type: "relative"
      }
    ]}
    isValidRange={range => {
      if (range.type === "absolute") {
        const [
          startDateWithoutTime
        ] = range.startDate.split("T");
        const [
          endDateWithoutTime
        ] = range.endDate.split("T");
        if (
          !startDateWithoutTime ||
          !endDateWithoutTime
        ) {
          return {
            valid: false,
            errorMessage:
              "The selected date range is incomplete. Select a start and end date for the date range."
          };
        }
        if (new Date(range.startDate) - new Date(range.endDate) > 0) {
          return {
            valid: false,
            errorMessage:
              "The selected date range is invalid. The start date must be before the end date."
          };
        }
      }
      return { valid: true };
    }}
    i18nStrings={{
      todayAriaLabel: "Today",
      nextMonthAriaLabel: "Next month",
      previousMonthAriaLabel: "Previous month",
      customRelativeRangeDurationLabel: "Duration",
      customRelativeRangeDurationPlaceholder: "Enter duration",
      customRelativeRangeOptionLabel: "Custom range",
      customRelativeRangeOptionDescription:  "Set a custom range in the past",
      customRelativeRangeUnitLabel: "Unit of time",
      formatRelativeRange: e => {
        const n =
          1 === e.amount ? e.unit : `${e.unit}s`;
        return `Last ${e.amount} ${n}`;
      },
      formatUnit: (e, n) => (1 === n ? e : `${e}s`),
      // dateTimeConstraintText: "For date, use YYYY/MM/DD.",
      relativeModeTitle: "Relative range",
      absoluteModeTitle: "Absolute range",
      relativeRangeSelectionHeading: "Choose a range",
      startDateLabel: "Start date",
      endDateLabel: "End date",
      startTimeLabel: "Start time",
      endTimeLabel: "End time",
      // clearButtonLabel: "Clear and dismiss",
      cancelButtonLabel: "Cancel",
      applyButtonLabel: "Apply"
    }}
    dateOnly
    placeholder="Filter by a date and time range"
  />
  );

  const failFlash = (
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
    navigation={<MenuSideNavigation/>}
    content={
      <ContentLayout
        header={
          <Header
            variant="h1"
            description="Global Statsのグラフ描画ツール"
            actions={
              <FormField
                label="API Key"
                errorText={selectedKey ? "" : "No key selected"}
              >
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
              </FormField>
            }
          >
            Stats Viewer
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Container>
            <Form
              actions={
                <Button 
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!selectedKey || !startDate}
                  loading={isLoading}
                >
                  Fetch & Draw
                </Button>
              }
              // header={<Header variant="h2">Fetch data</Header>}
            >
              <FormField label="Date range">
                <Grid gridDefinition={[{ colspan: 0 }, { colspan: 7 }]}>
                  <Select
                    selectedOption={aggregation}
                    onChange={event => setAggrigation(event.detail.selectedOption)}
                    options={[
                      { label: "Aggregated by day", value: "day" },
                      { label: "Aggregated by week", value: "week" },
                      { label: "Aggregated by month", value: "month" }
                    ]}
                  />
                  {customDataRangePicker}
                </Grid>
              </FormField>
            </Form>
          </Container>
          {fetchFailed && failFlash } 
          { 
            dataset[0].data.length > 0 &&
            <Container
              header={
                <Header variant="h2">
                  Global Stats
                </Header>
              }
            > 
              <LineChart
                series={dataset}
                visibleSeries={visibleData}
                // xDomain={[
                //   new Date("2023-01-01"),
                //   new Date("2023-02-10")
                // ]}
                // yDomain={[0, 20]}
                i18nStrings={{
                  // filterLabel: "Filter displayed data",
                  filterPlaceholder: "Filter events",
                  filterSelectedAriaLabel: "selected",
                  detailPopoverDismissAriaLabel: "Dismiss",
                  legendAriaLabel: "Legend",
                  chartAriaRoleDescription: "line chart",
                  xTickFormatter: e =>
                    e
                      .toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        // hour: "numeric",
                        // minute: "numeric",
                        // hour12: !1
                      })
                      .split(",")
                      .join("\n"),
                  yTickFormatter: function l(e) {
                    return Math.abs(e) >= 1e9
                      ? (e / 1e9).toFixed(1).replace(/\.0$/, "") +
                          "G"
                      : Math.abs(e) >= 1e6
                      ? (e / 1e6).toFixed(1).replace(/\.0$/, "") +
                        "M"
                      : Math.abs(e) >= 1e3
                      ? (e / 1e3).toFixed(1).replace(/\.0$/, "") +
                        "K"
                      : e.toFixed(2);
                  }
                }}
                ariaLabel="Multiple data series line chart"
                errorText="Error loading data."
                height={300}
                loadingText="Loading chart"
                recoveryText="Retry"
                xScaleType="time"
                xTitle="Time"
                // yTitle="Global Stats"
                onFilterChange={({detail}) => setVisibleData(detail.visibleSeries)}
                additionalFilters={
                  <div style={{position: "relative", top: 4}}>
                    <SpaceBetween size="xs" direction="horizontal">
                      <Button
                        onClick={() => setVisibleData(dataset)}
                      >
                        Show all
                      </Button>
                      <Button
                        onClick={() => setVisibleData([])}
                      >
                        Hide all
                      </Button>
                    </SpaceBetween>
                  </div>
                }
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No data available</b>
                    <Box variant="p" color="inherit">
                      There is no data available
                    </Box>
                  </Box>
                }
                noMatch={
                  <Box textAlign="center" color="inherit">
                    <b>No matching data</b>
                    <Box variant="p" color="inherit">
                      There is no matching data to display
                    </Box>
                    <Button
                      onClick={() => setVisibleData(dataset)}
                    >
                      Show all
                    </Button>
                  </Box>
                }
              />
            </Container>
          }
        </SpaceBetween>
      </ContentLayout>
    }
  />
  );
}