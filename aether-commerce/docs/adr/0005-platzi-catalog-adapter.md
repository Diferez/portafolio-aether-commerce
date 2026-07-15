# ADR 0005: Platzi Catalog Adapter

## Status

Accepted.

## Decision

Platzi Fake Store API is consumed only through the Catalog Adapter.

## Consequences

The browser and internal commerce logic depend on Aether contracts, not Platzi
response shapes. Invalid images and unstable fields are normalized.
