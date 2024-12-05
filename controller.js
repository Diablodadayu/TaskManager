const fs = require("fs");

module.exports = {
    getAll: (req, res) => {
        console.log("get all");

        fs.readFile("tasks.json", "utf-8", (err, data)=>{
            if (err) {
                return res.json({
                    code: 1,
                    error: err
                });
            }
            let list = JSON.parse(data);
            res.json({
                code: 0,
                data: list
            });
        })
    },
    get: (req, res) => {
        console.log("get");

        fs.readFile("tasks.json", "utf-8", (err, data)=>{
            if (err) {
                return res.json({
                    code: 1,
                    error: err
                });
            }
            let list = JSON.parse(data);
            let id = req.id;
            let item = list.find(v=>v.id==id);
            if (!item) {
                return res.status(400).json({
                    code: 1,
                    error: new Error("Invalid id.")
                })
            }
            return res.json({
                code: 0,
                data: item
            })
            
        })
        
    },
    save: (req, res) => {
        console.log("save");

        fs.readFile("tasks.json", "utf-8", (err, data)=>{
            if (err) {
                return res.json({
                    code: 1,
                    error: err
                });
            }
            let list = JSON.parse(data);
            let {title, dueDate, priority, description, assignee} = req.body;
            let append = {
                id: (list.length>0)?list[list.length-1].id+1:1,
                title, dueDate, priority, description, assignee
            }
            list.push(append);
            fs.writeFile("tasks.json", JSON.stringify(list), (err)=>{
                if (err) {
                    return res.json({
                        code: 1,
                        error: err
                    })
                }
                return res.json({
                    code: 0
                })
            })
        })
        
    },
    delete: (req, res) => {
        console.log("delete", req.params.id);

        fs.readFile("tasks.json", "utf-8", (err, data)=>{
            if (err) {
                return res.json({
                    code: 1,
                    error: err
                });
            }
            let list = JSON.parse(data);
            let id = req.params.id;
            list = list.filter(v=>v.id!=id)
            fs.writeFile("tasks.json", JSON.stringify(list), (err)=>{
                if (err) {
                    return res.json({
                        code: 1,
                        error: err
                    })
                }
                return res.json({
                    code: 0
                })
            })
        })
    },
    update: (req, res) => {
        console.log("update");

        fs.readFile("tasks.json", "utf-8", (err, data)=>{
            if (err) {
                return res.json({
                    code: 1,
                    error: err
                });
            }
            let list = JSON.parse(data);
            let id = req.params.id;
            let item = list.find(v=>v.id==id);
            if (!item) {
                return res.status(400).json({
                    code: 1,
                    error: new Error("Invalid id.")
                })
            }
            let {title, dueDate, priority, description, assignee} = req.body;
            if (title) item.title = title;
            if (dueDate) item.dueDate = dueDate;
            if (priority) item.priority = priority;
            if (description) item.description = description;
            if (assignee) item.assignee = assignee;

            fs.writeFile("tasks.json", JSON.stringify(list), (err)=>{
                if (err) {
                    return res.json({
                        code: 1,
                        error: err
                    })
                }
                return res.json({
                    code: 0
                })
            })
        })
        
    },
    
};