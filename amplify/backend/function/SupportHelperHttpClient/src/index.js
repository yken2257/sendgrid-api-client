/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import { default as fetch } from 'node-fetch';

export const handler = async(event) => {
    const req = JSON.parse(event.body);
    console.log("---REQUEST---");
    console.log(`URL: ${req.resource}`);
    console.log(`METHOD: ${req.options.method}`);
    console.log(`PARAMS: ${req.options.body}`);
    
    if (req.resource) {
        const res = await fetch(req.resource, req.options);
        const ok = res.ok;
        const status = res.status;
        const statusText = res.statusText;
        const contentType = res.headers.get("content-type");
        const responseBody = await res.text();
        const headers = Array.from(res.headers.entries());
        const headersObject = headers.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        
        console.log("---RESPONSE---");
        console.log(ok);
        console.log(status);
        console.log(statusText);
        console.log(contentType);
        console.log(headersObject);
        console.log(responseBody);
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST"
            },
            body: JSON.stringify(
                {
                    ok: res.ok,
                    status: status,
                    statusText: statusText,
                    body: responseBody,
                    headers: headersObject,
                    contentType: contentType
                }
            )
        };
        return response;
    } else {
        const response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST"
            },
            body: "{\"error\": \"bad request\"}",
        };
        return response;
    }
};
