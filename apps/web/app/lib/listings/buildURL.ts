import { ProviderDef, RequestContext, PassthroughParam, MappingParam } from "./types";

const getFromSource = (
  ctx: RequestContext,
  source: PassthroughParam["source"],
  sourceKey: string,
): string | string[] | undefined => {
  switch (source) {
    case "query":
      return ctx.query[sourceKey];
    case "header":
      return ctx.headers[sourceKey.toLowerCase()];
    case "cookie":
      return ctx.meta[sourceKey];
  }
};

const resolvePassthrough = (
  param: PassthroughParam,
  ctx: RequestContext,
): string | string[] | undefined => {
  const value = getFromSource(ctx, param.source, param.sourceKey);
  if (value !== undefined && value !== "") return value;

  if (param.fallback) {
    const fallbackValue = getFromSource(ctx, param.fallback.source, param.fallback.sourceKey);
    if (fallbackValue !== undefined && fallbackValue !== "") return fallbackValue;
  }

  return param.default;
};

const resolveMapping = (
  param: MappingParam,
  ctx: RequestContext,
): string | undefined => {
  const raw = getFromSource(ctx, param.source, param.sourceKey);
  const key = Array.isArray(raw) ? raw[0] : raw;
  if (key && key in param.values) return String(param.values[key]);
  if ("unknown" in param.values) return String(param.values["unknown"]);
  return undefined;
};

const setParam = (url: URL, key: string, value: string | string[]): void => {
  if (Array.isArray(value)) {
    value.forEach((v) => url.searchParams.append(key, v));
  } else {
    url.searchParams.set(key, value);
  }
};

export const buildURL = (provider: ProviderDef, ctx: RequestContext): URL => {
  const url = new URL(provider.path, provider.host);

  for (const param of provider.params) {
    switch (param.type) {
      case "hardcode": {
        url.searchParams.set(param.key, param.value);
        break;
      }
      case "passthrough": {
        const value = resolvePassthrough(param, ctx);
        if (value !== undefined && value !== "") {
          setParam(url, param.key, value);
        } else if (param.required) {
          throw new Error(
            `Provider "${provider.name}" missing required param "${param.key}" (sourceKey: "${param.sourceKey}")`,
          );
        }
        break;
      }
      case "mapping": {
        const value = resolveMapping(param, ctx);
        if (value !== undefined) url.searchParams.set(param.key, value);
        break;
      }
      case "computed": {
        const value = param.compute(ctx);
        if (value !== undefined) url.searchParams.set(param.key, String(value));
        break;
      }
    }
  }

  return url;
};
