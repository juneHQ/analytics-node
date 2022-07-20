A Node.js SDK client for [June](https://june.so), based on [analytics-node by Segment](https://github.com/segmentio/analytics-node).

Analytics helps you measure your users, product, and business. It unlocks insights into your app's funnel, core business metrics, and whether you have product-market fit.

## How to get started

```bash
$ npm install @june-so/analytics-node
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
