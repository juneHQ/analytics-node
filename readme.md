# analytics-node [![CircleCI](https://circleci.com/gh/segmentio/analytics-node.svg?style=svg&circle-token=68654e8cd0fcd16b1f3ae9943a1d8e20e36ae6c5)](https://circleci.com/gh/segmentio/analytics-node)

A Node.js client for [June](https://june.so)

Analytics helps you measure your users, product, and business. It unlocks insights into your app's funnel, core business metrics, and whether you have product-market fit.

## How to get started

```bash
$ npm install analytics-node
```

Add the Node SDK into your product and start tracking data about your users and what they are doing. 

For example, you can capture data on any app:
```js
analytics.track({ userId: '019mr8mf4r', event: 'Order Completed', properties: { price: 99.84 }});
```

## Usage

```js
const Analytics = require('analytics-node');

const client = new Analytics('write key');

client.track({
  event: 'event name',
  userId: 'user id'
});
```

## Notes

Defining ```sentAt``` in the payload will cause the specified ```timestamp``` to be ignored

## Documentation

Documentation is available at [https://www.june.so/docs/node](https://www.june.so/docs/node).
