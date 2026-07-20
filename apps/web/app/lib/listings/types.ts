export type RequestContext = {
  query: Record<string, string | string[]>;
  headers: Record<string, string>;
  meta: Record<string, string>; // parsed asd_s_meta cookie fields (session, fp, landing_url, dom_current, dom_referer)
  session: string;
  fp: string;
};

export type ParamSource = "query" | "header" | "cookie";

export type HardcodeParam = {
  type: "hardcode";
  key: string;
  value: string;
};

export type PassthroughParam = {
  type: "passthrough";
  key: string;
  source: ParamSource;
  sourceKey: string;
  fallback?: { source: ParamSource; sourceKey: string };
  default?: string;
  required?: boolean;
};

export type MappingParam = {
  type: "mapping";
  key: string;
  source: ParamSource;
  sourceKey: string;
  values: Record<string, string | number>;
  // falls back to values["unknown"] if no match found
};

export type ComputedParam = {
  type: "computed";
  key: string;
  compute: (ctx: RequestContext) => string | number | undefined;
};

export type ProviderParam = HardcodeParam | PassthroughParam | MappingParam | ComputedParam;

export type ProviderDef = {
  id: string;
  name: string;
  host: string;
  path: string;
  method: "GET" | "POST" | "STATIC";
  params: ProviderParam[];
};
