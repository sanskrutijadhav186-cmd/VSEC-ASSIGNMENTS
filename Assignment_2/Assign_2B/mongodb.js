 use("college");

// db.students.insertMany([
//     {
//         name : "sanskruti",
//         age : 20,
//         branch : "IT",
//         marks : 98,
//         city : "Nashik"
//     },
//     {
//         name : "Tanishq",
//         age : 21,
//         branch : "CS",
//         marks : 88,
//         city : "Mumbai",
//     },
//     {
//         name : "Sarthak",
//         age : 20,
//         branch : "IT",
//         marks : 92,
//         city : "Pune",
//     },
//     {
//         name : "Anushree",
//         age : 21,
//         branch : "ENTC",
//         marks : 87,
//         city : "Nashik",
//     },
//     {
//         name : "Rahul",
//         age : 20,
//         branch : "CS",
//         marks : 76,
//         city : "Mumbai",
//     },
//     {
//         name : "Neha",
//         age : 21,
//         branch : "IT",
//         marks : 97,
//         city : "Pune",
//     },
//     {
//         name : "Shreya",
//         age : 20,
//         branch : "ENTC",
//         marks : 69,
//         city : "Nashik",
//     },
//     {
//         name : "sona",
//         age : 21,
//         branch : "IT",
//         marks : 85,
//         city : "Pune",
//     },
// ]);

// db.students.find();

//db.students.findOne({name : "sanskruti"});

//db.students.find({branch : "IT"});

//db.students.find({ marks: { $ne: 85 }});

//db.students.find({marks : {$gt : 80}});

//db.students.find({marks : {$lt : 80}});

//db.students.find({ marks: { $gte: 80 } });

//db.students.find({ marks: { $lte: 80 } });

//db.students.find({marks : {$gte : 80,$lte : 90}}); 

//db.students.find({branch: "IT",marks: { $gt: 80 }});

//db.students.find({$or: [{ branch: "IT" },{ branch: "CS" }]});

//db.students.find({$and: [{ branch: "IT" },{ marks: { $gt: 80 } }]});

//db.students.find({branch: { $in: ["IT", "CS"] }});

// db.students.find({branch: { $nin: ["IT", "CS"] }});

//db.students.find({},{name : 1, marks : 1});

// db.students.find({},{_id : 0,marks :1, name :1});

//db.students.find().sort({marks : -1});

// db.students.find().sort({marks : 1});

//db.students.find().sort({marks : -1}).limit(1);


//db.students.find().sort({marks : -1}).limit(3);

//db.students.find().sort({marks : 1}).limit(3); 

// db.students.find().sort({marks : -1}).skip(1).limit(3); pagination


//db.students.countDocuments({branch: "IT"});


//db.students.updateOne({name : "sanskruti"},{$set : {city : "Pune"}});

//db.students.updateOne({ name: "Sanskruti" },{ $set: { age: 21,city: "Nashik",marks: 95 }});

//db.students.updateOne({ name: "Sanskruti" },{ $inc: { marks: 5 } });

//db.students.updateMany({ branch: "IT" },{ $inc: { marks: 2 } });


//db.students.replaceOne({ name: "Rahul" },{ name: "Rahul",age: 21,branch: "IT",marks: 90,city: "Nashik"});

//db.students.deleteOne({name : "Rahul"});

//db.students.deleteOne({marks :{$lt : 70}});

//db.students.deleteMany({branch : "ENTC"});

//db.students.deleteMany({marks : {$lt : 60}});

//db.students.distinct("branch");

// db.students.aggregate([
//     {
//         $group: {
//             _id: null,
//             averageMarks: { $avg: "$marks" }
//         }
//     }
// ]);

// db.students.aggregate([
//     {
//         $group: {
//             _id: null,
//             highestMarks: { $max: "$marks" }
//         }
//     }
// ]);

// db.students.aggregate([
//     {
//         $group: {
//             _id: null,
//             lowestMarks: { $min: "$marks" }
//         }
//     }
// ]);

// db.students.aggregate([
//     {
//         $group: {
//             _id: "$branch",
//             count: { $sum: 1 }
//         }
//     }
// ]);

// db.students.aggregate([
//     {
//         $group: {
//             _id: "$branch",
//             averageMarks: { $avg: "$marks" }
//         }
//     }
// ]);

// db.students.aggregate([
//     {
//         $group: {
//             _id: "$branch",
//             averageMarks: { $avg: "$marks" }
//         }
//     },
//     {
//         $sort: { averageMarks: -1 }
//     },
//     {
//         $limit: 1
//     }
// ]);