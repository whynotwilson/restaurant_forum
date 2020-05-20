const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      callback(restaurants)
    })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      console.log('')
      console.log('')
      console.log('restaurant', restaurant)
      console.log('')
      console.log('')
      callback(restaurant)
    })
  },

  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).catch(console.log(err))
          .then((restaurant) => {
            callback({ status: 'success', message: 'restaurant was successfully created' })
          })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },

  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            }).catch(console.log(err))
              .then((restaurant) => {
                callback({ status: 'success', message: 'restaurant was successfully created' })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              callback({ status: 'success', message: 'restaurant was successfully created' })
            })
        })
    }
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      }).catch(err => {
        console.log(err)
        callback({ status: 'error', message: 'Admin Restaurant delete Error' })
      })
  },

  // createRestaurant: (req, res, callback) => {
  //   Category.findAll({
  //     raw: true,
  //     nest: true
  //   }).then(categories => {
  //     callback({ status: 'success', message: 'Admin Restaurant successfully create' })
  //   }).catch(err => {
  //     console.log(err)
  //     callback({ status: 'error', message: 'Admin Restaurant create Error' })
  //   })
  // },

  // editRestaurant: (req, res, callback) => {
  //   Category.findAll({
  //     raw: true,
  //     nest: true
  //   }).then(categories => {
  //     return Restaurant.findByPk(req.params.id).then(restaurant => {
  //       // return res.render('admin/create', {
  //       // categories: categories, restaurant: restaurant.toJSON()
  //       // })
  //       callback({ status: 'success', message: 'Admin Restaurant successfully edit' })
  //     })
  //   }).catch(err => {
  //     console.log(err)
  //     callback({ status: 'error', message: 'Admin Restaurant error edit' })
  //   })
  // },

  getUsers: (req, res, callback) => {
    return User.findAll({ raw: true })
      .then((users) => {
        callback({ status: 'success', message: 'Admin successfully getUsers' })
      })
      .catch(err => {
        console.log(err)
        callback({ status: 'error', message: 'Admin faily getUsers' })
      })
  },

  putUsers: (req, res, callback) => {
    return User.findByPk(req.params.id)
      .then(async (user) => {
        user.isAdmin = user.isAdmin ? 0 : 1
        await user.save()
      })
      .then(() => {
        callback({ status: 'success', message: 'Admin successfully putUsers' })
      })
      .catch(err => {
        console.log(err)
        callback({ status: 'error', message: 'Admin faily putUsers' })
      })
  }

}

module.exports = adminService
