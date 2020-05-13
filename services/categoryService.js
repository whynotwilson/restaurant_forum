const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback(category)
            // return res.render('admin/categories', { categories, category: category.toJSON() })
          })
      } else {
        callback(categories)
        // return res.render('admin/categories', { categories })
      }
    })
  }
}

module.exports = categoryService
