/**
 * Extracts pagination parameters from request query
 * @param {Object} query - Express request query object
 * @param {number} defaultLimit - Default limit if not provided
 * @returns {Object} - { page, limit, skip }
 */
const getPaginationParams = (query, defaultLimit = 10) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || defaultLimit;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Creates pagination metadata for response
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {Array} data - The data array
 * @returns {Object} - Pagination metadata
 */
const createPaginationMeta = (page, limit, total, data) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null,
    count: data.length
  };
};

/**
 * Applies pagination to a Mongoose query
 * @param {Object} query - Mongoose query object
 * @param {Object} pagination - { page, limit, skip }
 * @returns {Object} - Query with pagination applied
 */
const applyPaginationToQuery = (query, { skip, limit }) => {
  return query.skip(skip).limit(limit);
};

module.exports = {
  getPaginationParams,
  createPaginationMeta,
  applyPaginationToQuery
};