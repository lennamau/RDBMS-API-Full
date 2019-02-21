
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: 'Danny', cohort_id: 1},
        {name: 'Ryan', cohort_id: 2},
        {name: 'Tyler', cohort_id: 3}
      ]);
    });
};
