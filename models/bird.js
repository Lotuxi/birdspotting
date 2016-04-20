var mongoose = require("mongoose")
var Schema = mongoose.Schema;

//bird watcher database
var birdSchema = Schema({
  name : { type : String,
    required : true,
    unique : true,
    lowercase : true },
  description : String,
  nestType : String,
  averageEggsLaid : {type : Number, min : 1, max : 50},
  threatened : { type : Boolean, default : false},
  datesSeen : [{ type : Date, default : Date.now}]
});

var Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird;
