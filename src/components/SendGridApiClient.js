import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";

import ace from "ace-builds/src-noconflict/ace";
import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/worker-json";
import "ace-builds/css/ace.css";
import "ace-builds/css/theme/dawn.css";
import "ace-builds/css/theme/tomorrow_night_bright.css";

ace.config.set("useStrictCSP", true);
ace.config.set("loadWorkerFromBlob", false);

import { Amplify, API } from "aws-amplify";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

import {
  AppLayout,
  Autosuggest,
  Badge,
  CodeEditor,
  Container,
  ContentLayout,
  Flashbar,
  Grid,
  Header,
  Input,
  SpaceBetween,
  Tabs,
} from "@cloudscape-design/components";

import ResponseContainer from "./ResponseContainer";
import DebugContainer from "./DebugContainer";
import RequestForm from "./RequestForm";
import ApiSideNavigation from "./ApiSideNavigation";
import { apiSearchItemsArray } from "../generate-metadata"
import { ApiKeyContext } from "./ApiKeyProvider";

export default function SendGridApiClient() {

  const api = useLoaderData();
  const { apiKey, setApiKey } = useContext(ApiKeyContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [viewApIkeyModal, setViewApIkeyModal] = useState(false);
  const [preferences, setPreferences] = React.useState(undefined);
  const [request, setRequest] = useState({
    urlInput: "",
    urlEncoded: "",
    method: { value: "GET" },
    headers: [
      { name: "Authorization", value: `Bearer ${apiKey}`, included: true, canEditKey: false, canDelete: false },
      { name: "Content-Type", value: "application/json", included: true, canEditKey: false, canDelete: false }
    ],
    queryParams: [],
    pathParam: [],
    bodyInput: "",
    body: null,
    curl: "",
    isUrlValid: true,
    isBodyValid: true
  });
  const [response, setResponse] = useState();
  const [fetchFailed, setFetchFailed] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("header");

  let badgeColor = null;
  switch (request.method.value) {
    case 'GET':
      badgeColor = {'color': 'green'};
      break;
    case 'POST':
      badgeColor = {'color': 'blue'};
      break;
    case 'DELETE':
      badgeColor = {'color': 'red'}
      break;
    default:
      badgeColor = {};
  }
  
  useEffect(() => {
    let body = {};
    if ('requestBody' in api && 'content' in api.requestBody && "application/json" in api.requestBody.content) {
      if ('example' in api.requestBody.content["application/json"]) {
        body = api.requestBody.content["application/json"]["example"]
      } else if ('example' in api.requestBody.content["application/json"]["schema"]) {
        if ('schema' in api.requestBody.content["application/json"]) {
          body = api.requestBody.content["application/json"]["schema"]["example"]
        }
      }  
    }
    const queries = [];
    const pathParam = [];
    const headers = [
      { name: "Authorization", value: `Bearer ${apiKey}`, included: true, canEditKey: false, canDelete: false },
      { name: "Content-Type", value: "application/json", included: true, canEditKey: false, canDelete: false }    
    ];
    if ('parameters' in api) {
      api.parameters.forEach((param) => {
        if (param.in === 'query') {
          queries.push({
            name: param.name,
            value: 'example' in param ? param.example : "",
            included: ('required' in param && param.required),
            canEditKey: false,
            canDelete: false,
            description: 'description' in param ? param.description : null
          });
        } else if (param.in === 'header') {
          if (param.name !== 'Authorization') {
            headers.push({
              name: param.name,
              value: 'example' in param ? param.example : "",
              included: ('required' in param && param.required),
              canEditKey: false,
              canDelete: false,
              description: 'description' in param ? param.description : null
            });  
          }
        }
      })
    }
  
    const hasPathParam = api.path.match(/{(.*?)}/);
    if (hasPathParam) {
      pathParam.push({
        name: hasPathParam[1],
        value: ""
      });
    }

    setRequest((prevRequest) => ({
      ...prevRequest,
      urlInput: api.path,
      method: { value: api.method },
      headers: headers,
      queryParams: queries,
      pathParam: pathParam,
      bodyInput: JSON.stringify(body, null, 2),
    }));
    setActiveTab("header");

  }, [location.pathname]);

  useEffect(() => {
    const newHeaders = request.headers;
    if (request.headers[0].name == "Authorization") {
      newHeaders[0] = { 
        name: "Authorization", 
        value: `Bearer ${apiKey}`, 
        included: true, 
        canEditKey: false, 
        canDelete: false 
      }
    }
    handleRequestChange("headers", newHeaders);
  }, [apiKey]);

  useEffect(() => {
    try {
      const oldUrl = new URL(request.urlInput);
      const searchParams = new URLSearchParams({});
      request.queryParams.forEach((queryObj) => {
        if (
          queryObj.included &&
          queryObj.name.length > 0 &&
          queryObj.value.length > 0
        ) {
          searchParams.set(queryObj.name, queryObj.value);
        }
      });
      oldUrl.search = searchParams;
      let replacedPath = oldUrl.pathname;
      if (request.pathParam.length > 0) {
        request.pathParam.map((path) => {
          replacedPath = replacedPath.replace(`%7B${path.name}%7D`, path.value)
        });
      }  
      const newUrl = new URL(`${oldUrl.origin}${replacedPath}`);
      newUrl.search = searchParams;

      setRequest((prevRequest) => ({
        ...prevRequest,
        urlInput: decodeURIComponent(oldUrl),
        urlEncoded: newUrl,
        isUrlValid: true
      }));
    } catch {
      setRequest((prevRequest) => ({
        ...prevRequest,
        isUrlValid: false
      }));
    }
  }, [request.urlInput, request.queryParams, request.pathParam]);

  useEffect(() => {
    if (request.method.value == "GET" || request.method.value == "DELETE") {
      handleRequestChange("bodyInput", "");
      handleRequestChange("isBodyValid", true);
    }
  }, [request.method]);

  useEffect(() => {
    let curl = `curl -i --request ${request.method.value} \\\n--url ${request.urlEncoded} \\\n`;
    for (const header of request.headers) {
      if (header.included) {
        curl += `--header "${header.name}: ${header.value}" \\\n`
      }
    }
    if (request.bodyInput !== "") {
      curl += `--data '${request.bodyInput}'` 
    } else {
      curl = curl.trim().slice(0,-1);
    }
    handleRequestChange("curl", curl);
  }, [request.urlEncoded, request.headers, request.queryParams, request.pathParam, request.body, apiKey]);

  useEffect(() => {
    if (request.bodyInput !== "") {
      try {
        const parsed = JSON.parse(request.bodyInput);
        handleRequestChange("body", parsed);
        handleRequestChange("isBodyValid", true);
      } catch (e) {
        handleRequestChange("isBodyValid", false);
      }  
    } else {
      handleRequestChange("body", null);
      handleRequestChange("isBodyValid", true);
    }
  }, [request.bodyInput]);

  const handleSelect = ({detail}) => {
    const selected = apiSearchItemsArray.find(obj => obj.value === detail.value);
    navigate(selected.docPath)
  };

  const handleRequestChange = (key, value) => {
    setRequest((prevRequest) => ({ ...prevRequest, [key]: value }));
  };

  const handleBodyChange = (event) => {
    handleRequestChange("bodyInput", event.detail.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const headerObject = request.headers.reduce((obj, item) => {
        if (item.included) {
          obj[item.name] = item.value;
        }
        return obj;
      }, {});
      const body = {
        resource: request.urlEncoded,
        options: {
          method: request.method.value,
          headers: headerObject,
          body: request.body === null ? null : JSON.stringify(request.body)  
        }
      };
      const apiName = 'httpClient';
      const path = '/apicall';
      const myInit = {
        body: body,
        headers: {}
      };
      const res = await API.post(apiName, path, myInit);
      const ok = res.ok;
      const status = res.status;
      const statusText = res.statusText;
      const responseHeaders = res.headers;
      const contentType = res.contentType;
      const responseBody = res.body;
      setResponse({
        ok: ok,
        status: status,
        statusText: statusText,
        headers: responseHeaders,
        contentType: contentType,
        body: responseBody
      });
    } catch (error) {
      setResponse(null);
      setFetchFailed(error.message);
    }
    setIsLoading(false);
  };

  const handleViewApiKeyMordal = () => {
    setViewApIkeyModal(true);
  }

  const copyToClipboard = async (text) => {
    try {
      const json = JSON.parse(text);
      await global.navigator.clipboard.writeText(JSON.stringify(json, null, 4));
    } catch (e) {
      await global.navigator.clipboard.writeText(text);
    }
  };

  const FetchFailFlash = (
    <Flashbar
      items={[{
      header: "Fetch API execution failed",
      type: "error",
      content: fetchFailed,
      dismissible: true,
      onDismiss: () => setFetchFailed(),
      id: "fetch_failed"
      }]}
    />
  );

  const ApiHeader = () => {
    return (
      <Container
        header={
            <Header
              variant="h2"
              description={api.description}
            >
              {api.summary}
            </Header>
        }
      >
        <Grid gridDefinition={[{ colspan: 0 }, { colspan: 9 }]}>
          <div style={{position: "relative", top: 6}}>
            <Badge {...badgeColor}>
              <div style={{fontSize: 18}}>
                {request.method.value}
              </div>
            </Badge>
          </div>
          <Input
            type="url"
            value={request.urlInput}
            readOnly
          />
        </Grid>
      </Container>
    );
  }

  const apiTryItOut = (
    <SpaceBetween size="xs">
      <ApiHeader/>
      <SpaceBetween size="l">
        <RequestForm
          api={api}
          request={request}
          activeTab={activeTab}
          isLoading={isLoading}
          onSetActiveTab={(value) => setActiveTab(value)}
          onRequestChange={handleRequestChange}
          onBodyChange={handleBodyChange}
          onSubmitRequest={handleSubmit}
          onCopy={() => copyToClipboard(request.curl)}
        />
        {response && 
          <ResponseContainer 
            response={response}
            onCopy={() => copyToClipboard(response.body)}
            handleResponseDismiss={() => setResponse()}
          />
        }
        {fetchFailed && FetchFailFlash} 
        {process.env.ENV === "DEV" && <DebugContainer request={request} api={api}/>}
      </SpaceBetween>
    </SpaceBetween>
  );

  const apiSpecification = (
    <SpaceBetween size="s">
      <ApiHeader/>
      <CodeEditor
        ace={ace}
        language="json"
        value={JSON.stringify(api, null, 4)}
        themes={{ light: ["dawn"], dark: ["tomorrow_night_bright"] }}
        editorContentHeight={2000}
        // onEditorContentResize={({detail}) => setEditorHeight(detail.height)}
        preferences={preferences}
        onPreferencesChange={(e) => setPreferences(e.detail)}
        // onDelayedChange={props.onBodyChange}
        i18nStrings={{
          editorGroupAriaLabel: "Code editor",
          statusBarGroupAriaLabel: "Status bar",
          cursorPosition: (row, column) => `Ln ${row}, Col ${column}`,
          errorsTab: "Errors",
          warningsTab: "Warnings",
          preferencesButtonAriaLabel: "Preferences",
          paneCloseButtonAriaLabel: "Close",
          preferencesModalHeader: "Preferences",
          preferencesModalCancel: "Cancel",
          preferencesModalConfirm: "Confirm",
          preferencesModalWrapLines: "Wrap lines",
          preferencesModalTheme: "Theme",
          preferencesModalLightThemes: "Light themes",
          preferencesModalDarkThemes: "Dark themes"
        }}
      />
    </SpaceBetween>
  );

  return (
    <AppLayout
      toolsHide={true}
      navigation={<ApiSideNavigation onViewApiKeyMordal={handleViewApiKeyMordal} />}
      content={
        <ContentLayout
          disableOverlap
          header={
            <SpaceBetween size="xs">
              <Header
                variant="h1"
                description="SendGrid Web APIのエンドポイントの検索とリクエストツール"
              >
                SendGrid API Client
              </Header>
              <Autosuggest
                onChange={({ detail }) => setSearchText(detail.value)}
                onSelect={handleSelect}
                value={searchText}
                options={apiSearchItemsArray}
                enteredTextLabel={(value) => `Use: "${value}"`}
                ariaLabel="Autosuggest example with features"
                placeholder="Search API by title, url, category, description"
                empty="No matches found"
              />
            </SpaceBetween>
          }
        >
          <Tabs
            tabs={[
              {
                label: "Try it out",
                id: "try-it-out",
                content: apiTryItOut
              },
              {
                label: "Open API Specification",
                id: "open-api-sec",
                content: apiSpecification
              }
            ]}
          />
        </ContentLayout>
      }
    />
  );
}