var Harvest = require('harvest');
var fs = require('fs');

harvest = new Harvest({
  subdomain: process.env.HARVEST_SUBDOMAIN,
  email: process.env.HARVEST_EMAIL,
  password: process.env.HARVEST_PASSWORD
});

var TimeTracking = harvest.TimeTracking;
var People = harvest.People;

People.list({}, function(err, people) {
  if (err) { throw new Error(err); }

  var stringReport = (new Date()).toISOString() + '\n\n\n';

  people.forEach(function(person) {
    TimeTracking.daily({of_user: person.user.id}, function(err, tasks) {
      if (err) { throw new Error(err); }

      var slimTasks = tasks.day_entries.map(function(task) {
        return {
          task: task.client + ' > ' + task.project + ' > ' + task.task + ' > ' + task.notes,
          hours_without_timer: task.hours_without_timer,
          hours: task.hours
        };
      });

      var report = {
        person: person.user.first_name + ' ' + person.user.last_name,
        tasks: slimTasks,
        total_hours_without_timer: slimTasks.reduce(function(sum, task) { return sum + task.hours_without_timer; }, 0),
        total_hours: slimTasks.reduce(function(sum, task) { return sum + task.hours; }, 0)
      }

      var personHeader = 'Person: ' + report.person + '\n';
      stringReport = personHeader + '-'.repeat(personHeader.length) + '\n\n';

      stringReport += 'Total hours: ' + report.total_hours + '\n';
      stringReport += 'Total hours with timer: ' + (report.total_hours - report.total_hours_without_timer) + '\n';
      stringReport += 'Total hours without timer: ' + report.total_hours_without_timer + '\n\n';

      stringReport += 'Tasks:\n';
      stringReport += report.tasks.map(function(task) {
        return '\t* ' + task.task + ' - ' + '(hours with timer: ' + (task.hours - task.hours_without_timer) + '; hours without timer: ' + task.hours_without_timer;
      }).join('\n');

      stringReport += '\n\n\n';

      console.log(stringReport);
    });
  });
});
