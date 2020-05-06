const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    // 計算目前第幾頁
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    // 判斷分類
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      // whereQuery["CategoryId"] = categoryId
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAndCountAll({ where: whereQuery, include: Category, offset: offset, limit: pageLimit })
      .then(result => {
        // data for pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        // console.log(data)
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => {
          console.log(categories)
          return res.render('restaurants', {
            restaurants: data,
            categories,
            categoryId,
            page,
            totalPage,
            prev,
            next
          })
        })
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    }).then(restaurant => {
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  }
}
module.exports = restController
