<template>
  <div>
    <div class="container" :style='{"minHeight":"100vh","alignItems":"center","background":"url(http://codegen.caihongy.cn/20230831/8717112f349c4ea1b386f7081a8c0037.jpg)","display":"flex","width":"100%","backgroundSize":"cover","backgroundPosition":"center center","backgroundRepeat":"no-repeat","justifyContent":"flex-start"}'>
      <el-form :style='{"border":"0px solid #eee","padding":"40px 40px 180px 40px","boxShadow":"0 0px 0px rgba(64, 158, 255, .6)","margin":"0 0 0 10%","borderRadius":"0px","textAlign":"center","background":"rgba(255,255,255,1)","width":"33vw","fontSize":"16px","height":"auto"}'>
        <div v-if="true" :style='{"padding":"10px 10px 60px 0px","margin":"0px auto 30px","color":"#1a2a54","textAlign":"left","background":"url(http://codegen.caihongy.cn/20230817/bc0f2afdf937413c9713fe568111a929.png) no-repeat left bottom","display":"inline-block","width":"90%","lineHeight":"40px","fontSize":"30px","fontWeight":"600"}' class="title-container">基于node的在线教育平台登录</div>
        <div v-if="loginType==1" class="list-item" :style='{"width":"70%","margin":"0 auto 20px","position":"relative","alignItems":"center","flexWrap":"wrap","display":"flex"}'>
          <div v-if="true" class="lable" :style='{"color":"#666","left":"-150px","textAlign":"right","width":"150px","lineHeight":"44px","fontSize":"inherit","position":"absolute"}'>用户名：</div>
          <input :style='{"padding":"0 10px","borderColor":"#ccc","color":"#666","borderRadius":"4px","background":"#f8f8f8","borderWidth":"1px","width":"100%","fontSize":"inherit","borderStyle":"solid","height":"40px"}' placeholder="请输入用户名" name="username" type="text" v-model="rulesForm.username">
        </div>
        <div v-if="loginType==1" class="list-item" :style='{"width":"70%","margin":"0 auto 20px","position":"relative","alignItems":"center","flexWrap":"wrap","display":"flex"}'>
          <div v-if="true" class="lable" :style='{"color":"#666","left":"-150px","textAlign":"right","width":"150px","lineHeight":"44px","fontSize":"inherit","position":"absolute"}'>密码：</div>
          <input :style='{"padding":"0 10px","borderColor":"#ccc","color":"#666","borderRadius":"4px","background":"#f8f8f8","borderWidth":"1px","width":"100%","fontSize":"inherit","borderStyle":"solid","height":"40px"}' placeholder="请输入密码" name="password" type="password" v-model="rulesForm.password">
        </div>

        <div :style='{"width":"70%","margin":"20px auto","fontSize":"inherit","textAlign":"left"}' v-if="roles.length>1" prop="loginInRole" class="list-type">
          <el-radio v-if="loginType==1||(loginType==2&&item.roleName!='管理员')" v-for="item in roles" v-bind:key="item.roleName" v-model="rulesForm.role" :label="item.roleName">{{item.roleName}}</el-radio>
        </div>

		<div v-if="flag" class="mask" style="position: fixed;z-index: 998;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0,0,0,.5);"></div>
		<!-- option2 -->
		<div v-if="flag" class="box option2" :style='{"padding":"0 24px 24px","transform":"translate3d(-50%,-50%,0)","top":"50%","borderRadius":"20px","left":"50%","background":"#fff","position":"fixed","zIndex":999}'>
		  <span @click="flag = !flag" :style='{"cursor":"pointer","padding":"10px","top":"0","fontSize":"20px","position":"absolute","right":"0","zIndex":1}' class="icon iconfont icon-guanbi1 guanbi"></span>
		  <div :style='{"lineHeight":"40px","fontSize":"18px","color":"#000","textAlign":"center"}'>身份验证</div>
		  <div id="option2" :style='{"width":"400px","padding":"20px","height":"auto"}'></div>
		</div>
		
        <div :style='{"margin":"50px auto 0","alignItems":"center","flexWrap":"wrap","background":"none","display":"flex","width":"70%","fontSize":"16px","position":"relative","justifyContent":"flex-start"}'>
          <el-button v-if="loginType==1" :style='{"border":"0px solid #2a2d2e","cursor":"pointer","padding":"12px 20px","boxShadow":"inset 0px 0px 0px 0px rgba(19,161,230,.1)","margin":"0px 5px 0px","color":"#fff","minWidth":"180px","outline":"none","borderRadius":"4px","top":"85px","left":"80px","background":"#308ac4","width":"auto","fontSize":"18px","position":"absolute","fontWeight":"500","height":"auto"}' type="primary" @click="login()" class="loginInBt">登录</el-button>
        </div>
      </el-form>

    </div>
  </div>
</template>
<script>
import menu from "@/utils/menu";
export default {
  data() {
    return {
		verifyCheck2: false,
		flag: false,
      baseUrl:this.$base.url,
      loginType: 1,
      rulesForm: {
        username: "",
        password: "",
        role: "",
      },
      menus: [],
      roles: [],
      tableName: "",
    };
  },
  mounted() {
    let menus = menu.list();
    this.menus = menus;

    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].hasBackLogin=='是') {
        this.roles.push(this.menus[i])
      }
    }

  },
  created() {

  },
  destroyed() {
	    },
  components: {
  },
  methods: {
	setVerify() {
		this.flag = true


		this.$nextTick(() => {
			$('#option2').pointsVerify({
				defaultNum: 4, //默认的文字数量
				checkNum: 2, //校对的文字数量
				vSpace: 5, //间隔
				imgName: [{"name":"01.jpg","uid":1692340989158,"url":"http://codegen.caihongy.cn/20230818/54ac53deb4494ef08e500fe2abd462fd.jpg","status":"success"},{"name":"02.jpg","uid":1692340993224,"url":"http://codegen.caihongy.cn/20230818/95437097b9ea4afb85cdef66c3bc5a2b.jpg","status":"success"},{"name":"03.jpg","uid":1692340996633,"url":"http://codegen.caihongy.cn/20230818/a974d9f095174c3ab09f73ed33176ecc.jpg","status":"success"}].map((item)=>{return item.url}),
				imgSize: {"width":"360px","height":"200px"},
				barSize: {"width":"360px","height":"40px"},
				ready: () => {},
				success: () => {
				setTimeout(()=>{
				  this.flag = false
				  this.loginPost()
				},2500)
				}
			})
		})


	},

    //注册
    register(tableName){
		this.$storage.set("loginTable", tableName);
		this.$router.push({path:'/register',query:{pageFlag:'register'}})
    },
    // 登陆
    login() {

		if (!this.rulesForm.username) {
			this.$message.error("请输入用户名");
			return;
		}
		if (!this.rulesForm.password) {
			this.$message.error("请输入密码");
			return;
		}
		if(this.roles.length>1) {
			if (!this.rulesForm.role) {
				this.$message.error("请选择角色");
				return;
			}

			let menus = this.menus;
			for (let i = 0; i < menus.length; i++) {
				if (menus[i].roleName == this.rulesForm.role) {
					this.tableName = menus[i].tableName;
				}
			}
		} else {
			this.tableName = this.roles[0].tableName;
			this.rulesForm.role = this.roles[0].roleName;
		}
		

		this.setVerify()

    },
	loginPost() {
		this.$http({
			url: `${this.tableName}/login?username=${this.rulesForm.username}&password=${this.rulesForm.password}`,
			method: "post"
		}).then(({ data }) => {
			if (data && data.code === 0) {
				this.$storage.set("Token", data.token);
				this.$storage.set("role", this.rulesForm.role);
				this.$storage.set("sessionTable", this.tableName);
				this.$storage.set("adminName", this.rulesForm.username);
				this.$router.replace({ path: "/" });
			} else {
				this.$message.error(data.msg);
			}
		});
	},
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  position: relative;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
      background: url(http://codegen.caihongy.cn/20230831/8717112f349c4ea1b386f7081a8c0037.jpg);
        
  .list-item /deep/ .el-input .el-input__inner {
		border-radius: 4px;
		padding: 0 10px;
		color: #666;
		background: #f8f8f8;
		width: 100%;
		font-size: inherit;
		border-color: #ccc;
		border-width: 1px;
		border-style: solid;
		height: 40px;
	  }
  
  .list-item.select /deep/ .el-select .el-input__inner {
		border: 1px solid rgba(64, 158, 255, 1);
		padding: 0 10px;
		box-shadow: 0 0 6px rgba(64, 158, 255, .5);
		outline: 1px solid #efefef;
		color: rgba(64, 158, 255, 1);
		width: 288px;
		font-size: 14px;
		outline-offset: 4px;
		height: 44px;
	  }
  
  .list-code /deep/ .el-input .el-input__inner {
  	  	border-radius: 4px;
  	  	padding: 0 10px;
  	  	outline: none;
  	  	color: #666;
  	  	background: #f8f8f8;
  	  	width: calc(100% - 90px);
  	  	font-size: inherit;
  	  	border-color: #ccc;
  	  	border-width: 1px;
  	  	border-style: solid;
  	  	height: 40px;
  	  }

  .list-type /deep/ .el-radio__input .el-radio__inner {
		background: rgba(53, 53, 53, 0);
		border-color: #999;
	  }
  .list-type /deep/ .el-radio__input.is-checked .el-radio__inner {
        background: rgba(19,161,230,.5);
        border-color: rgba(19,161,230,.5);
      }
  .list-type /deep/ .el-radio__label {
		color: #666666;
		font-size: 16px;
	  }
  .list-type /deep/ .el-radio__input.is-checked+.el-radio__label {
        color: rgba(50,50,50,1);
        font-size: 16px;
      }
}

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
