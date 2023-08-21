import { AnalyticsSettings, Context } from "@segment/analytics-node";
import {
  GroupParams,
  IdentifyParams,
  PageParams,
  TrackParams,
} from "@segment/analytics-node";
import { Callback } from "@segment/analytics-node/dist/types/app/dispatch-emit";

export type Settings = Omit<AnalyticsSettings, "writeKey" | "host" | "path">;
export { GroupParams, IdentifyParams, PageParams, TrackParams, Callback, Context };
