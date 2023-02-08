import SwaggerParser from "@apidevtools/swagger-parser";
import sendgrid from "./sendgrid-oai-v3.json"

const parsed = await SwaggerParser.validate(sendgrid, {
  parse: {
    json: false
  },
  dereference: {
    circular: false
  },
  validate: {
    spec: false
  }
});

const api = parsed.paths;

export const apiDetailArray = [];
for (const path in api) {
  for (const method in api[path]) {
    if (method !== "parameters") {
      apiDetailArray.push({ 
        ...api[path][method],
        description: api[path][method]["description"].split("\n")[0],
        path: `https://api.sendgrid.com/v3${path}`, 
        method: method.toUpperCase(), 
        docPath: `${api[path][method]["operationId"]}`,
         });  
    }
  }
}

const navBaseArray = apiDetailArray.map(
  obj => ({ 
      type: "link",
      text: obj.summary,
      href: `#/api/v3/${obj.operationId}`,
      section: obj.tags[0]
    })
);

export const navigationArray = navBaseArray.reduce((acc, curr) => {
  const sectionExists = acc.find(section => section.text === curr.section);
  if (sectionExists) {
    sectionExists.items.push({
      type: "link",
      text: curr.text,
      href: curr.href
    });
  } else {
    acc.push({
      type: "expandable-link-group",
      text: curr.section,
      defaultExpanded: false,
      items: [
        {
          type: "link",
          text: curr.text,
          href: curr.href
        }
      ]
    });
  }
  return acc;
}, []);

export const apiSearchItemsArray = apiDetailArray.map(
  obj => ({ 
    value: obj.summary,
    description: obj.description.split("\n")[0],
    labelTag: `${obj.method.toUpperCase()} ${obj.path}`,
    tags: obj.tags,
    docPath: `/api/v3/${obj.operationId}`
  })
);

apiSearchItemsArray.unshift({
    value: "Custom",
    iconName: "share",
    description: "Custom HTTP Request",
    docPath: "/api/custom"
});
