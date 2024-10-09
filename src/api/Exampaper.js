import { version } from '../../package.json'
import { Router } from 'express'
import { Sequelize, Op,literal, QueryTypes } from 'sequelize'
import sequelize from '../models/sequelize'
import toRes from '../lib/toRes'
import ExampaperModel from '../models/ExampaperModel'
import util from '../lib/util'
import ExamrecordModel from '../models/ExamrecordModel'
import ExamquestionModel from '../models/ExamquestionModel'
import ExamquestionbankModel from '../models/ExamquestionbankModel'
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
			let name = req.query.name
			if (name) {

				if (name.indexOf('%') != -1) {
					where.name = {
						[Op.like]: name
					}
				} else {
					where.name = {
						[Op.eq]: name
					}
				}
			}
			let time = req.query.time
			if (time) {

				if (time.indexOf('%') != -1) {
					where.time = {
						[Op.like]: time
					}
				} else {
					where.time = {
						[Op.eq]: time
					}
				}
			}
			let status = req.query.status
			if (status) {

				if (status.indexOf('%') != -1) {
					where.status = {
						[Op.like]: status
					}
				} else {
					where.status = {
						[Op.eq]: status
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
			let result = await ExampaperModel.findAndCountAll({
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
			let result = await ExampaperModel.findAll()
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
			let result = await ExampaperModel.findOne({where:dictionary})
			
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
			let name = req.query.name
			if (name) {

				if (name.indexOf('%') != -1) {
					where.name = {
						[Op.like]: name
					}
				} else {
					where.name = {
						[Op.eq]: name
					}
				}
			}
			let status = req.query.status
			if (status) {
				where.status = {
					[Op.eq]: status
				}
			}


			let orders =[]
			const sortList = sort.split(",")
			const orderList = order.split(",")
			sortList.forEach((item, index) => {
				orders.push([item,orderList[index]])
			  });
			let result = await ExampaperModel.findAndCountAll({
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

		let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
        if(tableName == 'jiaoshi') {
            req.body.jiaoshigonghao =  jwt.decode(req.headers.token).jiaoshigonghao
        }


			const userinfo = await ExampaperModel.create(req.body)

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

		let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
        if(tableName == 'jiaoshi') {
            req.body.jiaoshigonghao =  jwt.decode(req.headers.token).jiaoshigonghao
        }




			const userinfo = await ExampaperModel.create(req.body)

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


			await ExampaperModel.update(req.body, {
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

			await ExampaperModel.destroy({
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


			toRes.record(res, 0, await ExampaperModel.findOne({ where: { id: req.params.id } }))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	//组卷接口
	api.post('/compose', async(req,res)=>{
		try {
			if (jwt.decode(req.headers.token) == null) {
				toRes.session(res, 401, '请登录后再操作', '', 401)
			}
			const paperid = req.query.paperid || 0;
			const papername = req.query.papername || "";
			const radioNum = req.query.radioNum || 0;
			const multipleChoiceNum = req.query.multipleChoiceNum || 0;
			const determineNum = req.query.determineNum || 0;
			const fillNum = req.query.fillNum || 0;
			const subjectivityNum = req.query.subjectivityNum || 0;

			let recordCount = await ExamrecordModel.count({
				where: {
					paperid: paperid
				}
			})
			if (recordCount > 0) {
				return toRes.session(res,10001,"已存在考试记录，无法重新组卷" );
			}
			//组卷之前删除该试卷之前的所有题目
			await ExamquestionModel.destroy({
				where: {
					paperid:paperid
				}
			})
			let where = {}
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'jiaoshi') {
				where.jiaoshigonghao = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).jiaoshigonghao : req.session.userinfo.jiaoshigonghao
				}
			}
			const questionList = [];
			// 单选题
			if (radioNum > 0) {
				where.type = {
					[Op.eq]:0
				}
				const radiocount = await ExamquestionbankModel.count({
					where
				})
				if (radiocount < radioNum) {
					return toRes.session(res,10001,"单选题库不足" );
				} else {// 随机选择指定数量的单选题
					const radioListQuery = await ExamquestionbankModel.findAll({
						where,
						order:Sequelize.literal('RAND()'),
						limit:parseInt(radioNum)
					});
				if (radioListQuery.length > 0) {
					questionList.push(...radioListQuery);
				}
			  }
			}
			
			// 多选题
			if (multipleChoiceNum > 0) {
				where.type = {
					[Op.eq]:1
				}
				const multipleChoiceNumcount = await ExamquestionbankModel.count({
					where
				})
				if (multipleChoiceNumcount < multipleChoiceNum) {
					return toRes.session(res,10001,"多选题库不足" );
				} else {
					const multipleChoiceNumList  = await ExamquestionbankModel.findAll({
						where,
						order:Sequelize.literal('RAND()'),
						limit:parseInt(multipleChoiceNum)
					})
					if (multipleChoiceNumList.length > 0) {
					  	questionList.push(...multipleChoiceNumList);
					}
			  }
			}
			
			// 判断题
			if (determineNum > 0) {
				where.type = {
					[Op.eq]:2
				}
				const determineNumcount = await ExamquestionbankModel.count({
					where
				})
				if (determineNumcount < determineNum) {
					return toRes.session(res,10001,"判断题库不足" );
				} else {
					const determineNumList  = await ExamquestionbankModel.findAll({
						where,
						order:Sequelize.literal('RAND()'),
						limit:parseInt(determineNum)
					})
					if (determineNumList.length > 0) {
						questionList.push(...determineNumList);
					}
				}
			}
			
			// 填空题
			if (fillNum > 0) {
				where.type = {
					[Op.eq]:3
				}
				const fillNumcount = await ExamquestionbankModel.count({where})
				if (fillNumcount < fillNum) {
					return toRes.session(res,10001,"填空题库不足" );
				} else {
					const fillNumList  = await ExamquestionbankModel.findAll({
						where,
						order:Sequelize.literal('RAND()'),
						limit:parseInt(fillNumcount)
					})
					if (fillNumList.length > 0) {
						questionList.push(...fillNumList);
					}
				}
			}
			
			// 主观题
			if (subjectivityNum > 0) {
				where.type = {
					[Op.eq]:4
				}
				const subjectivityNumcount = await ExamquestionbankModel.count({where})
				if (subjectivityNumcount < subjectivityNum) {
					return toRes.session(res,10001,"主观题库不足" );
				} else {
					const subjectivityNumList  = await ExamquestionbankModel.findAll({
						where,
						order:Sequelize.literal('RAND()'),
						limit:parseInt(subjectivityNum)
					})
					if (subjectivityNumList.length > 0) {
						questionList.push(...subjectivityNumList);
					}
				}
			}

			if (questionList.length > 0) {
				let seq = 0;
				const currentTimestamp = Date.now();
				for (const q of questionList) {
					const id = currentTimestamp + Math.floor(Math.random() * 1000);
					const questionname= q.questionname;
					const options= q.options;
					const score= q.score;
					const answer= q.answer;
					const analysis= q.analysis;
					const type= q.type;
					const sequence= seq + 1;
					const question = await ExamquestionModel.create({
						id: id,
						paperid: paperid,
						papername: papername,
						questionname: questionname,
						options: options,
						score: score,
						answer: answer,
						analysis: analysis,
						type: type,
						sequence: sequence
					  });
					seq++;
				}
			}
			
			return toRes.session(res,0,"组卷成功" );
		} catch(err) {
			console.log("err:"+err)
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	}
	)

    // 详情接口（前端）
	api.all('/detail/:id', async (req, res) => {

		try {


			toRes.record(res, 0, await ExampaperModel.findOne({ where: { id: req.params.id } }))
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
				if (req.query.remindstart) sql = "SELECT COUNT(*) AS count FROM exampaper WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "'"
				if (req.query.remindend) sql = "SELECT COUNT(*) AS count FROM exampaper WHERE " + where + " AND " + req.params.columnName + " <= '" + req.query.remindend + "'"

				if (req.query.remindstart && req.query.remindend) {
					sql = "SELECT COUNT(*) AS count FROM exampaper WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "' AND " + req.params.columnName + " <= '" + req.query.remindend + "'"
				}
			}

			if (req.params.type == 2) {
				if (req.query.remindstart) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM exampaper WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "'"
				}
				if (req.query.remindend) {
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM exampaper WHERE " + where + " AND " + req.params.columnName + " <= '" + remindEnd + "'"
				}

				if (req.query.remindstart && req.query.remindend) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM exampaper WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "' AND " + req.params.columnName + " <= '" + remindEnd + "'"
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










	// 分组统计接口
	api.get('/group/:columnName', async (req, res) => {

		try {

			let sql = ""
			let columnName = req.params.columnName
			// let tableName = "exampaper"
			let where = " WHERE 1 = 1 "
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'jiaoshi') {
				where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			sql = "SELECT COUNT(*) AS total, " + columnName + " FROM exampaper " + where + " GROUP BY " + columnName 
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
			if ("exampaper" == "orders") {
				where += " AND status IN ('已支付', '已发货', '已完成') ";
			}

			sql = "SELECT " + xColumnName + ", SUM(" + yColumnName + ") AS total FROM exampaper " + where + " GROUP BY " + xColumnName + " DESC"
			
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
			let tableName = "exampaper"
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
			let tableName = "exampaper"
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
			let tableName = "exampaper"
			let where = " WHERE 1 = 1 "
			let userTableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName;
			if(userTableName == 'jiaoshi') {
				where += " AND jiaoshigonghao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			if ("exampaper" == "orders") {
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
