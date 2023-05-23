
const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    const reqQuery = {...req.query};
    
    // Remove fields which don't need to be searched for in the model
    const removeFields = ['select', 'sort', 'limit', 'page'];
    removeFields.map(field => delete reqQuery[field]);

    // Create MongoDB operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding bootcamps by queries
    query = model.find(JSON.parse(queryStr));

    // Get only selected fields from bootcamp data
    if (req.query.select) {
        const fields = req.query.select.replace(',', ' ');
        query = query.select(fields);
    }

    // Sort data
    if (req.query.sort) {
        const sortBy = req.query.sort.replace(',', ' ');
        query = query.sort(sortBy);

    } else {
        query = query.sort('-createdAt');
    }

    // Populate
    if (populate) {
        query.populate(populate);
    }
    
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    const result = await query;

    res.advancedResults = {
        success:true,
        count: result.length,
        pagination,
        data: result
    };

    next();
}

module.exports = advancedResults;