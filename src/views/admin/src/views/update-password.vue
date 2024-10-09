<template>
  <div :style='{"border":"0px solid #ddd","padding":"0px 7%","margin":"40px auto","color":"#333","borderRadius":"10px","background":"none","width":"calc(100% - 20px)","fontSize":"16px"}'>
    <el-form
	  :style='{"border":"1px solid #ddd","padding":"40px","boxShadow":"0 0px 0px rgba(64, 158, 255, .3)","borderRadius":"10px","alignItems":"center","flexWrap":"wrap","background":"#fff","display":"flex","fontSize":"inherit"}'
      class="add-update-preview"
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      label-width="150px"
    >
      <el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' label="原密码" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' label="新密码" prop="newpassword">
        <el-input v-model="ruleForm.newpassword" show-password></el-input>
      </el-form-item>
      <el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' label="确认密码" prop="repassword">
        <el-input v-model="ruleForm.repassword" show-password></el-input>
      </el-form-item>
      <el-form-item :style='{"padding":"10px 0","margin":"0","alignItems":"center","textAlign":"center","display":"flex","width":"100%","perspective":"320px","-webkitPerspective":"320px","fontSize":"48px","justifyContent":"center"}'>
		<el-button class="btn3" :style='{"border":"0px solid rgba(19,161,230,.2)","cursor":"pointer","padding":"0 10px","margin":"0px 6px","color":"#fff","minWidth":"100px","transition":"0.3s linear","outline":"none","borderRadius":"4px","background":"linear-gradient(52deg, rgba(74,166,213,1) 0%, rgba(111,190,231,1) 30%, rgba(74,166,213,1) 100%),#00a8ff","width":"auto","fontSize":"16px","lineHeight":"24px","height":"60px"}' type="primary" @click="onUpdateHandler">
			<span class="icon iconfont icon-tijiao16" :style='{"color":"inherit","margin":"0 2px","fontSize":"18px"}'></span>
			保存
		</el-button>
	  </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
	data() {
		return {
			dialogVisible: false,
			ruleForm: {},
			user: {},
			rules: {
				password: [
					{
						required: true,
						message: "密码不能为空",
						trigger: "blur"
					}
				],
				newpassword: [
					{
						required: true,
						message: "新密码不能为空",
						trigger: "blur"
					}
				],
				repassword: [
					{
						required: true,
						message: "确认密码不能为空",
						trigger: "blur"
					}
				]
			}
		};
	},
	mounted() {
		this.$http({
			url: `${this.$storage.get("sessionTable")}/session`,
			method: "get"
		}).then(({ data }) => {
			if (data && data.code === 0) {
				this.user = data.data;
			} else {
				this.$message.error(data.msg);
			}
		});
	},
	methods: {
		onLogout() {
			this.$storage.remove("Token");
			this.$router.replace({ name: "login" });
		},
		// 修改密码
		async onUpdateHandler() {
			this.$refs["ruleForm"].validate(async valid => {
				if (valid) {
					var password = "";
					if (this.user.mima) {
						password = this.user.mima;
					} else if (this.user.password) {
						password = this.user.password;
					}
					if(this.$storage.get("sessionTable")=='users'){
						if (this.ruleForm.password != password) {
							this.$message.error("原密码错误");
							return;
						}
						if (this.ruleForm.newpassword != this.ruleForm.repassword) {
							this.$message.error("两次密码输入不一致");
							return;
						}
						this.user.password = this.ruleForm.newpassword;
						this.user.mima = this.ruleForm.newpassword;
						this.$http({
							url: `${this.$storage.get("sessionTable")}/update`,
							method: "post",
							data: this.user
						}).then(({ data }) => {
							if (data && data.code === 0) {
								this.$message({
									message: "修改密码成功,下次登录系统生效",
									type: "success",
									duration: 1500,
									onClose: () => {
									}
								});
							} else {
								this.$message.error(data.msg);
							}
						});
						return false
					}
					if (this.ruleForm.password != password) {
						this.$message.error("原密码错误");
						return;
					}
					if (this.ruleForm.newpassword != this.ruleForm.repassword) {
						this.$message.error("两次密码输入不一致");
						return;
					}
					if (this.ruleForm.newpassword == this.ruleForm.password) {
						this.$message.error("新密码与原密码相同");
						return;
					}
					if (this.$storage.get("sessionTable") == 'jiaoshi') {
					}
					this.user.password = this.ruleForm.newpassword;
					this.user.mima = this.ruleForm.newpassword;
					this.$http({
						url: `${this.$storage.get("sessionTable")}/update`,
						method: "post",
						data: this.user
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: "修改密码成功,下次登录系统生效",
								type: "success",
								duration: 1500,
								onClose: () => {
								}
							});
						} else {
							this.$message.error(data.msg);
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
	.el-date-editor.el-input {
		width: auto;
	}
	
	.add-update-preview .el-form-item /deep/ .el-form-item__label {
	  	  padding: 0 10px 0 0;
	  	  color: inherit;
	  	  font-weight: 500;
	  	  display: inline-block;
	  	  width: 150px;
	  	  font-size: inherit;
	  	  line-height: 40px;
	  	  text-align: right;
	  	}
	
	.add-update-preview .el-form-item /deep/ .el-form-item__content {
	  margin-left: 150px;
	}
	
	.add-update-preview .el-input /deep/ .el-input__inner {
	  	  padding: 0 12px;
	  	  color: inherit;
	  	  font-size: 16px;
	  	  border-color: rgba(48,138,196,.5);
	  	  border-radius: 4px;
	  	  box-shadow: 0 0 0px rgba(64, 158, 255, .5);
	  	  outline: none;
	  	  background: rgba(255, 255, 255,1);
	  	  width: auto;
	  	  border-width: 1px;
	  	  border-style: solid;
	  	  min-width: 500px;
	  	  height: 40px;
	  	}
	
	.add-update-preview .el-select /deep/ .el-input__inner {
	  	  padding: 0 10px;
	  	  color: inherit;
	  	  font-size: 16px;
	  	  border-color: rgba(48,138,196,.5);
	  	  border-radius: 4px;
	  	  box-shadow: 0 0 0px rgba(64, 158, 255, .5);
	  	  outline: none;
	  	  background: rgba(255, 255, 255,1);
	  	  width: auto;
	  	  border-width: 1px;
	  	  border-style: solid;
	  	  min-width: 350px;
	  	  height: 40px;
	  	}
	
	.add-update-preview .el-date-editor /deep/ .el-input__inner {
	  	  padding: 0 10px 0 30px;
	  	  color: inherit;
	  	  font-size: 16px;
	  	  border-color: rgba(48,138,196,.5);
	  	  border-radius: 4px;
	  	  box-shadow: 0 0 0px rgba(64, 158, 255, .5);
	  	  outline: none;
	  	  background: rgba(255, 255, 255,1);
	  	  width: auto;
	  	  border-width: 1px;
	  	  border-style: solid;
	  	  min-width: 400px;
	  	  height: 40px;
	  	}
	
	.add-update-preview /deep/ .el-upload--picture-card {
		background: transparent;
		border: 0;
		border-radius: 0;
		width: auto;
		height: auto;
		line-height: initial;
		vertical-align: middle;
	}
	
	.add-update-preview /deep/ .el-upload-list .el-upload-list__item {
	  	  border: 1px solid rgba(48,138,196,.5);
	  	  cursor: pointer;
	  	  border-radius: 4px;
	  	  color: rgba(48,138,196,.6);
	  	  background: rgba(255, 255, 255,1);
	  	  object-fit: cover;
	  	  width: 250px;
	  	  font-size: 42px;
	  	  line-height: 120px;
	  	  text-align: center;
	  	  height: 120px;
	  	}
	
	.add-update-preview /deep/ .el-upload .el-icon-plus {
	  	  border: 1px solid rgba(48,138,196,.5);
	  	  cursor: pointer;
	  	  border-radius: 4px;
	  	  color: rgba(48,138,196,.6);
	  	  background: rgba(255, 255, 255,1);
	  	  object-fit: cover;
	  	  width: 250px;
	  	  font-size: 42px;
	  	  line-height: 120px;
	  	  text-align: center;
	  	  height: 120px;
	  	}
	
	.add-update-preview .el-textarea /deep/ .el-textarea__inner {
	  	  border: 1px solid rgba(48,138,196,.5);
	  	  border-radius: 4px;
	  	  padding: 12px;
	  	  box-shadow: 0 0 0px rgba(64, 158, 255, .5);
	  	  outline: none;
	  	  color: inherit;
	  	  background: rgba(255, 255, 255,1);
	  	  width: 500px;
	  	  font-size: 16px;
	  	  height: 140px;
	  	}
	
	.add-update-preview .btn3 {
				border: 0px solid rgba(19,161,230,.2);
				cursor: pointer;
				padding: 0 10px;
				margin: 0px 6px;
				color: #fff;
				font-size: 16px;
				line-height: 24px;
				transition: 0.3s linear;
				border-radius: 4px;
				outline: none;
				background: linear-gradient(52deg, rgba(74,166,213,1) 0%, rgba(111,190,231,1) 30%, rgba(74,166,213,1) 100%),#00a8ff;
				width: auto;
				min-width: 100px;
				height: 60px;
			}
	
	.add-update-preview .btn3:hover {
				box-shadow: 0 6px 0px rgba(89,195,255,.5);
				transform: rotateX(30deg);
			}
</style>
