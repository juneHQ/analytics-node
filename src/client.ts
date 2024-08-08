import { Analytics as BaseAnalytics } from "@segment/analytics-node";
import {
  Callback,
  GroupParams,
  IdentifyParams,
  PageParams,
  Settings,
  TrackParams,
} from "./types";

export class Analytics {
  private readonly nodeAnalytics: BaseAnalytics;

  constructor(writeKey: string, opts?: Settings & { host?: string }) {
    if (!writeKey?.length) {
      throw new Error("You must pass your June workspace's write key.");
    }

    const options = opts ?? {};

    const mergedOptions = {
      ...options,
      writeKey,
      host: options.host || "https://api.june.so",
      path: "/sdk/batch",
    };

    this.nodeAnalytics = new BaseAnalytics(mergedOptions);
  }

  identify(params: IdentifyParams, callback?: Callback): void {
    this.nodeAnalytics.identify(params, callback);
  }

  track(params: TrackParams, callback?: Callback): void {
    this.nodeAnalytics.track(params, callback);
  }

  page(params: PageParams, callback?: Callback): void {
    this.nodeAnalytics.page(params, callback);
  }

  screen(params: PageParams, callback?: Callback): void {
    this.nodeAnalytics.screen(params, callback);
  }

  group(params: GroupParams, callback?: Callback): void {
    this.nodeAnalytics.group(params, callback);
  }

  async closeAndFlush(timeout?: number): Promise<void> {
    return this.nodeAnalytics.closeAndFlush({ timeout });
  }
}
