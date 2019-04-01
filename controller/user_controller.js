var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Task = mongoose.model('Task');

exports.list_all_users = function(req, res) {
    var url = require('url');
    var parseUrl = url.parse(req.url, true);
    // without any filters
    if (parseUrl.search = ""){
        User.find({}, function(err, user) {
            if(err){
                return res.status(500).json({
                    message: "Request for all users failed",
                    data: []
                });
            } else if (user == null || user.length == 0) {
                return res.status(404).json({
                    message: "Cannot find any user",
                    data: []
                });
            } else {
                return res.status(200).json({
                    message: 'OK',
                    data: user
                });
            }
        });
    }
    // with filter conditions
    var q = parseUrl.query;
    console.log(q);
    var q_where = q.where;
    var q_sort = q.sort;
    var q_select = q.select;
    var q_skip = q.skip;
    var q_limit = q.limit || 100;
    var q_count = q.count;
    var users = User.find();
    console.log(users);
    if (q_where){
        users = users.where(JSON.parse(q_where));
    }
    if (q_sort){
        users = users.sort(JSON.parse(q_sort));
    }
    if (q_select){
        users = users.select(JSON.parse(q_select));
    }
    if (q_skip){
        users = users.skip(JSON.parse(q_skip));
    }
    if (q_limit){
        users = users.limit(JSON.parse(q_limit));
    }
    if (q_count){
        users = users.count(JSON.parse(q_count));
    }

    users.exec(function(err, user) {
        if(err){
            return res.status(500).json({
                message: "Request for all users failed",
                data: []
            });
        } else if (user == null || user.length == 0) {
            return res.status(404).json({
                message: "Cannot find any user",
                data: []
            });
        } else {
            return res.status(200).json({
                message: 'OK',
                data: user
            });
        }
    });

}

exports.create_a_user = function(req, res) {
    if(req.body.name == null || req.body.name == ""){
        return res.status(400).json({
            message: "Please enter a valid user name",
            data: []
        });
    }
    if(req.body.email == null || req.body.email == ""){
        return res.status(400).json({
            message: "Please enter a valid user email",
            data: []
        });
    }
    var new_user = new User(req.body);
    new_user.save(function(err, user){
        if (err) {
            console.log('ERR:', err);
            return res.status(500).json({
                message: "Request for all users failed",
                data: []
            });
        } else {
            return res.status(200).json({
                message: 'OK',
                data: user
            });
        }
    });
}

exports.read_a_user = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(err) {
            return res.status(500).json({
                message: "Request for a user failed",
                data: []
            });
        } else if (user == null || user.length == 0) {
            return res.status(404).json({
                message: "Cannot find the user",
                data: []
            });
        } else {
            return res.status(200).json({
                message: "OK",
                data: user
            });
        }
    });
}

exports.update_a_user = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(err) {
            return res.status(500).json({
                message: "Update request failed",
                data: []
            });
        } else if (user == null || user.length == 0) {
            return res.status(404).json({
                message: "Cannot find the user",
                data: []
            });
        } else {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.pendingTasks = req.body.pendingTasks || user.pendingTasks;
            user.dateCreated = req.body.dateCreated || user.dateCreated;
            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: "Update a user failed",
                        data: []
                    });
                } else {
                    return res.status(200).json({
                        message: 'OK',
                        data: user
                    });
                }
            });
        }
    });
}

exports.delete_a_user = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if(err) {
            return res.status(500).json({
                message: "Delete request failed",
                data: []
            });
        } else if (user == null || user.length == 0) {
            return res.status(404).json({
                message: "Cannot find the user",
                data: []
            });
        } else {
            return res.status(200).json({
                message: "OK",
                data: user
            });
        }
    });
}