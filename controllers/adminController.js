const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminServices.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (restaurants) => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories, restaurant: restaurant.toJSON()
        })
      })
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then((users) => {
        res.render('admin/users', { users })
      })
  },
  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
      .then(async (user) => {
        user.isAdmin = user.isAdmin ? 0 : 1
        await user.save()
      })
      .then(() => {
        req.flash('success_messages', '權限已成功更改')
        return res.redirect('/admin/users')
      })
  }
}

module.exports = adminController
