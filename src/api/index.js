import { Router } from 'express'
import UsersController from './Users'
import FileController from './File'
import ConfigController from './Config'
import CommonController from './Common'
import YonghuController from './Yonghu'
import JiaoshiController from './Jiaoshi'
import KechengfenleiController from './Kechengfenlei'
import KechengxinxiController from './Kechengxinxi'
import ChatController from './Chat'
import ForumController from './Forum'
import ExampaperController from './Exampaper'
import ExamquestionController from './Examquestion'
import ExamquestionbankController from './Examquestionbank'
import ExamrecordController from './Examrecord'
import NewstypeController from './Newstype'
import NewsController from './News'
import StoreupController from './Storeup'
import AboutusController from './Aboutus'
import FriendlinkController from './Friendlink'
import DiscusskechengxinxiController from './Discusskechengxinxi'

export default ({ config, db }) => {
	let api = Router()

	api.use('/users', UsersController({ config, db }))

	api.use('/file', FileController({ config, db }))

	api.use('/config', ConfigController({ config, db }))

	api.use('/', CommonController({ config, db }))

	api.use('/yonghu', YonghuController({ config, db }))

	api.use('/jiaoshi', JiaoshiController({ config, db }))

	api.use('/kechengfenlei', KechengfenleiController({ config, db }))

	api.use('/kechengxinxi', KechengxinxiController({ config, db }))

	api.use('/chat', ChatController({ config, db }))

	api.use('/forum', ForumController({ config, db }))

	api.use('/exampaper', ExampaperController({ config, db }))

	api.use('/examquestion', ExamquestionController({ config, db }))

	api.use('/examquestionbank', ExamquestionbankController({ config, db }))

	api.use('/examrecord', ExamrecordController({ config, db }))

	api.use('/newstype', NewstypeController({ config, db }))

	api.use('/news', NewsController({ config, db }))

	api.use('/storeup', StoreupController({ config, db }))

	api.use('/aboutus', AboutusController({ config, db }))

	api.use('/friendlink', FriendlinkController({ config, db }))

	api.use('/discusskechengxinxi', DiscusskechengxinxiController({ config, db }))

	return api
}
