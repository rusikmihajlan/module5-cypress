const field = (name) => cy.get(`[data-test="${name}"]`);

function createAccount() {
  const account = {
    email: `cypress-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
    password: `Qa!9${Date.now()}${Math.random().toString(36).slice(2)}`,
  };
  cy.visit('/auth/register');
  field('country').select('US');
  Object.entries({
    'first-name': 'Test', 'last-name': 'Customer', dob: '1990-01-01',
    postal_code: '10001', house_number: '123', street: 'Main Street',
    city: 'New York', state: 'New York', phone: '1234567890',
    email: account.email, password: account.password,
  }).forEach(([name, value]) => field(name).type(value));
  cy.intercept('POST', '**/users/register').as('register');
  field('register-submit').click();
  cy.wait('@register').its('response.statusCode').should('eq', 201);
  cy.location('pathname').should('eq', '/auth/login');
  return cy.wrap(account);
}

function signIn(account) {
  field('email').type(account.email);
  field('password').type(account.password);
  field('login-submit').click();
  cy.location('pathname').should('eq', '/account');
}

describe('Remaining Module 2 scenarios', () => {
  it('signs in with valid credentials', () => {
    createAccount().then(signIn);
    field('page-title').should('contain', 'My account');
  });

  it('updates the profile street address', () => {
    createAccount().then((account) => {
      signIn(account);
      field('nav-profile').click();
      field('email').should('have.value', account.email);
    });
    field('street').clear().type('456 Cypress Avenue');
    field('update-profile-submit').click();
    cy.contains(/profile updated|successfully updated/i).should('be.visible');
    cy.reload();
    field('street').should('have.value', '456 Cypress Avenue');
  });

  it('adds a product to favorites', () => {
    createAccount().then(signIn);
    cy.visit('/');
    field('product-name').contains('Combination Pliers').click();
    field('add-to-favorites').click();
    field('nav-menu').click();
    field('nav-my-favorites').click();
    field('product-name').should('contain', 'Combination Pliers');
  });

  it('filters the catalog to Hand Tools', () => {
    cy.visit('/');
    field('product-name').first().should('be.visible');
    cy.intercept('QUERY', '**/products').as('products');
    cy.contains('label', 'Hand Tools').find('input[type="checkbox"]').check();
    cy.wait('@products').then(({ request, response }) => {
      const selected = request.body.by_category.split(',');
      expect(selected).to.include('01M51Z1S8ZZERX11S8270F1C7E');
      expect(response.body.data.length).to.be.greaterThan(0);
      response.body.data.forEach((product) => {
        expect(selected).to.include(product.category.id);
      });
      field('product-name').then(($names) => {
        expect([...$names].map((node) => node.textContent.trim()))
          .to.deep.equal(response.body.data.map((product) => product.name));
      });
    });
  });
});
