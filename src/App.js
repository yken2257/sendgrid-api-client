import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import {
  AppLayout,
  Autosuggest,
  ContentLayout,
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
  const [request, setRequest] = useState({
    urlInput: "https://httpstat.us/200",
    urlEncoded: "https://httpstat.us/200",
    method: { value: "POST" },
    headers: [
      { name: "Authorization", value: "Bearer API_KEY", included: true },
      { name: "Content-Type", value: "application/json", included: true }
    ],
    queryParams: [
      { name: "q", value: "ハロー", included: true },
      { name: "page", value: "1", included: true }
    ],
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
      if ('requestBody' in api) {
        if ('content' in api.requestBody) {
          if ("application/json" in api.requestBody.content) {
            if ('example' in api.requestBody.content["application/json"]) {
              body = api.requestBody.content["application/json"]["example"]
            } else if ('example' in api.requestBody.content["application/json"]["schema"]) {
              if ('schema' in api.requestBody.content["application/json"]) {
                body = api.requestBody.content["application/json"]["schema"]["example"]
              }
            }  
          }  
        }
      }
      setRequest((prevRequest) => ({
        ...prevRequest,
        urlInput: api.path,
        method: {value: api.method},
        queryParams: [],
        bodyInput: JSON.stringify(body, null, 2)
      }));
    }
  }, [location.pathname]);

  useEffect(() => {
    try {
      const oldUrl = new URL(request.urlInput);
      const newUrl = new URL(`${oldUrl.origin}${oldUrl.pathname}`);
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
      newUrl.search = searchParams;
      setRequest((prevRequest) => ({
        ...prevRequest,
        urlInput: decodeURIComponent(newUrl),
        urlEncoded: newUrl,
        isUrlValid: true
      }));
    } catch {
      setRequest((prevRequest) => ({
        ...prevRequest,
        isUrlValid: false
      }));
    }
  }, [request.urlInput, request.queryParams]);

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
      exact path={api.docPath} 
      element={
        <SpaceBetween size="l">
          <RequestForm
            api={api}
            request={request}
            onRequestChange={handlerequestChange}
            onSubmitRequest={handleSubmit}
          />
            {response && <ResponseContainer response={response} />}
          <DebugContainer request={request} />
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
            {ApiContent}
            <Route exact path="/custom" element={CustomRequestContent} />
          </Routes>
        </ContentLayout>
      }
    />
  );
}
