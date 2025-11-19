exports.up = function(knex) {
  return knex.schema.createTable('quotes', (table) => {
    table.increments('id').primary();
    table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('SET NULL');
    table.text('description').notNullable();
    table.decimal('amount', 12, 2).defaultTo(0);
    table.string('status').defaultTo('pending');
    table.timestamps(true, true);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('quotes');
};
