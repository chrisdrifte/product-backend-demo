# Product Backend Demo

This is a demo project to explore how we can handle product data in a composable
architecture.

## Get Started

Run the following commands in different terminals in the following order:

```shell
npm run broker
```

```shell
npm run services
```

```shell
# updates all data for all products
# triggers indexing for all indexes
npm run fullIndex

# updates description data for all products (at least one full index is required first)
# will only trigger indexing for index a
npm run descriptionIndex

# updates price data for all products (at least one full index is required first)
# will only trigger indexing for index b
npm run priceIndex
```

When indexing is triggered, product ids are added to a queue with a unique id.
The queue id can be provided manually in order to finish processing queues that
did not complete fully due to errors.

```shell
# triggers a full index with all products
QUEUE_ID=myQueue npm run fullIndex

# triggers a partial index with just the products that had errors the first time
QUEUE_ID=myQueue npm run fullIndex
```

## Architecture

The target system looks like this:

1. Product data is held in a relational database (this is a requirement from the
   legacy system)
2. A cli script allows us to trigger a full or partial index
3. The CLI script adds product ids to a persisted queue
4. The CLI script emits an UPDATE event with full or partial product data for
   each product id in the queue
5. The product data service subscribes to the UPDATE event, updating its copy
   of the product data with the new data, and an INDEX event is emitted with full
   product data
6. Indexer services subscribe to the INDEX event, updating their indexes with
   the product data they care about

There are three initial services:

**Product Data Service**

Stores all product data and provides an API endpoint to retrieve data by id

**Index A**

Stores transformed product data and provides an API endpoint to search data

**Index B**

Stores transformed product data and provides an API endpoint to search data

## System state

All state is stored in `/.kv` for convenience. In real life, data would be
distributed across different systems in the network.

## Mock clients

As this is a demo project, many clients are mocked.

| Client   | Description                                         |
| -------- | --------------------------------------------------- |
| indexA   | Mocks communication with the external index service |
| indexB   | Mocks communication with the external index service |
| fsKv     | Mocks key value storage as files in `/.kv`          |
| memDb    | Mocks relational database storage                   |
| wsBroker | Mocks message broker as a websocket relay server    |
