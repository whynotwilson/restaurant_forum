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
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          callback({ status: 'success', message: 'Cetegory was successfully edit' })
        })
        .catch(err => {
          console.log(err)
          callback({ status: 'error', message: 'Cetegory was faily edit' })
        })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              callback({ status: 'success', message: 'Cetegory was successfully edit' })
            })
        })
        .catch(err => {
          console.log(err)
          callback({ status: 'error', message: 'Cetegory was faily edit' })
        })
    }
  },

  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            callback({ status: 'success', message: 'Category was successfully delete' })
          })
      }).catch(err => {
        console.log(err)
        callback({ status: 'error', message: 'Category was faily delete' })
      })
  }
}

module.exports = categoryService
