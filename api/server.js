import { createRequestHandler } from "@react-router/node";
import * as build from "../build/server/index.js";

const requestHandler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

export default async function handler(req) {
  return requestHandler(req);
}

