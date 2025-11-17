exports.up = function(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.integer('author_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamps(true, true);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('posts');
};
