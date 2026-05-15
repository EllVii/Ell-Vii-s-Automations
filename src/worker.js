function assetRequest(originalRequest, pathname) {
  const url = new URL(originalRequest.url);
  url.pathname = pathname;
  return new Request(url.toString(), originalRequest);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/terms") {
      return env.ASSETS.fetch(assetRequest(request, "/terms/index.html"));
    }

    if (path === "/privacy") {
      return env.ASSETS.fetch(assetRequest(request, "/privacy/index.html"));
    }

    return env.ASSETS.fetch(request);
  },
};
