import AnalyticsNode from "analytics-node";
import {
  AnalyticsOptions,
  AnyObject,
  BaseAnalyticsOptions,
  Data,
  Identity,
  Integrations
} from "./types";

export class Analytics {
  private readonly nodeAnalytics: AnalyticsNode;

  constructor(writeKey: string, opts?: AnalyticsOptions) {
    if (!writeKey?.length || typeof writeKey !== "string") {
      throw new Error("You must pass your June project's write key.");
    }

    const options = opts ?? {};
    const mergedOptions: BaseAnalyticsOptions = {
      ...options,
      host: "https://api.june.so",
      path: "/sdk/batch",
    };

    this.nodeAnalytics = new AnalyticsNode(writeKey, mergedOptions);
  }

  identify(
    message: Identity & {
      traits?: AnyObject;
      timestamp?: Date;
      context?: AnyObject;
      integrations?: Integrations;
    },
    callback?: (err: Error) => void
  ): Analytics {
    this.nodeAnalytics.identify(message, callback);
    return this;
  }

  track(
    message: Identity & {
      event: string;
      properties?: AnyObject;
      timestamp?: Date;
      context?: AnyObject;
      integrations?: Integrations;
    },
    callback?: (err: Error) => void
  ): Analytics {
    this.nodeAnalytics.track(message, callback);
    return this;
  }

  page(
    message: Identity & {
      category?: string;
      name?: string;
      properties?: AnyObject;
      timestamp?: Date;
      context?: AnyObject;
      integrations?: Integrations;
      messageId?: string;
    },
    callback?: (err: Error) => void
  ): Analytics {
    this.nodeAnalytics.page(message, callback);
    return this;
  }

  screen(
    message: Identity & {
      name?: string;
      properties?: AnyObject;
      timestamp?: Date;
      context?: AnyObject;
      integrations?: Integrations;
    },
    callback?: (err: Error) => void
  ): Analytics {
    this.nodeAnalytics.screen(message, callback);
    return this;
  }

  alias(
    message: Identity & {
      previousId: string | number;
      integrations?: Integrations;
    },
    callback?: (err: Error) => void
  ): Analytics {
    this.nodeAnalytics.alias(message, callback);
    return this;
  }

  group(
    message: Identity & {
      groupId: string | number;
      traits?: AnyObject;
      context?: AnyObject;
      timestamp?: Date;
      integrations?: Integrations;
    },
    callback?: (err: Error) => void
  ): Analytics {
    this.nodeAnalytics.group(message, callback);
    return this;
  }

  flush(
    callback?: (err: Error, data: Data) => void
  ): Promise<{ batch: Array<unknown>; timestamp: string; sentAt: string }> {
    // todo: fix batch type
    return this.nodeAnalytics.flush(callback);
  }
}
