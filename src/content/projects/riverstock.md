---
title: Riverstock
category: apps
year: "2026"
role: Research, data engineering, hydrology model
stack: [Python, PostgreSQL, TimescaleDB, FastAPI, SwiftUI, Raspberry Pi]
status: in-progress
statusNote: Model, ingestion, and scheduling built; API and apps next
links: []
summary: A stock-and-flow model of the Little Red River below Greers Ferry Dam that answers one question. How deep will it be at my access point, at the hour I plan to be standing in it?
order: 2
---
## What it is

Greers Ferry Dam, near Heber Springs, Arkansas, is a 96 MW peaking hydropower plant. When the Southwestern Power Administration calls for generation, a release wave travels down the Little Red River and turns wadeable shoals into water you cannot stand in. The wave reaches Cow Shoals about an hour later and Ramsey Access about eight hours later.

Today, anglers and guides piece that picture together by hand from a Corps of Engineers HTML table, a Department of Energy generation schedule, a phone recording, and USGS gauge graphs. Riverstock ingests those sources, models the wave, and will serve a per-access-point forecast.

## Scope

One river. Not a multi-river gauge browser, because three of those already exist and compete on breadth. The trout reach from the dam to Ramsey Access, 29 miles, comes first. The extended reach to Judsonia adds tributary inflow, groundwater exchange, and irrigation withdrawal, and comes second.

## What's built

- Ingestion against the modernized USGS OGC API, because the legacy water service every tutorial targets is being decommissioned.
- A three-stage model (dam release, wave routing, stage at access points) with calibration, validation, and its limits documented together.
- PostgreSQL with TimescaleDB hypertables for observations and relational tables for locations and ratings.
- Scheduled ingestion on four launchd timers, and 280 tests.

## The hard part

Being honest about what can be claimed. There are no rating curves at the ungauged access points where people actually wade, so "depth in feet" cannot be promised there on day one. And two river-mile datums are in circulation that run in opposite directions: USGS and the Corps measure miles above the mouth, anglers and signage measure miles below the dam. Mixing them silently corrupts every distance in the routing model. The schema stores one datum and derives the other.

## Safety

Generation on the Little Red is dangerous to waders. Riverstock is not a safety device. Any surface built on this model shows prediction age and uncertainty, links the official schedule and Corps data, and never presents a forecast as a statement that it is safe to enter the water.

## What's next

An HTTP API, then native iOS and Android apps, then Raspberry Pi LED displays for cabins, fly shops, and access-point kiosks. In the other direction, anglers log how the fish are biting in one gesture, and the server records what the river was doing at that instant.
