import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  
  sources:[
    {
      url: "/api/openapi",
      default: true,
      title: "ZenStack API Reference",
    },{
      url: "/api/openapi/auth",
      title: "BetterAuth API Reference",
    }

  ],
  servers: [
    {
      url: process.env.BETTER_AUTH_URL,
    },
    {
      url: `${process.env.BETTER_AUTH_URL}/api/auth`,
    },
  ],
  hideModels: true,
  cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest",
  hideSearch: true,
  documentDownloadType: "json",
  hiddenClients: [
    "libcurl",
    "clj_http",
    "httpclient",
    "restsharp",
    "native",
    "http1.1",
    "asynchttp",
    "nethttp",
    "okhttp",
    "unirest",
    "xhr",
    "axios",
    "ofetch",
    "jquery",
    "okhttp",
    "native",
    "request",
    "unirest",
    "axios",
    "nsurlsession",
    "cohttp",
    "guzzle",
    "http1",
    "http2",
    "webrequest",
    "restmethod",
    "python3",
    "requests",
    "httr",
    "native",
    "httpie",
    "wget",
    "nsurlsession",
    "undici",
    "http",
  ],
  hideClientButton: true,
  layout: "classic",
});
