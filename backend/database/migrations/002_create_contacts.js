exports.up = function(knex) {
  return knex.schema.createTable('contacts', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').nullable();
    table.text('message').notNullable();
    table.timestamps(true, true);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('contacts');
};
