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
npm run fullIndex
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
