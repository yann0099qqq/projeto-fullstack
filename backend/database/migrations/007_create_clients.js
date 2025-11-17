exports.up = function(knex) {
  return knex.schema.createTable('clients', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').nullable();
    table.string('phone').nullable();
    table.text('notes').nullable();
    table.timestamps(true, true);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('clients');
};
