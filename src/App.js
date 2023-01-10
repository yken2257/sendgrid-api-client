import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import {
  AppLayout,
  Autosuggest,
  ContentLayout,
  Flashbar,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";

import ResponseContainer from "./components/ResponseContainer";
import DebugContainer from "./components/DebugContainer";
import RequestForm from "./components/RequestForm";
import CustomRequestForm from "./components/CustomRequestForm";
import Navigation from "./components/Navigation";
import { apiDetailArray, apiSearchItemsArray } from "./parseOpenApi"

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [api, setApi] = useState();
  const [request, setRequest] = useState({
    urlInput: "",
    urlEncoded: "",
    method: { value: "GET" },
    headers: [
      { name: "Authorization", value: "Bearer API_KEY", included: true, canEditKey: true, canDelete: true },
      { name: "Content-Type", value: "application/json", included: true, canEditKey: true, canDelete: true }
    ],
    queryParams: [],
    pathParam: [],
    bodyInput: '{ "hoge": "huga" }',
    body: { hoge: "huga" },
    isUrlValid: true,
    isBodyValid: true
  });
  const [response, setResponse] = useState();

  useEffect(() => {
    const regex = /\/apiv3\/([^/]+)(?:\/|$)/;
    const match = location.pathname.match(regex);
    if (match) {
      const api = apiDetailArray.find(obj => obj.operationId === match[1]);
      let body = {};
      if (api) {
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
          { name: "Authorization", value: "Bearer API_KEY", included: true, canEditKey: false, canDelete: true},
          { name: "Content-Type", value: "application/json", included: true, canEditKey: false, canDelete: true }    
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
        setApi(api);
        setRequest((prevRequest) => ({
          ...prevRequest,
          urlInput: api.path,
          method: {value: api.method},
          headers: headers,
          queryParams: queries,
          pathParam: pathParam,
          bodyInput: JSON.stringify(body, null, 2)
        }));
      }
    }
  }, [location.pathname]);

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

  const handleSelect = ({detail}) => {
    const selected = apiSearchItemsArray.find(obj => obj.value === detail.value);
    navigate(selected.docPath)
  };

  const handlerequestChange = (key, value) => {
    setRequest((prevRequest) => ({ ...prevRequest, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const headerObject = request.headers.reduce((obj, item) => {
        if (item.included) {
          obj[item.name] = item.value;
        }
        return obj;
      }, {});
      const res = await fetch(request.urlEncoded, {
        method: request.method.value,
        headers: headerObject,
        body:
          request.method.value === "GET" || request.method.value === "DELETE"
            ? null
            : JSON.stringify(request.body)
      });
      const ok = res.ok;
      const status = res.status;
      const statusText = res.statusText;
      const contentType = res.headers.get("content-type");
      const responseBody = await res.text();
      setResponse({
        ok: ok,
        status: status,
        statusText: statusText,
        contentType: contentType,
        body: responseBody
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const ApiContent = apiDetailArray.map((api) =>
    <Route 
      key={api.operationId}
      path={api.docPath} 
      element={
        <SpaceBetween size="l">
          <RequestForm
            api={api}
            request={request}
            onRequestChange={handlerequestChange}
            onSubmitRequest={handleSubmit}
          />
            {response && <ResponseContainer response={response} />}
          <DebugContainer request={request} api={api}/>
        </SpaceBetween>
      }
    />
  );

  const CustomRequestContent = (
      <SpaceBetween size="l">
        <CustomRequestForm
          request={request}
          onRequestChange={handlerequestChange}
          onSubmitRequest={handleSubmit}
        />
          {response && <ResponseContainer response={response} />}
        <DebugContainer request={request} />
      </SpaceBetween>
    );
  
  const NotFound = (
    <Flashbar
      items={[{
      header: "Not Found",
      type: "error",
      content: "Failed to load data",
      dismissible: false,
      id: "not_found"
      }]}
    />
  );

  return (
    <AppLayout
      toolsHide={false}
      navigation={<Navigation />}
      content={
        <ContentLayout
          header={
            <SpaceBetween size="xs">
              <Header
                variant="h1"
                description={
                  <>
                    This React app makes you access apis with ease.
                  </>
                }
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
                placeholder="Enter value"
                empty="No matches found"
              />
            </SpaceBetween>
          }
        >
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="custom" element={CustomRequestContent} />
            <Route path="apiv3/">
              {ApiContent}
            </Route>
            <Route path="*" element={NotFound} />
          </Routes>
        </ContentLayout>
      }
    />
  );
}
