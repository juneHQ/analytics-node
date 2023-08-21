import { FetchHTTPClient } from "@segment/analytics-node";
import { Analytics } from "../client";

const extractData = (fetchAction: jest.Mock, i = 0) => {
  const [url, request] = fetchAction.mock.calls[i];
  const { body } = request as any;
  const { batch } = JSON.parse(body);
  return { url, batch };
};

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
      "You must pass your June workspace's write key.",
    );
  });

  it("should not be able to create a new instance with object writeKey", () => {
    // given
    // then
    expect(() => new Analytics({} as any)).toThrowError(
      "You must pass your June workspace's write key.",
    );
  });

  it("should track events and send it to api.june.so/sdk/batch", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 200 });

    const analytics = new Analytics("writeKey", {
      maxEventsInBatch: 1,
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.track({
      userId: "userId",
      event: "event",
      properties: {
        property: "property",
      },
    });

    await analytics.closeAndFlush();

    // then
    expect(fetchAction).toHaveBeenCalledTimes(1);

    const { url, batch } = extractData(fetchAction);

    expect(url).toBe("https://api.june.so/sdk/batch");
    expect(batch).toHaveLength(1);
    expect(batch[0]).toMatchObject({
      type: "track",
      userId: "userId",
      properties: {
        property: "property",
      },
    });
  });

  it("should identify and send it to api.june.so/sdk/batch", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 200 });

    const analytics = new Analytics("writeKey", {
      maxEventsInBatch: 1,
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.identify({
      userId: "userId",
      traits: {
        property: "property",
      },
    });

    await analytics.closeAndFlush();

    // then
    expect(fetchAction).toHaveBeenCalledTimes(1);

    const { url, batch } = extractData(fetchAction);

    expect(url).toBe("https://api.june.so/sdk/batch");
    expect(batch).toHaveLength(1);
    expect(batch[0]).toMatchObject({
      type: "identify",
      userId: "userId",
      traits: {
        property: "property",
      },
    });
  });

  it("should group and send it to api.june.so/sdk/batch", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 200 });

    const analytics = new Analytics("writeKey", {
      maxEventsInBatch: 1,
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.group({
      groupId: "groupId",
      userId: "userId",
      traits: {
        property: "property",
      },
    });

    await analytics.closeAndFlush();

    // then
    expect(fetchAction).toHaveBeenCalledTimes(1);

    const { url, batch } = extractData(fetchAction);

    expect(url).toBe("https://api.june.so/sdk/batch");
    expect(batch).toHaveLength(1);
    expect(batch[0]).toMatchObject({
      type: "group",
      groupId: "groupId",
      userId: "userId",
      traits: {
        property: "property",
      },
    });
  });

  it("should flush events and send it to api.june.so/sdk/batch", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 200 });

    const analytics = new Analytics("writeKey", {
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    new Array(10).fill(0).forEach(() =>
      analytics.track({
        userId: "userId",
        event: "event",
        properties: {
          property: "property",
        },
      }),
    );
    await analytics.closeAndFlush();

    // then
    expect(fetchAction).toHaveBeenCalledTimes(1);
    const { url, batch } = extractData(fetchAction);
    expect(url).toBe("https://api.june.so/sdk/batch");
    expect(batch).toHaveLength(10);
  });

  it("should send different event names", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 200 });

    const analytics = new Analytics("writeKey", {
      httpClient: new FetchHTTPClient(fetchAction),
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

    await analytics.closeAndFlush();

    // then
    expect(fetchAction).toHaveBeenCalledTimes(1);
    const { url, batch } = extractData(fetchAction);

    expect(url).toBe("https://api.june.so/sdk/batch");
    expect(batch).toHaveLength(2);

    expect(batch[0]).toMatchObject({
      type: "track",
      userId: "userId",
      event: "event",
      properties: {
        property: "property",
      },
    });

    expect(batch[1]).toMatchObject({
      type: "track",
      userId: "userId",
      event: "event2",
      properties: {
        property: "property",
      },
    });
  });

  it("should retry failed calls", async () => {
    // given
    const fetchAction = jest
      .fn()
      .mockResolvedValueOnce({ status: 500 })
      .mockResolvedValueOnce({ status: 200 });

    const analytics = new Analytics("writeKey", {
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.track({
      userId: "userId",
      event: "event",
      properties: {
        property: "property",
      },
    });

    await analytics.closeAndFlush();

    // then
    expect(fetchAction).toHaveBeenCalledTimes(2);
    const { url, batch } = extractData(fetchAction, 1);

    expect(url).toBe("https://api.june.so/sdk/batch");
    expect(batch).toHaveLength(1);
    expect(batch[0]).toMatchObject({
      type: "track",
      userId: "userId",
      properties: {
        property: "property",
      },
    });
  });

  it("should retry to maxRetries if not successful", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 500 });

    const analytics = new Analytics("writeKey", {
      maxRetries: 3,
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.track({
      userId: "userId",
      event: "event",
      properties: {
        property: "property",
      },
    });

    await analytics.closeAndFlush();

    // then
    expect(fetchAction).toHaveBeenCalledTimes(4);
    const { url, batch } = extractData(fetchAction, 3);

    expect(url).toBe("https://api.june.so/sdk/batch");
    expect(batch).toHaveLength(1);
    expect(batch[0]).toMatchObject({
      type: "track",
      userId: "userId",
      properties: {
        property: "property",
      },
    });
  });

  it("should call callback function on success", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 200 });
    const callback = jest.fn();

    const analytics = new Analytics("writeKey", {
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.track(
      {
        userId: "userId",
        event: "event",
        properties: {
          property: "property",
        },
      },
      callback,
    );

    await analytics.closeAndFlush();

    // then
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        attempts: 1,
        event: expect.objectContaining({
          userId: "userId",
          event: "event",
          type: "track",
        }),
      }),
    );
  });

  it("should call callback function on failure", async () => {
    // given
    const fetchAction = jest.fn().mockResolvedValue({ status: 500 });
    const callback = jest.fn();

    const analytics = new Analytics("writeKey", {
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.track(
      {
        userId: "userId",
        event: "event",
        properties: {
          property: "property",
        },
      },
      callback,
    );

    await analytics.closeAndFlush();

    // then
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.any(Error), expect.anything());
  });

  it("should handle client throwing error", async () => {
    // given
    const error = new Error("some random failure");
    const fetchAction = jest.fn().mockRejectedValue(error);
    const callback = jest.fn();

    const analytics = new Analytics("writeKey", {
      httpClient: new FetchHTTPClient(fetchAction),
    });

    // when
    analytics.track(
      {
        userId: "userId",
        event: "event",
        properties: {
          property: "property",
        },
      },
      callback,
    );

    await analytics.closeAndFlush();

    // then
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(error, expect.anything());
  });
});
