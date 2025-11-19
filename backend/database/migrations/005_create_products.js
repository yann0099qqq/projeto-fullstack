exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.decimal('price', 10, 2).defaultTo(0);
    table.timestamps(true, true);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products');
};
