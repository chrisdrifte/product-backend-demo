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
2. A cli script allows us to trigger a full index
3. Product ids are added to a queue
4. Data is fetched for each product id, and emitted to a message broker
5. Services which consume product data subscribe the the events and update their
   copies of product data

There are three initial services:

**Product Data Service**

Stores all product data and provides an API endpoint to retrieve data by id

**Index A**

Stores transformed product data and provides an API endpoint to search data

**Index B**

Stores transformed product data and provides an API endpoint to search data
