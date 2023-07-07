import { AxiosInstance, AxiosRequestConfig } from "axios";

export type AnalyticsOptions = {
  flushAt?: number;
  flushInterval?: number;
  enable?: boolean;
  timeout?: number | string;
  flushed?: boolean;
  errorHandler?: (err: Error) => void;
  axiosInstance?: AxiosInstance;
  axiosConfig?: AxiosRequestConfig;
};

export type BaseAnalyticsOptions = AnalyticsOptions & {
  host: string;
  path: string;
};

export type AnyObject = { [key: string]: unknown };

export type Identity =
  | {
      userId: string | number;
    }
  | {
      anonymousId: string | number;
    };

export type Message = Identity & {
  type: string;
  context: {
    library: {
      name: string;
      version: string;
    };
    [key: string]: unknown;
  };
  _metadata: {
    nodeVersion: string;
    [key: string]: unknown;
  };
  timestamp?: Date;
  messageId?: string;
};

export interface Data {
  batch: Message[];
  timestamp: Date;
  sentAt: Date;
}

export interface Integrations {
  [integration_name: string]: IntegrationValue;
}

export type IntegrationValue = boolean | { [integration_key: string]: unknown };
