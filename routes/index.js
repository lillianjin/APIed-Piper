/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));

    var tasks = require('../controller/task_controller');
    var users = require('../controller/user_controller');

    app.route('/api/tasks')
        .get(tasks.list_all_tasks)
        .post(tasks.create_a_task);
    
    app.route('/api/tasks/:id')
        .get(tasks.read_a_task)
        .put(tasks.update_a_task)
        .delete(tasks.delete_a_task);

    app.route('/api/users')
        .get(users.list_all_users)
        .post(users.create_a_user);
    
    app.route('/api/users/:id')
        .get(users.read_a_user)
        .put(users.update_a_user)
        .delete(users.delete_a_user);
};
