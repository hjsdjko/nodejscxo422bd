<template>
	<div class="addEdit-block" :style='{"border":"0px solid #ddd","padding":"0px 7%","margin":"40px auto","color":"#333","borderRadius":"10px","background":"none","width":"calc(100% - 20px)","fontSize":"16px"}'>
		<el-form
			:style='{"border":"1px solid #ddd","padding":"40px","boxShadow":"0 0px 0px rgba(64, 158, 255, .3)","borderRadius":"10px","alignItems":"center","flexWrap":"wrap","background":"#fff","display":"flex","fontSize":"inherit"}'
			class="add-update-preview"
			ref="ruleForm"
			:model="ruleForm"
			:rules="rules"
			label-width="150px"
		>
			<template >
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="input" v-if="type!='info'"  label="名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="名称" clearable  :readonly="ro.name"></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else class="input" label="名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="名称" readonly></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="upload" v-if="type!='info' && !ro.picture" label="图片" prop="picture">
					<file-upload
						tip="点击上传图片"
						action="file/upload"
						:limit="3"
						:multiple="true"
						:fileUrls="ruleForm.picture?ruleForm.picture:''"
						@change="pictureUploadChange"
					></file-upload>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="upload" v-else-if="ruleForm.picture" label="图片" prop="picture">
					<img v-if="ruleForm.picture.substring(0,4)=='http'" class="upload-img" style="margin-right:20px;" v-bind:key="index" :src="ruleForm.picture.split(',')[0]" width="100" height="100">
					<img v-else class="upload-img" style="margin-right:20px;" v-bind:key="index" v-for="(item,index) in ruleForm.picture.split(',')" :src="$base.url+item" width="100" height="100">
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="input" v-if="type!='info'"  label="推荐类型" prop="inteltype">
					<el-input v-model="ruleForm.inteltype" placeholder="推荐类型" clearable  :readonly="ro.inteltype"></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else class="input" label="推荐类型" prop="inteltype">
					<el-input v-model="ruleForm.inteltype" placeholder="推荐类型" readonly></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="input" v-if="type!='info'"  label="备注" prop="remark">
					<el-input v-model="ruleForm.remark" placeholder="备注" clearable  :readonly="ro.remark"></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else class="input" label="备注" prop="remark">
					<el-input v-model="ruleForm.remark" placeholder="备注" readonly></el-input>
				</el-form-item>
			</template>
			<el-form-item :style='{"padding":"10px 0","margin":"0","alignItems":"center","textAlign":"center","display":"flex","width":"100%","perspective":"320px","-webkitPerspective":"320px","fontSize":"48px","justifyContent":"center"}' class="btn">
				<el-button class="btn3"  v-if="type!='info'" type="success" @click="onSubmit">
					<span class="icon iconfont icon-tijiao16" :style='{"color":"inherit","margin":"0 2px","fontSize":"18px"}'></span>
					保存
				</el-button>
				<el-button class="btn4" v-if="type!='info'" type="success" @click="back()">
					<span class="icon iconfont icon-quxiao09" :style='{"color":"inherit","margin":"0 2px","fontSize":"18px"}'></span>
					取消
				</el-button>
				<el-button class="btn5" v-if="type=='info'" type="success" @click="back()">
					<span class="icon iconfont icon-fanhui01" :style='{"color":"inherit","margin":"0 2px","fontSize":"18px"}'></span>
					返回
				</el-button>
			</el-form-item>
		</el-form>
    

  </div>
</template>
<script>
export default {
	data() {
		return {
			id: '',
			type: '',
			
			
			ro:{
				userid : false,
				refid : false,
				tablename : false,
				name : false,
				picture : false,
				type : false,
				inteltype : false,
				remark : false,
			},
			
			
			ruleForm: {
				userid: '',
				refid: '',
				tablename: '',
				name: '',
				picture: '',
				inteltype: '',
				remark: '',
			},
		

			
			rules: {
				userid: [
					{ required: true, message: '用户id不能为空', trigger: 'blur' },
				],
				refid: [
				],
				tablename: [
				],
				name: [
					{ required: true, message: '名称不能为空', trigger: 'blur' },
				],
				picture: [
				],
				type: [
				],
				inteltype: [
				],
				remark: [
				],
			}
		};
	},
	props: ["parent"],
	computed: {



	},
    components: {
    },
	created() {
	},
	methods: {
		
		// 下载
		download(file){
			window.open(`${file}`)
		},
		// 初始化
		init(id,type) {
			if (id) {
				this.id = id;
				this.type = type;
			}
			if(this.type=='info'||this.type=='else'){
				this.info(id);
			}else if(this.type=='logistics'){
				this.logistics=false;
				this.info(id);
			}else if(this.type=='cross'){
				var obj = this.$storage.getObj('crossObj');
				for (var o in obj){
						if(o=='userid'){
							this.ruleForm.userid = obj[o];
							this.ro.userid = true;
							continue;
						}
						if(o=='refid'){
							this.ruleForm.refid = obj[o];
							this.ro.refid = true;
							continue;
						}
						if(o=='tablename'){
							this.ruleForm.tablename = obj[o];
							this.ro.tablename = true;
							continue;
						}
						if(o=='name'){
							this.ruleForm.name = obj[o];
							this.ro.name = true;
							continue;
						}
						if(o=='picture'){
							this.ruleForm.picture = obj[o];
							this.ro.picture = true;
							continue;
						}
						if(o=='type'){
							this.ruleForm.type = obj[o];
							this.ro.type = true;
							continue;
						}
						if(o=='inteltype'){
							this.ruleForm.inteltype = obj[o];
							this.ro.inteltype = true;
							continue;
						}
						if(o=='remark'){
							this.ruleForm.remark = obj[o];
							this.ro.remark = true;
							continue;
						}
				}
			}
			
		},
    // 多级联动参数

    info(id) {
      this.$http({
        url: `storeup/info/${id}`,
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
        this.ruleForm = data.data;
        //解决前台上传图片后台不显示的问题
        let reg=new RegExp('../../../upload','g')//g代表全部
        } else {
          this.$message.error(data.msg);
        }
      });
    },


    // 提交
    onSubmit() {
	if(this.ruleForm.picture!=null) {
		this.ruleForm.picture = this.ruleForm.picture.replace(new RegExp(this.$base.url,"g"),"");
	}
var objcross = this.$storage.getObj('crossObj');
      //更新跨表属性
       var crossuserid;
       var crossrefid;
       var crossoptnum;
       if(this.type=='cross'){
                var statusColumnName = this.$storage.get('statusColumnName');
                var statusColumnValue = this.$storage.get('statusColumnValue');
                if(statusColumnName!='') {
                        var obj = this.$storage.getObj('crossObj');
                       if(statusColumnName && !statusColumnName.startsWith("[")) {
                               for (var o in obj){
                                 if(o==statusColumnName){
                                   obj[o] = statusColumnValue;
                                 }
                               }
                               var table = this.$storage.get('crossTable');
                             this.$http({
                                 url: `${table}/update`,
                                 method: "post",
                                 data: obj
                               }).then(({ data }) => {});
                       } else {
                               crossuserid=this.$storage.get('userid');
                               crossrefid=obj['id'];
                               crossoptnum=this.$storage.get('statusColumnName');
                               crossoptnum=crossoptnum.replace(/\[/,"").replace(/\]/,"");
                        }
                }
        }
		this.$refs["ruleForm"].validate(valid => {
			if (valid) {
				if(crossrefid && crossuserid) {
					this.ruleForm.crossuserid = crossuserid;
					this.ruleForm.crossrefid = crossrefid;
					let params = { 
						page: 1, 
						limit: 10, 
						crossuserid:this.ruleForm.crossuserid,
						crossrefid:this.ruleForm.crossrefid,
					} 
				this.$http({ 
					url: "storeup/page", 
					method: "get", 
					params: params 
				}).then(({ 
					data 
				}) => { 
					if (data && data.code === 0) { 
						if(data.data.total>=crossoptnum) {
							this.$message.error(this.$storage.get('tips'));
							return false;
						} else {
							this.$http({
								url: `storeup/${!this.ruleForm.id ? "save" : "update"}`,
								method: "post",
								data: this.ruleForm
							}).then(({ data }) => {
								if (data && data.code === 0) {
									this.$message({
										message: "操作成功",
										type: "success",
										duration: 1500,
										onClose: () => {
											this.parent.showFlag = true;
											this.parent.addOrUpdateFlag = false;
											this.parent.storeupCrossAddOrUpdateFlag = false;
											this.parent.search();
											this.parent.contentStyleChange();
										}
									});
								} else {
									this.$message.error(data.msg);
								}
							});

						}
					} else { 
				} 
			});
		} else {
			this.$http({
				url: `storeup/${!this.ruleForm.id ? "save" : "update"}`,
				method: "post",
			   data: this.ruleForm
			}).then(({ data }) => {
				if (data && data.code === 0) {
					this.$message({
						message: "操作成功",
						type: "success",
						duration: 1500,
						onClose: () => {
							this.parent.showFlag = true;
							this.parent.addOrUpdateFlag = false;
							this.parent.storeupCrossAddOrUpdateFlag = false;
							this.parent.search();
							this.parent.contentStyleChange();
						}
					});
				} else {
					this.$message.error(data.msg);
			   }
			});
		 }
         }
		});
    },
    // 获取uuid
    getUUID () {
      return new Date().getTime();
    },
    // 返回
    back() {
      this.parent.showFlag = true;
      this.parent.addOrUpdateFlag = false;
      this.parent.storeupCrossAddOrUpdateFlag = false;
      this.parent.contentStyleChange();
    },
    pictureUploadChange(fileUrls) {
	    this.ruleForm.picture = fileUrls;
    },
  }
};
</script>
<style lang="scss" scoped>
	.amap-wrapper {
		width: 100%;
		height: 500px;
	}
	
	.search-box {
		position: absolute;
	}
	
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
	.add-update-preview .el-input-number /deep/ .el-input__inner {
		text-align: left;
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
	.add-update-preview .el-input-number /deep/ .el-input-number__decrease {
		display: none;
	}
	.add-update-preview .el-input-number /deep/ .el-input-number__increase {
		display: none;
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
	
	.add-update-preview /deep/ .upload .upload-img {
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
	
	.add-update-preview .btn .btn1 {
				border: 0px solid rgba(19,161,230,.2);
				cursor: pointer;
				padding: 0 10px;
				margin: 0px 6px;
				color: #fff;
				display: inline-block;
				font-size: 16px;
				line-height: 24px;
				transition: 0.3s linear;
				border-radius: 4px;
				outline: none;
				background: linear-gradient(52deg, rgba(74,166,213,1) 0%, rgba(111,190,231,1) 30%, rgba(74,166,213,1) 100%),#00a8ff;
				width: auto;
				height: 60px;
			}
	
	.add-update-preview .btn .btn1:hover {
				box-shadow: 0 6px 0px rgba(89,195,255,.5);
				transform: rotateX(30deg);
			}
	
	.add-update-preview .btn .btn2 {
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
				background: linear-gradient(52deg, rgba(88,179,79,1) 0%, rgba(80,208,67,1) 30%, rgba(88,179,79,1) 100%),#58b34f;
				width: auto;
				height: 60px;
			}
	
	.add-update-preview .btn .btn2:hover {
				box-shadow: 0 6px 0px #c0eabc;
				transform: rotateX(30deg);
			}
	
	.add-update-preview .btn .btn3 {
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
	
	.add-update-preview .btn .btn3:hover {
				box-shadow: 0 6px 0px rgba(89,195,255,.5);
				transform: rotateX(30deg);
			}
	
	.add-update-preview .btn .btn4 {
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
				background: linear-gradient(52deg, rgba(147,147,147,1) 0%, rgba(196,196,196,1) 30%, rgba(147,147,147,1) 100%);
				width: auto;
				min-width: 100px;
				height: 60px;
			}
	
	.add-update-preview .btn .btn4:hover {
				box-shadow: 0 6px 0px #ccc;
				transform: rotateX(30deg);
			}
	
	.add-update-preview .btn .btn5 {
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
				background: linear-gradient(52deg, rgba(67,178,179,1) 0%, rgba(65,206,208,1) 30%, rgba(67,178,179,1) 100%),#43b2b3;
				width: auto;
				min-width: 100px;
				height: 60px;
			}
	
	.add-update-preview .btn .btn5:hover {
				box-shadow: 0 6px 0px #c3eff0;
				transform: rotateX(30deg);
			}
</style>
