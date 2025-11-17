exports.up = function(knex) {
  return knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('role').nullable();
    table.string('email').nullable();
    table.string('phone').nullable();
    table.timestamps(true, true);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('employees');
};
