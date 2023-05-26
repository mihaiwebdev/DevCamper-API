const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
});

// Allow only one user review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Calculate average bootcamp rating
ReviewSchema.statics.getAverageRating = async function(bootcampId) {

    const averageRatingObject = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: averageRatingObject[0].averageRating
        });

    } catch (error) {
        console.log(error);
    }
}

ReviewSchema.post('save', async function() {
    this.constructor.getAverageRating(this.bootcamp);
})

ReviewSchema.pre('deleteOne', { document: true}, async function(next) {
    this.constructor.getAverageRating(this.bootcamp);
    next();
})


module.exports = mongoose.model('Review', ReviewSchema);