var path = require('path');
var program = require('commander');
var schema = require('epochtalk-core-pg/schema');
program
  .version('0.0.1')
  .option('--recreate [database]', 'Recreate [database]. Default: config.json{database} OR epoch_dev)')
  .option('-b, --backup [path]', 'Backup database at [path] or default to epoch.db in the current working directory if path is not provided')
  .option('-r, --restore <path/url>', 'Restore database from backup at <path/url>')
  .option('--seed', 'Seed database with test data (Developer)')
  .parse(process.argv);

var genericArgs = {
  debug: program.debug,
  verbose: program.verbose,
  db: program.leveldb || path.join(process.env.PWD, 'epoch.db')
};

if (program.recreate === true) {
  schema.recreate('epoch_dev');
}
else if (program.recreate) {
  schema.recreate(program.recreate);
}
else {
  program.help();
}
