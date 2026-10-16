# Module 05 — Cypress

Four remaining Module 2 scenarios: sign in, update address, favorite a product, and filter Hand Tools. Each authenticated test creates its own account.
Their original wording is in `docs/scenarios.feature`; Cypress runs `cypress/e2e/shop.cy.js`.

```sh
npm ci
npx cypress install
npm run test:chrome
npm run test:firefox
npm run test:edge
```

All commands run headlessly. Chrome, Firefox, and Edge must be installed locally. Cypress provides automatic waiting, browser-based debugging, and network inspection; this project uses its built-in assertions and request interception. See the [Cypress introduction](https://docs.cypress.io/guides/overview/why-cypress), [configuration](https://docs.cypress.io/app/references/configuration), and [browser guide](https://docs.cypress.io/app/references/launching-browsers).

In this cloud workspace Chrome and Edge passed 4/4. Firefox launched and passed the two account scenarios, but its product requests cannot complete through this workspace proxy. The site uses `QUERY /products`; an HTTP/2 request returns 200, while the same request over HTTP/1.1 gets an empty proxy response. The two catalog scenarios need a rerun where Firefox can reach that API without this proxy limitation.
