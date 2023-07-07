import axios from "axios";
import { Analytics } from "../client";

describe("Client", () => {
  it("should be able to create a new instance", () => {
    // given
    const analytics = new Analytics("writeKey");

    // then
    expect(analytics).toBeDefined();
  });

  it("should not be able to create a new instance without writeKey", () => {
    // given
    // then
    expect(() => new Analytics(undefined as any)).toThrowError(
      "You must pass your June project's write key."
    );
  });

  it("should not be able to create a new instance with object writeKey", () => {
    // given
    // then
    expect(() => new Analytics({} as any)).toThrowError(
      "You must pass your June project's write key."
    );
  });

  it("should track events and send it to api.june.so/sdk/batch", async () => {
    // given
    const axiosInstance = axios.create();
    axiosInstance.post = jest.fn().mockResolvedValue({ data: {} });

    const analytics = new Analytics("writeKey", {
      flushAt: 1,
      axiosInstance: axiosInstance,
    });

    // when
    analytics.track({
      userId: "userId",
      event: "event",
      properties: {
        property: "property",
      },
    });

    // then
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "https://api.june.so/sdk/batch",
      expect.objectContaining({
        batch: expect.arrayContaining([
          expect.objectContaining({
            type: "track",
            userId: "userId",
            event: "event",
            properties: {
              property: "property",
            },
          }),
        ]),
      }),
      expect.anything()
    );
  });

  it("should identify and send it to api.june.so/sdk/batch", async () => {
    // given
    const axiosInstance = axios.create();
    axiosInstance.post = jest.fn().mockResolvedValue({ data: {} });

    const analytics = new Analytics("writeKey", {
      flushAt: 1,
      axiosInstance: axiosInstance,
    });

    // when
    analytics.identify({
      userId: "userId",
      traits: {
        property: "property",
      },
    });

    // then
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "https://api.june.so/sdk/batch",
      expect.objectContaining({
        batch: expect.arrayContaining([
          expect.objectContaining({
            type: "identify",
            userId: "userId",
            traits: {
              property: "property",
            },
          }),
        ]),
      }),
      expect.anything()
    );
  });

  it("should group and send it to api.june.so/sdk/batch", async () => {
    // given
    const axiosInstance = axios.create();
    axiosInstance.post = jest.fn().mockResolvedValue({ data: {} });

    const analytics = new Analytics("writeKey", {
      flushAt: 1,
      axiosInstance: axiosInstance,
    });

    // when
    analytics.group({
      groupId: "groupId",
      userId: "userId",
      traits: {
        property: "property",
      },
    });

    // then
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "https://api.june.so/sdk/batch",
      expect.objectContaining({
        batch: expect.arrayContaining([
          expect.objectContaining({
            type: "group",
            groupId: "groupId",
            userId: "userId",
            traits: {
              property: "property",
            },
          }),
        ]),
      }),
      expect.anything()
    );
  });

  it("should flush events and send it to api.june.so/sdk/batch", async () => {
    // given
    const axiosInstance = axios.create();
    axiosInstance.post = jest.fn().mockResolvedValue({ data: {} });

    const analytics = new Analytics("writeKey", {
      flushAt: 1,
      axiosInstance: axiosInstance,
    });

    // when
    new Array(10).fill(0).forEach(() =>
      analytics.track({
        userId: "userId",
        event: "event",
        properties: {
          property: "property",
        },
      })
    );
    await new Promise((resolve, reject) => {
      analytics.flush((err, cb) => {
        if (err) {
          reject(err);
        } else {
          resolve(cb);
        }
      });
    });

    // then
    expect(axiosInstance.post).toHaveBeenCalledTimes(10);
  });

  it("should send different event names", async () => {
    // given
    const axiosInstance = axios.create();
    axiosInstance.post = jest.fn().mockResolvedValue({ data: {} });

    const analytics = new Analytics("writeKey", {
      flushAt: 1,
      axiosInstance: axiosInstance,
    });

    // when
    analytics.track({
      userId: "userId",
      event: "event",
      properties: {
        property: "property",
      },
    });
    analytics.track({
      userId: "userId",
      event: "event2",
      properties: {
        property: "property",
      },
    });

    // then
    expect(axiosInstance.post).toHaveBeenCalledTimes(2);
    expect(axiosInstance.post).toHaveBeenNthCalledWith(
      1,
      "https://api.june.so/sdk/batch",
      expect.objectContaining({
        batch: expect.arrayContaining([
          expect.objectContaining({
            type: "track",
            userId: "userId",
            event: "event",
            properties: {
              property: "property",
            },
          }),
        ]),
      }),
      expect.anything()
    );
    expect(axiosInstance.post).toHaveBeenNthCalledWith(
      2,
      "https://api.june.so/sdk/batch",
      expect.objectContaining({
        batch: expect.arrayContaining([
          expect.objectContaining({
            type: "track",
            userId: "userId",
            event: "event2",
            properties: {
              property: "property",
            },
          }),
        ]),
      }),
      expect.anything()
    );
  });
});
