const mongoose = require('mongoose')

var itemSchema = mongoose.Schema({
	barCode : String ,
	name : String ,
	totalStock : { type: Number , default: 0 } ,
	availableStock : { type: Number , default: 0 } ,
	rentedStock : { type: Number , default: 0 } ,
	price : Number ,
	costPrice : Number ,
	timesOrdered : { type : Number , default : 0 } ,
	lastVal : Number 
})

module.exports = mongoose.model('item',itemSchema)