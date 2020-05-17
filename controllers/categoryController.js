const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService.js')
const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', { categories, category: category.toJSON() })
          })
      } else {
        return res.render('admin/categories', { categories })
      }
    })
  },

  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/categories')
    })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  },

  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/categories')
    })
    // return Category.findByPk(req.params.id)
    //   .then((category) => {
    //     category.destroy()
    //       .then((category) => {
    //         res.redirect('/admin/categories')
    //       })
    //   })
  }
}
module.exports = categoryController
