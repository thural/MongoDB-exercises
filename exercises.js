// //import/export JSON
// mongoexport --uri="mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies" --collection=sales --out=sales.json
// mongoimport --uri="mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies" --drop sales.json
// //dump/restore BSON
// mongodump --uri "mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies"
// mongorestore --uri "mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies"  --drop dump

// //Connect to the Atlas cluster:
//mongo "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/admin"


// // select a collection of documents
// show dbs
// use sample_training
// show collections

// query matching documents in "zips" collection
db.zips.find({ "state": "NY" }) //all matches will be returned to the cursor
// use count method
db.zips.find({ "state": "NY" }).count() //number of matches
// using multiple multiple fields to narrow down results
db.zips.find({ "state": "NY", "city": "ALBANY" })
// get a single random document from a collection
db.zips.findOne();
// using pretty method to make results more readable
db.zips.find({ "state": "NY", "city": "ALBANY" }).pretty()

//// Insert operations
// "_id" field is a unique identifier for every document,
// it will be auto-created if not provided during insert operation
// insert a document to selected collection
db.inspections.insert({
  "id": "10021-2015-ENFO",
  "certificate_number": 9278806,
  "business_name": "ATLIXCO DELI GROCERY INC.",
  "date": "Feb 20 2015",
  "result": "No Violation Issued",
  "sector": "Cigarette Retail Dealer - 127",
  "address": {
    "city": "RIDGEWOOD",
    "zip": 11385,
    "street": "MENAHAN ST",
    "number": 1712
  }
});
// inserting multiple documents with same "_id"s will throw an error and halt the operation at the first dublicate!
// some documents still will be inserted before the dublicate
db.inspections.insert([{ "_id": 1, "test": 1 }, { "_id": 1, "test": 2 }, { "_id": 3, "test": 3 }])
// this behaviour can be avoided by using "{ordered:false}" option
// in this case dublicate documents will be skipped
db.inspections.insert([{ "_id": 1, "test": 1 }, { "_id": 1, "test": 2 }, { "_id": 3, "test": 3 }], { "ordered": false })

//// Update operations
// Updating using updateOne() and updateMany() methods
// "$inc" will increment value of the target field by specified value in the expression
// Update all documents in the zips collection where the city field is equal to "HUDSON" by adding 10 to the current value of the "pop" field.
db.zips.updateMany({ "city": "HUDSON" }, { "$inc": { "pop": 10 } })
// "$set" will set value of target field by specified value in the expression
// Update a single document in the zips collection where the zip field is equal to "12534" by setting the value of the "pop" field to 17630.
db.zips.updateOne({ "zip": "12534" }, { "$set": { "pop": 17630 } })
// "$push" will push/update records into array specified in the expression
// Update one document in the grades collection where the student_id is ``250`` *, by adding a document element to the "scores" array.
db.grades.updateOne({ "student_id": 250, "class_id": 339 },
  {
    "$push": {
      "scores": { "type": "extra credit", "score": 100 }
    }
  })

//// Delete operations
// Delete one(random match) document that has test field equal to 3.
db.inspections.deleteOne({ "test": 3 })
// Delete all the documents that have test field equal to 1.
db.inspections.deleteMany({ "test": 1 })
// Delete an entire collection using drop() method
db.inspection.drop()

//// Compare operators
// "$eq" (==), "$ne" (!=), "$lt" (<), "$gt" (>), "$lte" (<=), "$gte" (>=)
// Find all documents where the tripduration was less than or equal to 70 seconds and the usertype was not Subscriber:
db.trips.find({
  "tripduration": { "$lte": 70 },
  "usertype": { "$ne": "Subscriber" }
}).pretty()

//// Logical Query Operators
// "$and", "$or", "$nor", "$not"
//Find all documents where airplanes CR2 or A81 left or landed in the KZN airport:
db.routes.find({
  "$and": [
    {
      "$or": [{ "dst_airport": "KZN" }, { "src_airport": "KZN" }]
    },
    {
      "$or": [{ "airplane": "CR2" }, { "airplane": "A81" }]
    }
  ]
}).pretty()

//// Expressive Query Operator
// "$expr" operator allows to use field values by using "$" in field names like this: "$field name"
// Find all documents where the trip started and ended at the same station:
db.trips.find({
  "$expr": { "$eq": ["$end station id", "$start station id"] }
}).count()
// Find all documents where the trip lasted longer than 1200 seconds, and started and ended at the same station:
db.trips.find({
  "$expr": {
    "$and": [
      { "$gt": ["$tripduration", 1200] },
      { "$eq": ["$end station id", "$start station id"] }
    ]
  }
}).count()

//// Array Operators
// "$size" for array size(length), "$all" will match arrays that has all the elements specified in the expression
// if "$all" operator is not used the query will only return explicit (exact) matches!
// Find all documents with exactly 20 amenities which include all the amenities listed in the query array:
db.listingsAndReviews.find({
  "amenities": {
    "$size": 20,
    "$all": ["Internet", "Wifi", "Kitchen",
      "Heating", "Family/kid friendly",
      "Washer", "Dryer", "Essentials",
      "Shampoo", "Hangers",
      "Hair dryer", "Iron",
      "Laptop friendly workspace"]
  }
}).pretty()

//// Projection
// Projection (find({<query>}, {<projection>})), is an expression that narrows down query result to specified record fields.
// all projection fields can either have 1 or 0 as values to include or exclude specified fields respectively,
// mixing field values in projection expression like this ({"price":1, "address":0}) will throw an error!
// "_id" field is an exception to this rule, which can have either values in any case.
// Find all documents that have Wifi as one of the amenities only include price and address in the resulting cursor:
db.listingsAndReviews.find(
  { "amenities": "Wifi" },
  { "price": 1, "address": 1, "_id": 0 }
).pretty()
// Find all documents with exactly 20 amenities which include all the amenities listed in the query array, and display their price and address:
db.listingsAndReviews.find({
  "amenities":
  {
    "$size": 20, "$all": [
      "Internet", "Wifi", "Kitchen", "Heating",
      "Laptop friendly workspace"
    ]
  }
},
  { "price": 1, "address": 1 }).pretty()
// TODO : "$elemMtach" and nested array elements





