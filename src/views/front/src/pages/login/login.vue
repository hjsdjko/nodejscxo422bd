<template>
<div>
	<div class="container" :style='{"minHeight":"100vh","alignItems":"center","background":"url(http://codegen.caihongy.cn/20231014/825464b6febd4bf2946d4b4b656195e3.jpg)","display":"flex","width":"100%","backgroundSize":"cover","backgroundPosition":"center center","backgroundRepeat":"no-repeat","justifyContent":"center"}'>
		<el-form ref="loginForm" :model="loginForm" :style='{"padding":"80px 40px 30px 0","boxShadow":"0px 26px 26px -30px #999","margin":"100px auto","alignItems":"center","flexDirection":"column","display":"flex","justifyContent":"center","minHeight":"500px","borderRadius":"12px","flexWrap":"wrap","background":"radial-gradient(circle, rgba(245,245,245,1) 0%, rgba(255,255,255,1) 50%, rgba(245,245,245,1) 100%)","width":"35vw","position":"relative","height":"auto"}' :rules="rules">
			<div v-if="false" :style='{"width":"100%","margin":"0 0 10px 0","lineHeight":"44px","fontSize":"18px","color":"#333","textAlign":"center"}'>USER / LOGIN</div>
			<div v-if="true" :style='{"margin":"0 auto 10px","color":"#333","top":"-80px","textAlign":"center","width":"100%","letterSpacing":"2px","lineHeight":"44px","fontSize":"30px","position":"absolute","fontWeight":"500"}'>基于node的在线教育平台登录</div>
			<el-form-item v-if="loginType==1" class="list-item" :style='{"width":"80%","margin":"0 auto 20px"}' prop="username">
				<div v-if="true" :style='{"color":"#333","textAlign":"right","background":"none","display":"inline-block","width":"auto","lineHeight":"36px","fontSize":"14px","minWidth":"80px"}'>账号：</div>
				<input :style='{"padding":"0 10px","borderColor":"#ddd","color":"#666","borderRadius":"4px","borderWidth":"1px","width":"calc(100% - 80px)","fontSize":"14px","borderStyle":"solid","height":"40px"}' v-model="loginForm.username" placeholder="请输入账号">
			</el-form-item>
			<el-form-item v-if="loginType==1" class="list-item" :style='{"width":"80%","margin":"0 auto 20px"}' prop="password">
				<div v-if="true" :style='{"color":"#333","textAlign":"right","background":"none","display":"inline-block","width":"auto","lineHeight":"36px","fontSize":"14px","minWidth":"80px"}'>密码：</div>
				<input :style='{"padding":"0 10px","borderColor":"#ddd","color":"#666","borderRadius":"4px","borderWidth":"1px","width":"calc(100% - 80px)","fontSize":"14px","borderStyle":"solid","height":"40px"}' v-model="loginForm.password" placeholder="请输入密码" type="password">
			</el-form-item>

			<el-form-item v-if="roles.length>1" class="list-type" :style='{"width":"80%","margin":"0 auto 20px"}' prop="role">
				<el-radio v-model="loginForm.tableName" :label="item.tableName" v-for="(item, index) in roles" :key="index" @change.native="getCurrentRow(item)">{{item.roleName}}</el-radio>
			</el-form-item>

			  <div v-if="flag" class="mask" style="position: fixed;z-index: 998;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0,0,0,.5);"></div>
			  <!-- option2 -->
			  <div v-if="flag" class="box" :style='{"padding":"0 24px 24px","transform":"translate3d(-50%,-50%,0)","top":"50%","borderRadius":"20px","left":"50%","background":"#fff","position":"fixed","zIndex":999}'>
			    <span @click="flag = !flag" :style='{"cursor":"pointer","padding":"10px","top":"0","fontSize":"20px","position":"absolute","right":"0","zIndex":1}' class="icon iconfont guanbi icon-guanbi1"></span>
			    <div :style='{"lineHeight":"40px","fontSize":"18px","color":"#000","textAlign":"center"}'>身份验证</div>
			    <div id="option2" :style='{"width":"400px","padding":"20px","height":"auto"}'></div>
			  </div>
			
			<el-form-item class="list-btn" :style='{"width":"80%","margin":"0px auto"}'>
				<el-button v-if="loginType==1" :style='{"border":"0","cursor":"pointer","padding":"0 24px","boxShadow":"0px 0px 0px #075c06","margin":"0 0 0 80px","color":"#fff","display":"inline-block","letterSpacing":"4px","outline":"none","borderRadius":"4px","background":"#ff3d00","width":"calc(100% - 80px)","fontSize":"16px","height":"44px"}' @click="submitForm('loginForm')">登录</el-button>
				<el-button v-if="loginType==1" :style='{"border":"0","cursor":"pointer","padding":"0 24px","boxShadow":"0px 0px 0px #075c06","margin":"0 5px","color":"#333","textAlign":"right","display":"none","letterSpacing":"4px","outline":"none","borderRadius":"4px","background":"none","width":"auto","fontSize":"14px","height":"40px"}' @click="resetForm('loginForm')">重置</el-button>
			</el-form-item>
			<div :style='{"padding":"0 0 0 80px","margin":"20px auto","alignItems":"flex-start","flexWrap":"wrap","background":"none","display":"flex","width":"80%","justifyContent":"space-between"}'>
			<router-link :style='{"cursor":"pointer","border":"1px solid #ffffff50","padding":"0px","margin":"0 5px 0 0","color":"#333","borderRadius":"0px","background":"none","fontSize":"14px","textDecoration":"none"}' :to="{path: '/register', query: {role: item.tableName,pageFlag:'register'}}" v-if="item.hasFrontRegister=='是'" v-for="(item, index) in roles" :key="index">注册{{item.roleName.replace('注册','')}}</router-link>
			<router-link :style='{"cursor":"pointer","margin":"0px 0 0","color":"#666","textAlign":"right","background":"none","display":"inline-block","width":"auto","fontSize":"14px","textDecoration":"none"}' :to="{path: '/register', query: {pageFlag:'security1'}}">忘记密码?</router-link>
			</div>
			<div class="idea1" :style='{"top":"-19px","left":"0","background":"url() no-repeat center top","display":"none","width":"40vw","position":"absolute","height":"66px"}'></div>
			<div class="idea2" :style='{"width":"100%","background":"blue","display":"none","height":"40px"}'></div>
		</el-form>
    </div>
</div>
</template>

<script>
import menu from '@/config/menu'
export default {
	//数据集合
	data() {
		return {
            baseUrl: this.$config.baseUrl,
            loginType: 1,
			roleMenus: [],
			loginForm: {
				username: '',
				password: '',
				tableName: '',
				code: '',
			},
			role: '',
            roles: [],
			rules: {
				username: [
					{ required: true, message: '请输入账号', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
			codes: [{
				num: 1,
				color: '#000',
				rotate: '10deg',
				size: '16px'
			}, {
				num: 2,
				color: '#000',
				rotate: '10deg',
				size: '16px'
			}, {
				num: 3,
				color: '#000',
				rotate: '10deg',
				size: '16px'
			}, {
				num: 4,
				color: '#000',
				rotate: '10deg',
				size: '16px'
			}],
			flag: false,
			verifyCheck2: false,
		}
	},
  components: {
  },
	created() {
		this.roleMenus = menu.list()
		for(let item in this.roleMenus) {
		    if(this.roleMenus[item].hasFrontLogin=='是') {
		        this.roles.push(this.roleMenus[item]);
		    }
		}
		
	},
	mounted() {
	},
    //方法集合
    methods: {
		randomString() {
			var len = 4;
			var chars = [
			  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
			  'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
			  'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
			  'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
			  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2',
			  '3', '4', '5', '6', '7', '8', '9'
			]
			var colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
			var sizes = ['14', '15', '16', '17', '18']
			
			var output = []
			for (var i = 0; i < len; i++) {
			  // 随机验证码
			  var key = Math.floor(Math.random() * chars.length)
			  this.codes[i].num = chars[key]
			  // 随机验证码颜色
			  var code = '#'
			  for (var j = 0; j < 6; j++) {
			    var key = Math.floor(Math.random() * colors.length)
			    code += colors[key]
			  }
			  this.codes[i].color = code
			  // 随机验证码方向
			  var rotate = Math.floor(Math.random() * 45)
			  var plus = Math.floor(Math.random() * 2)
			  if (plus == 1) rotate = '-' + rotate
			  this.codes[i].rotate = 'rotate(' + rotate + 'deg)'
			  // 随机验证码字体大小
			  var size = Math.floor(Math.random() * sizes.length)
			  this.codes[i].size = sizes[size] + 'px'
			}
		},
      getCurrentRow(row) {
        this.role = row.roleName;
      },
      submitForm(formName) {
        if (this.roles.length!=1) {
            if (!this.role) {
                this.$message.error("请选择登录用户类型");
                return false;
            }
        } else {
            this.role = this.roles[0].roleName;
            this.loginForm.tableName = this.roles[0].tableName;
        }

		this.flag = true
		this.$nextTick(()=>{
			this.setVerify(formName)
		})
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
	  loginPost(formName) {
		this.$refs[formName].validate((valid) => {
		  if (valid) {
		    this.$http.get(`${this.loginForm.tableName}/login`, {params: this.loginForm}).then(res => {
		      if (res.data.code === 0) {
		        localStorage.setItem('frontToken', res.data.token);
		        localStorage.setItem('UserTableName', this.loginForm.tableName);
		        localStorage.setItem('username', this.loginForm.username);
		        // localStorage.setItem('adminName', this.loginForm.username);
		        localStorage.setItem('frontSessionTable', this.loginForm.tableName);
		        localStorage.setItem('frontRole', this.role);
		        localStorage.setItem('keyPath', 0);
		        this.$router.push('/');
		        this.$message({
		          message: '登录成功',
		          type: 'success',
		          duration: 1500,
		        });
		      } else {
		        this.$message.error(res.data.msg);
		      }
		    });
		  } else {
		    return false;
		  }
		});
	  },
	  setVerify(formName) {
	  // option2
	    $("#option2").pointsVerify({
	    	defaultNum: 4, //默认的文字数量
	    	checkNum: 2, //校对的文字数量
	    	vSpace: 5, //间隔
	    	imgName: [{"name":"图07.jpg","uid":1696646656759,"url":"http://codegen.caihongy.cn/20231007/008171b3abd746d0a1700080d8dffdfa.jpg","status":"success"},{"name":"图08.jpg","uid":1696646659124,"url":"http://codegen.caihongy.cn/20231007/6f93cdba33904b12b8061e437dd13be2.jpg","status":"success"},{"name":"图10.jpg","uid":1696646662200,"url":"http://codegen.caihongy.cn/20231007/f2a7b1b648534705803b812cf5346076.jpg","status":"success"}].map((item)=>{return item.url}),
	    	imgSize: {"width":"360px","height":"200px"},
	    	barSize: {"width":"360px","height":"40px"},
	    	ready: () => {},
	    	success: () => {
				setTimeout(()=>{
				  this.flag = false
				  this.loginPost(formName)
				},2500)
	    	}
	    })
	  },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.container {
		position: relative;
		background: url(http://codegen.caihongy.cn/20231014/825464b6febd4bf2946d4b4b656195e3.jpg);
		
		.el-form-item {
		  & /deep/ .el-form-item__content {
		    width: 100%;
		  }
		}
		
		.list-item /deep/ .el-form-item__content {
			display: flex;
			width: auto;
		}

		.list-code /deep/ .el-form-item__content {
			display: flex;
			width: 100%;
			justify-content: space-between;
		}

		.list-type /deep/ .el-form-item__content {
			padding: 0 0 0 80px;
			margin: 0;
			display: block;
		}

		.list-btn /deep/ .el-form-item__content {
			display: flex;
			flex-wrap: wrap;
			text-align: center;
		}
		
		.list-item /deep/ .el-input .el-input__inner {
			border-radius: 4px;
			padding: 0 10px;
			color: #666;
			width: calc(100% - 80px);
			font-size: 14px;
			border-color: #ddd;
			border-width: 1px;
			border-style: solid;
			height: 40px;
		}
		
		.list-code /deep/ .el-input .el-input__inner {
			padding: 0 10px;
			color: #666;
			display: inline-block;
			vertical-align: middle;
			font-size: 14px;
			border-color: #ddd;
			border-radius: 4px;
			outline: none;
			flex: 1;
			width: calc(100% - 110px);
			border-width: 1px;
			border-style: solid;
			height: 40px;
		}

		.list-type /deep/ .el-radio__input .el-radio__inner {
			background: rgba(53, 53, 53, 0);
			border-color: #666666;
		}
		.list-type /deep/ .el-radio__input.is-checked .el-radio__inner {
			background: #25b464;
			border-color: #25b464;
		}
		.list-type /deep/ .el-radio__label {
			color: #666666;
			font-size: 14px;
		}
		.list-type /deep/ .el-radio__input.is-checked+.el-radio__label {
			color: #25b464;
			font-size: 14px;
		}
	}

	// option2Style
	#option2 /deep/ .verify-img-panel {
				border-radius: 4px;
				margin: 0 0 5px;
				width: 360px;
				position: relative;
				height: 200px;
			}
	
	#option2 /deep/ .verify-img-panel .verify-refresh {
				cursor: pointer;
				padding: 5px;
				z-index: 2;
				top: 0;
				position: absolute;
				right: 0;
			}
	
	#option2 /deep/ .verify-img-panel .verify-refresh .iconfont {
				color: #fff;
				font-size: 20px;
				line-height: 1;
			}
	
	#option2 /deep/ .verify-img-panel canvas {
				width: 360px;
				height: 200px;
			}
	
	#option2 /deep/ .verify-bar-area {
				border: 1px solid #ddd;
				background: #FFFFFF;
				width: 360px;
				line-height: 40px;
				position: relative;
				text-align: center;
				height: 40px;
			}
	
	#option2 /deep/ .verify-bar-area span {
				color: #333;
				font-size: 16px;
			}
</style>
