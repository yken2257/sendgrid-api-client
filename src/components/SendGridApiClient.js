import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";

import {
  AppLayout,
  Autosuggest,
  ContentLayout,
  Flashbar,
  Header,
  SpaceBetween,
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
  const [activeTab, setActiveTab] = useState("header");
  
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
      const res = await fetch(process.env.FETCH_URL, {
        method: "POST",
        body: JSON.stringify(body)
      });
      const apiResponse = await res.json();
      const ok = apiResponse.ok;
      const status = apiResponse.status;
      const statusText = apiResponse.statusText;
      const responseHeaders = apiResponse.headers;
      const contentType = apiResponse.contentType;
      const responseBody = apiResponse.body;
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
  };

  const handleViewApiKeyMordal = () => {
    setViewApIkeyModal(true);
  }

  const copyToClipboard = async (text) => {
    await global.navigator.clipboard.writeText(text);
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

  const apiContent = (
    <SpaceBetween size="l">
      <RequestForm
        api={api}
        request={request}
        activeTab={activeTab}
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
        />
      }
      {fetchFailed && FetchFailFlash} 
      {process.env.ENV === "DEV" && <DebugContainer request={request} api={api}/>}
    </SpaceBetween>
  );

  return (
    <>
      <AppLayout
        toolsHide={true}
        navigation={<ApiSideNavigation onViewApiKeyMordal={handleViewApiKeyMordal} />}
        content={
          <ContentLayout
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
            {apiContent}
          </ContentLayout>
        }
      />
    </>
  );
}