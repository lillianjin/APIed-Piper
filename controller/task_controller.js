var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Task = mongoose.model('Task');

exports.list_all_tasks = function(req, res) {
    var url = require('url');
    var parseUrl = url.parse(req.url, true);
    // without any filters
    if (parseUrl.search = ""){
        Task.find()
            .exec()
            .then(task => {
                if (task == null || task.length == 0) {
                    res.status(404).json({
                        message: "Cannot find any task",
                        data: []
                    });
                } else {
                    res.status(200).json({
                        message: 'OK',
                        data: task
                    });
                }
                })
            .catch(err => {
                res.status(500).json({
                    message: "Request for all tasks failed",
                    data: []
                });
            }); 
    } else {
        // with filter conditions
        var q = parseUrl.query;
        var q_where = q.where;
        var q_sort = q.sort;
        var q_select = q.select;
        var q_skip = q.skip;
        var q_limit = q.limit || 100;
        var q_count = q.count;
        var tasks = Task.find();
        if (q_where){
            tasks = tasks.where(JSON.parse(q_where));
        }
        if (q_sort){
            tasks = tasks.sort(JSON.parse(q_sort));
        }
        if (q_select){
            tasks = tasks.select(JSON.parse(q_select));
        }
        if (q_skip){
            tasks = tasks.skip(JSON.parse(q_skip));
        }
        if (q_limit){
            tasks = tasks.limit(JSON.parse(q_limit));
        }
        if (q_count){
            tasks = tasks.count(JSON.parse(q_count));
        }

        tasks.exec(function(err, task) {
            if(err){
                return res.status(500).json({
                    message: "Request for filtered tasks failed",
                    data: []
                });
            } else if (task == null || task.length == 0) {
                return res.status(404).json({
                    message: "Cannot find any task",
                    data: []
                });
            } else {
                return res.status(200).json({
                    message: 'OK',
                    data: task
                });
            }
        });
    }
}

exports.create_a_task = function(req, res) {
    if(req.body.name == null || req.body.name == ""){
        return res.status(400).json({
            message: "Please enter a valid task name",
            data: []
        });
    }
    if(req.body.deadline == null || req.body.deadline == ""){
        return res.status(400).json({
            message: "Please enter a valid task deadline",
            data: []
        });
    }
    var new_task = new Task(req.body);
    new_task.save()
            .then(task => {
                res.status(201).json({
                    message: 'OK',
                    data: task
                });
                
                /*
                This part of the code can insert the id of new added pending task into user's pendingTasks list
                If using dbFill.py to add new data automatically, we do not need this part
                When adding personal task into the database, just uncomment this part 
                */
               /*
                var uid = task.assignedUser;
                if(!task.completed && uid != ""){
                    User.findByIdAndUpdate( uid, { $push: {pendingTasks: task._id} }, { new: true })
                        .exec()
                        .then(result => {
                            res.status(201).json({
                                message: 'OK',
                                data: task
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                message: "Update the task list failed",
                                data: []
                            });
                        })
                } else {
                    res.status(500).json({
                        message: 'OK',
                        data: task
                    });
                }
                */
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Create a task failed",
                    data: []
                });
            })
}

exports.read_a_task = function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if(err) {
            return res.status(500).json({
                message: "Request for a task failed",
                data: []
            });
        } else if (task == null || task.length == 0) {
            return res.status(404).json({
                message: "Cannot find the task",
                data: []
            });
        } else {
            return res.status(200).json({
                message: "OK",
                data: task
            });
        }
    });
}

exports.update_a_task = function(req, res) {
    let tid = req.params.id;
    Task.findByIdAndUpdate( tid, { $set: req.body }, { new: true } )
        .exec()
        .then( task => {
            if(task.completed){
                var uid = task.assignedUser;
                User.findByIdAndUpdate( uid, { $pull: {pendingTasks: task._id} }, { new: true })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'OK',
                            data: task
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: "Update the task list failed",
                            data: []
                        });
                    })
            } else {
                res.status(500).json({
                    message: 'OK',
                    data: task
                });
            }
        }) 
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Update request failed",
                data: []
            })
        });
}

exports.delete_a_task = function(req, res) {
    Task.findByIdAndRemove(req.params.id)
        .exec()
        .then(task => {
            let uid = task.assignedUser;
            if(!task.completed){
                User.findByIdAndUpdate( uid, { $pull: {pendingTasks: task._id} }, { new: true })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'OK',
                        data: task
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: "Delete the task list failed",
                        data: []
                    });
                })
            } else {
                res.status(200).json({
                    message: 'OK',
                    data: task
                });
            }
        })
        .catch( err => {
            res.status(500).json({
                message: "Delete request failed",
                data: []
            });
        })        
}