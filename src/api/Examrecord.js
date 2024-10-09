import { version } from '../../package.json'
import { Router } from 'express'
import { Sequelize, Op,literal, QueryTypes } from 'sequelize'
import sequelize from '../models/sequelize'
import toRes from '../lib/toRes'
import ExamrecordModel from '../models/ExamrecordModel'
import ExampaperModel from '../models/ExampaperModel'
import util from '../lib/util'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import ConfigModel from '../models/ConfigModel'
import https from 'https'
import request from 'request'
import qs from 'querystring'
import path from 'path'
import fs from 'fs'
import config from '../config.json'
const redis = require('redis')




export default ({ config, db }) => {
	let api = Router()


	// 分页接口（后端）
	api.get('/page', async (req, res) => {

		try {

			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 10
			let sort = req.query.sort || 'id'
			let order = req.query.order || 'asc'

			let where = {}
			let userid = req.query.userid
			if (userid) {

				if (userid.indexOf('%') != -1) {
					where.userid = {
						[Op.like]: userid
					}
				} else {
					where.userid = {
						[Op.eq]: userid
					}
				}
			}
			let username = req.query.username
			if (username) {

				if (username.indexOf('%') != -1) {
					where.username = {
						[Op.like]: username
					}
				} else {
					where.username = {
						[Op.eq]: username
					}
				}
			}
			let paperid = req.query.paperid
			if (paperid) {

				if (paperid.indexOf('%') != -1) {
					where.paperid = {
						[Op.like]: paperid
					}
				} else {
					where.paperid = {
						[Op.eq]: paperid
					}
				}
			}
			let papername = req.query.papername
			if (papername) {

				if (papername.indexOf('%') != -1) {
					where.papername = {
						[Op.like]: papername
					}
				} else {
					where.papername = {
						[Op.eq]: papername
					}
				}
			}
			let questionid = req.query.questionid
			if (questionid) {

				if (questionid.indexOf('%') != -1) {
					where.questionid = {
						[Op.like]: questionid
					}
				} else {
					where.questionid = {
						[Op.eq]: questionid
					}
				}
			}
			let questionname = req.query.questionname
			if (questionname) {

				if (questionname.indexOf('%') != -1) {
					where.questionname = {
						[Op.like]: questionname
					}
				} else {
					where.questionname = {
						[Op.eq]: questionname
					}
				}
			}
			let options = req.query.options
			if (options) {

				if (options.indexOf('%') != -1) {
					where.options = {
						[Op.like]: options
					}
				} else {
					where.options = {
						[Op.eq]: options
					}
				}
			}
			let score = req.query.score
			if (score) {

				if (score.indexOf('%') != -1) {
					where.score = {
						[Op.like]: score
					}
				} else {
					where.score = {
						[Op.eq]: score
					}
				}
			}
			let answer = req.query.answer
			if (answer) {

				if (answer.indexOf('%') != -1) {
					where.answer = {
						[Op.like]: answer
					}
				} else {
					where.answer = {
						[Op.eq]: answer
					}
				}
			}
			let analysis = req.query.analysis
			if (analysis) {

				if (analysis.indexOf('%') != -1) {
					where.analysis = {
						[Op.like]: analysis
					}
				} else {
					where.analysis = {
						[Op.eq]: analysis
					}
				}
			}
			let ismark = req.query.ismark
			if (ismark) {

				if (ismark.indexOf('%') != -1) {
					where.ismark = {
						[Op.like]: ismark
					}
				} else {
					where.ismark = {
						[Op.eq]: ismark
					}
				}
			}
			let type = req.query.type
			if (type) {

				if (type.indexOf('%') != -1) {
					where.type = {
						[Op.like]: type
					}
				} else {
					where.type = {
						[Op.eq]: type
					}
				}
			}
			let myscore = req.query.myscore
			if (myscore) {

				if (myscore.indexOf('%') != -1) {
					where.myscore = {
						[Op.like]: myscore
					}
				} else {
					where.myscore = {
						[Op.eq]: myscore
					}
				}
			}
			let myanswer = req.query.myanswer
			if (myanswer) {

				if (myanswer.indexOf('%') != -1) {
					where.myanswer = {
						[Op.like]: myanswer
					}
				} else {
					where.myanswer = {
						[Op.eq]: myanswer
					}
				}
			}
			let jiaoshigonghao = req.query.jiaoshigonghao
			if (jiaoshigonghao) {

				if (jiaoshigonghao.indexOf('%') != -1) {
					where.jiaoshigonghao = {
						[Op.like]: jiaoshigonghao
					}
				} else {
					where.jiaoshigonghao = {
						[Op.eq]: jiaoshigonghao
					}
				}
			}
            if (jwt.decode(req.headers.token).role != '管理员' && ExamrecordModel.rawAttributes.hasOwnProperty('userid')) {
				where.userid = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).id : req.session.userinfo.id
				}
            }
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'jiaoshi') {
				where.jiaoshigonghao = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).jiaoshigonghao : req.session.userinfo.jiaoshigonghao
				}
				if (where['userid'] != undefined) {
					delete where.userid
				}
			}

			let orders =[]
			const sortList = sort.split(",")
			const orderList = order.split(",")
			sortList.forEach((item, index) => {
				orders.push([item,orderList[index]])
			  });
			let result = await ExamrecordModel.findAndCountAll({
				order: [orders],
				where,
				offset: (page - 1) * limit,
				limit
			})
			
			result.currPage = page
			result.pageSize = limit

			toRes.page(res, 0, result)
		} catch(err) {
			res.status(500).render(err)
			//toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	  // 分页接口（前端）
	api.get('/lists', async (req, res) => {

		try {
			let result = await ExamrecordModel.findAll()
			toRes.record(res, 0, result)
		} catch(err) {
			
			toRes.session(res, 401, '您的权限不够！', '', 200)
		}
	})

	// 查询单条记录（前端）
	api.get('/query', async (req, res) => {

		try {
			const dictionary = {};
			for (let key in req.query) {
				dictionary[key] = req.query[key];
			}
			let result = await ExamrecordModel.findOne({where:dictionary})
			
			toRes.record(res, 0, result)
		} catch(err) {
			res.status(500).render(err)
		}
	})

    // 分页接口（前端）
	api.get('/list', async (req, res) => {

		try {

			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 10
			let sort = req.query.sort || 'id'
			let order = req.query.order || 'asc'

			let where = {}
            if (jwt.decode(req.headers.token).role != '管理员' && ExamrecordModel.rawAttributes.hasOwnProperty('userid')) {
				where.userid = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).id : req.session.userinfo.id
				}
            }
			// let tableName = req.session.userinfo.tableName
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'jiaoshi') {
				where.jiaoshigonghao = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).jiaoshigonghao : req.session.userinfo.jiaoshigonghao
				}
			}
			let myscore = req.query.myscore
			let userid  = req.query.userid
			let paperid = req.query.paperid
			if (myscore) {
				where.myscore = {
					[Op.eq]: myscore
				}
			}
			if (userid) {
				where.userid = {
					[Op.eq]: userid
				}
			}
			if (paperid) {
				where.paperid = {
					[Op.eq]: paperid
				}
			}


			let orders =[]
			const sortList = sort.split(",")
			const orderList = order.split(",")
			sortList.forEach((item, index) => {
				orders.push([item,orderList[index]])
			  });
			let result = await ExamrecordModel.findAndCountAll({
				order: [orders],
				where,
				offset: (page - 1) * limit,
				limit
			})
			
			result.currPage = page
			result.pageSize = limit

			toRes.page(res, 0, result)
		} catch(err) {
			
			toRes.session(res, 401, '您的权限不够！', '', 200)
		}
	})


	// 保存接口（后端）
	api.post('/save', async (req, res) => {

		try {

			Object.keys(req.body).forEach(item=>{
				if(req.body[item] == '')  delete req.body[item]
				if(req.body[item] == '' && item == 'sfsh')  req.body[item] = '待审核'
			})
			if (!req.body.userid) {
				req.body.userid = req.session.userinfo === undefined ? jwt.decode(req.headers.token).id : req.session.userinfo.id
			}


		const paperInfo = await ExampaperModel.findOne({ where: { id: req.body['paperid'] } })
        req.body.jiaoshigonghao =  paperInfo.jiaoshigonghao

			const userinfo = await ExamrecordModel.create(req.body)

			if (userinfo === null) {

				toRes.session(res, -1, '添加失败！')
			} else {

				toRes.session(res, 0, '添加成功！')
			}
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

    // 保存接口（前端）
	api.post('/add', async (req, res) => {

		try {

			Object.keys(req.body).forEach(item=>{
				if(req.body[item] == '')  delete req.body[item]
				if(req.body[item] == '' && item == 'sfsh')  req.body[item] = '待审核'
			})

			if (jwt.decode(req.headers.token) == null) {
				toRes.session(res, 401, '请登录后再操作', '', 401)
			}


		const paperInfo = await ExampaperModel.findOne({ where: { id: req.body['paperid'] } })
        req.body.jiaoshigonghao =  paperInfo.jiaoshigonghao

			req.body.userid = req.session.userinfo === undefined ? jwt.decode(req.headers.token).id : req.session.userinfo.id


			const userinfo = await ExamrecordModel.create(req.body)

			if (userinfo === null) {

				toRes.session(res, -1, '添加失败！')
			} else {

				toRes.session(res, 0, '添加成功！')
			}
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 更新接口
	api.post('/update', async (req, res) => {

		try {


			await ExamrecordModel.update(req.body, {
				where: {
				  id: req.body.id || 0
				}
			})


			toRes.session(res, 0, '编辑成功！')
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 删除接口
	api.post('/delete', async (req, res) => {

		try {

			await ExamrecordModel.destroy({
				where: {
				  id: {
					[Op.in]: req.body
				  }
				}
			})

			toRes.session(res, 0, '删除成功！')
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 详情接口（后端）
	api.all('/info/:id', async (req, res) => {

		try {


			toRes.record(res, 0, await ExamrecordModel.findOne({ where: { id: req.params.id } }))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})


    // 详情接口（前端）
	api.all('/detail/:id', async (req, res) => {

		try {


			toRes.record(res, 0, await ExamrecordModel.findOne({ where: { id: req.params.id } }))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 获取需要提醒的记录数接口
	api.get('/remind/:columnName/:type', async (req, res) => {

        let where = ' 1=1 '
		let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
        if(tableName == 'jiaoshi') {
            where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
        }

		try {

			let sql = 'SELECT 0 AS count'
			
			if (req.params.type == 1) {
				if (req.query.remindstart) sql = "SELECT COUNT(*) AS count FROM examrecord WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "'"
				if (req.query.remindend) sql = "SELECT COUNT(*) AS count FROM examrecord WHERE " + where + " AND " + req.params.columnName + " <= '" + req.query.remindend + "'"

				if (req.query.remindstart && req.query.remindend) {
					sql = "SELECT COUNT(*) AS count FROM examrecord WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "' AND " + req.params.columnName + " <= '" + req.query.remindend + "'"
				}
			}

			if (req.params.type == 2) {
				if (req.query.remindstart) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM examrecord WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "'"
				}
				if (req.query.remindend) {
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM examrecord WHERE " + where + " AND " + req.params.columnName + " <= '" + remindEnd + "'"
				}

				if (req.query.remindstart && req.query.remindend) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM examrecord WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "' AND " + req.params.columnName + " <= '" + remindEnd + "'"
				}
			}

			const results = await sequelize.query(sql, {
				plain: true,
				raw: true,
				type: QueryTypes.SELECT
			})

			toRes.count(res, 0, results.count)
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})






	// 考试记录试卷分页接口【仅查试卷和总分】(管理员看所有，普通用户仅看自己)
	api.get('/groupby', async (req, res) => {
		try {
			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 5

			let where = {}
			if (jwt.decode(req.headers.token).role != '管理员' && ExamrecordModel.rawAttributes.hasOwnProperty('userid')) {
				where.userid = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).id : req.session.userinfo.id
				}
			}
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'jiaoshi') {
				where.jiaoshigonghao = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).jiaoshigonghao : req.session.userinfo.jiaoshigonghao
				}
				if (where['userid'] != undefined) {
					delete where.userid
				}
			}
			let papername = req.query.papername
			if (papername) {
				where.papername = {
					[Op.like]: papername
				}
			}

			let result = await ExamrecordModel.findAndCountAll({
				attributes: [
				  'userid',
				  'username',
				  'paperid',
				  'papername',
				  [Sequelize.fn('SUM', Sequelize.col('myscore')), 'myscore'],
				  [
					Sequelize.fn(
					  'ROUND',
					  Sequelize.literal(
						'CAST(SUM(CASE WHEN myscore > 0 THEN 1 ELSE 0 END) AS DECIMAL(10, 2)) / CAST(COUNT(myscore) AS DECIMAL(10, 2))'
					  ),
					  2
					),
					'accuracy'
				  ],
				  [
					Sequelize.fn('SUM', Sequelize.literal('CASE WHEN type = 4 AND ismark = 0 THEN 1 ELSE 0 END')),
					'ismark'
				  ]
				],
				where: where,
				group: ['userid', 'username', 'paperid', 'papername']
			  });
			result.currPage = page
			result.pageSize = limit

			toRes.page(res, 0, result)
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	//选项统计接口
	api.get('/options/num', async (req, res) => {
		try {
			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 5

			let where = {}
			if (jwt.decode(req.headers.token).role != '管理员' && ExamrecordModel.rawAttributes.hasOwnProperty('userid')) {
				where.userid = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).id : req.session.userinfo.id
				}
			}
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'jiaoshi') {
				where.jiaoshigonghao = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).jiaoshigonghao : req.session.userinfo.jiaoshigonghao
				}
				if (where['userid'] != undefined) {
					delete where.userid
				}
			}
			let paperid = req.query.paperid
			if (paperid) {
				where.paperid = {
					[Op.like]: paperid
				}
			}
			let result = await ExamrecordModel.findAndCountAll({
				attributes: [
 				  [Sequelize.fn('MAX', Sequelize.col('options')), 'options'],
				  [Sequelize.fn('MAX', Sequelize.col('questionname')), 'questionname'],
				  [Sequelize.fn('SUM', Sequelize.col('myscore')), 'myscore'],
				  [
					Sequelize.fn(
					  'ROUND',
					  Sequelize.literal(
						'CAST(SUM(CASE WHEN myscore > 0 THEN 1 ELSE 0 END) AS DECIMAL(10, 2)) / CAST(COUNT(myscore) AS DECIMAL(10, 2))'
					  ),
					  2
					),
					'accuracy'
				  ],
				  [
					Sequelize.fn('SUM', Sequelize.literal('CASE WHEN type = 4 AND ismark = 0 THEN 1 ELSE 0 END')),
					'ismark'
				  ],
				  [
					Sequelize.literal('CAST(SUM(CASE WHEN myanswer LIKE "%A%" THEN 1 ELSE 0 END) AS SIGNED)'),
            		'anum'
        		  ],
				  [
            		Sequelize.literal('CAST(SUM(CASE WHEN myanswer LIKE "%B%" THEN 1 ELSE 0 END) AS SIGNED)'),
            		'bnum'
        		  ],
				  [
            		Sequelize.literal('CAST(SUM(CASE WHEN myanswer LIKE "%C%" THEN 1 ELSE 0 END) AS SIGNED)'),
            		'cnum'
        		  ],
				  [
            		Sequelize.literal('CAST(SUM(CASE WHEN myanswer LIKE "%D%" THEN 1 ELSE 0 END) AS SIGNED)'),
            		'dnum'
        		  ],
				],
				where: where,
				group: ['questionid']
			  });
			result.currPage = page
			result.pageSize = limit
			toRes.page(res, 0, result)
		} catch(err) {
			res.status(500).send(err)
			//toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 当重新考试时，删除考生的某个试卷的所有考试记录
	api.post('/deleteRecords', async (req, res) => {

		try {

			await ExamrecordModel.destroy({
				where: {
				  userid: req.query.userid,
				  paperid: req.query.paperid
				}
			})

			toRes.session(res, 0, '删除成功！')
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})




	// 分组统计接口
	api.get('/group/:columnName', async (req, res) => {

		try {

			let sql = ""
			let columnName = req.params.columnName
			// let tableName = "examrecord"
			let where = " WHERE 1 = 1 "
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'jiaoshi') {
				where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			sql = "SELECT COUNT(*) AS total, " + columnName + " FROM examrecord " + where + " GROUP BY " + columnName 
			toRes.record(res, 0, await sequelize.query(sql, {
				plain: false,
				raw: true,
				type: QueryTypes.SELECT
			}))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 统计指定字段
	api.get('/value/:xColumnName/:yColumnName', async (req, res) => {

		try {

			let sql = ""
			let xColumnName = req.params.xColumnName
			let yColumnName = req.params.yColumnName
			let where = " WHERE 1 = 1 "
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName;
			if(tableName == 'jiaoshi') {
				where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			if ("examrecord" == "orders") {
				where += " AND status IN ('已支付', '已发货', '已完成') ";
			}

			sql = "SELECT " + xColumnName + ", SUM(" + yColumnName + ") AS total FROM examrecord " + where + " GROUP BY " + xColumnName + " DESC"
			
			toRes.record(res, 0, await sequelize.query(sql, {
				plain: false,
				raw: true,
				type: QueryTypes.SELECT
			}))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// (按值统计）时间统计类型(多)
	api.get('/valueMul/:xColumnName', async (req, res) => {

		try {	
			let sql = ""
			let xColumnName = req.params.xColumnName
			let yColumnName = req.query.yColumnNameMul
			let tableName = "examrecord"
			let where = " WHERE 1 = 1 "
			let userTableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName;
			if(userTableName == 'jiaoshi') {
				where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			const promises = yColumnName.split(',').map(async(item)=>{
				sql = "SELECT " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY " + xColumnName;
				const results = await sequelize.query(sql, {
					plain: false,
					raw: true,
					type: QueryTypes.SELECT
				});
				return results;
			})
            	
			toRes.record(res, 0, await Promise.all(promises))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// (按值统计）时间统计类型(多)
	api.get('/valueMul/:xColumnName/:timeStatType', async (req, res) => {

		try {	
			let sql = ""
			let xColumnName = req.params.xColumnName
			let yColumnName = req.query.yColumnNameMul
			let timeStatType = req.params.timeStatType
			let tableName = "examrecord"
			let where = " WHERE 1 = 1 "
			let userTableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName;
			if(userTableName == 'jiaoshi') {
				where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
			}

			const promises = yColumnName.split(',').map(async(item)=>{
				sql = "SELECT " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY " + xColumnName;
				if (config.dbConnection.dbtype.toLowerCase() == "mysql") {
            	    if (timeStatType == "日")
            	        sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y-%m-%d') " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y-%m-%d')";
            	    if (timeStatType == "月")
            	        sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y-%m') " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y-%m')";
            	    if (timeStatType == "年")
            	        sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y') " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y')";
            	} else {
            	    if (timeStatType == "日")
            	        sql = "SELECT DATE_FORMAT(VARCHAR(10)," + xColumnName + ", 120) " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(10)," + xColumnName + ", 120)";
            	    if (timeStatType == "月")
            	        sql = "SELECT DATE_FORMAT(VARCHAR(7)," + xColumnName + ", 120) " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(7)," + xColumnName + ", 120)";
            	    if (timeStatType == "年")
            	        sql = "SELECT DATE_FORMAT(VARCHAR(4)," + xColumnName + ", 120) " + xColumnName + ", sum(" + item + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(4)," + xColumnName + ", 120)";
            	}
				const results = await sequelize.query(sql, {
					plain: false,
					raw: true,
					type: QueryTypes.SELECT
				});
				return results;
			})
            	
			toRes.record(res, 0, await Promise.all(promises))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 按日期统计
	api.get('/value/:xColumnName/:yColumnName/:timeStatType', async (req, res) => {

		try {
			
			let sql = ""
			let xColumnName = req.params.xColumnName
			let yColumnName = req.params.yColumnName
			let timeStatType = req.params.timeStatType
			let tableName = "examrecord"
			let where = " WHERE 1 = 1 "
			let userTableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName;
			if(userTableName == 'jiaoshi') {
				where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			if ("examrecord" == "orders") {
				where += " AND status IN ('已支付', '已发货', '已完成') ";
			}

            if (config.dbConnection.dbtype.toLowerCase() == "mysql") {
                if (timeStatType == "日")
                    sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y-%m-%d') " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y-%m-%d')";
                if (timeStatType == "月")
                    sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y-%m') " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y-%m')";
                if (timeStatType == "年")
                    sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y') " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y')";
            } else {
                if (timeStatType == "日")
                    sql = "SELECT DATE_FORMAT(VARCHAR(10)," + xColumnName + ", 120) " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(10)," + xColumnName + ", 120)";
                if (timeStatType == "月")
                    sql = "SELECT DATE_FORMAT(VARCHAR(7)," + xColumnName + ", 120) " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(7)," + xColumnName + ", 120)";
                if (timeStatType == "年")
                    sql = "SELECT DATE_FORMAT(VARCHAR(4)," + xColumnName + ", 120) " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(4)," + xColumnName + ", 120)";
            }
			toRes.record(res, 0, await sequelize.query(sql, {
				plain: false,
				raw: true,
				type: QueryTypes.SELECT
			}))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})















	return api
}
