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
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="input" v-if="type!='info'"  label="课程名称" prop="kechengmingcheng">
					<el-input v-model="ruleForm.kechengmingcheng" placeholder="课程名称" clearable  :readonly="ro.kechengmingcheng"></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else class="input" label="课程名称" prop="kechengmingcheng">
					<el-input v-model="ruleForm.kechengmingcheng" placeholder="课程名称" readonly></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="upload" v-if="type!='info' && !ro.kechengtupian" label="课程图片" prop="kechengtupian">
					<file-upload
						tip="点击上传课程图片"
						action="file/upload"
						:limit="3"
						:multiple="true"
						:fileUrls="ruleForm.kechengtupian?ruleForm.kechengtupian:''"
						@change="kechengtupianUploadChange"
					></file-upload>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="upload" v-else-if="ruleForm.kechengtupian" label="课程图片" prop="kechengtupian">
					<img v-if="ruleForm.kechengtupian.substring(0,4)=='http'" class="upload-img" style="margin-right:20px;" v-bind:key="index" :src="ruleForm.kechengtupian.split(',')[0]" width="100" height="100">
					<img v-else class="upload-img" style="margin-right:20px;" v-bind:key="index" v-for="(item,index) in ruleForm.kechengtupian.split(',')" :src="$base.url+item" width="100" height="100">
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="select" v-if="type!='info'"  label="课程分类" prop="kechengfenlei">
					<el-select :disabled="ro.kechengfenlei" v-model="ruleForm.kechengfenlei" placeholder="请选择课程分类" >
						<el-option
							v-for="(item,index) in kechengfenleiOptions"
							v-bind:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else class="input" label="课程分类" prop="kechengfenlei">
					<el-input v-model="ruleForm.kechengfenlei"
						placeholder="课程分类" readonly></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="upload" v-if="type!='info'&& !ro.kechengshipin" label="课程视频" prop="kechengshipin">
					<file-upload
						tip="点击上传课程视频"
						action="file/upload"
						:limit="1"
						:type="2"
						:multiple="true"
						:fileUrls="ruleForm.kechengshipin?ruleForm.kechengshipin:''"
						@change="kechengshipinUploadChange"
					></file-upload>
				</el-form-item> 
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else-if="ruleForm.kechengshipin" label="课程视频" prop="kechengshipin">
					<el-button :style='{"border":"0px solid #eee","cursor":"pointer","padding":"0 30px","margin":"0 20px 0 0","outline":"none","color":"inherit","borderRadius":"0px","background":"#91d2fd","width":"auto","lineHeight":"36px","fontSize":"16px","height":"40px"}' type="text" size="small" @click="download($base.url+ruleForm.kechengshipin)">预览</el-button>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else-if="!ruleForm.kechengshipin" label="课程视频" prop="kechengshipin">
					<el-button :style='{"border":"0px solid #eee","cursor":"pointer","padding":"0 30px","margin":"0 20px 0 0","outline":"none","color":"inherit","borderRadius":"0px","background":"#91d2fd","width":"auto","lineHeight":"36px","fontSize":"16px","height":"40px"}' type="text" size="small">无</el-button>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="upload" v-if="type!='info'&& !ro.xuexiziliao" label="学习资料" prop="xuexiziliao">
					<file-upload
						tip="点击上传学习资料"
						action="file/upload"
						:limit="1"
						:type="3"
						:multiple="true"
						:fileUrls="ruleForm.xuexiziliao?ruleForm.xuexiziliao:''"
						@change="xuexiziliaoUploadChange"
					></file-upload>
				</el-form-item>  
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else-if="ruleForm.xuexiziliao" label="学习资料" prop="xuexiziliao">
					<el-button :style='{"border":"0px solid #eee","cursor":"pointer","padding":"0 30px","margin":"0 20px 0 0","outline":"none","color":"inherit","borderRadius":"0px","background":"#a0e0e6","width":"auto","lineHeight":"36px","fontSize":"16px","height":"40px"}' type="text" size="small" @click="download($base.url+ruleForm.xuexiziliao)">下载</el-button>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else-if="!ruleForm.xuexiziliao" label="学习资料" prop="xuexiziliao">
					<el-button :style='{"border":"0px solid #eee","cursor":"pointer","padding":"0 30px","margin":"0 20px 0 0","outline":"none","color":"inherit","borderRadius":"0px","background":"#a0e0e6","width":"auto","lineHeight":"36px","fontSize":"16px","height":"40px"}' type="text" size="small">无</el-button>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="date" v-if="type!='info'" label="发布日期" prop="faburiqi">
					<el-date-picker
						format="yyyy 年 MM 月 dd 日"
						value-format="yyyy-MM-dd"
						v-model="ruleForm.faburiqi" 
						type="date"
						:readonly="ro.faburiqi"
						placeholder="发布日期"
					></el-date-picker> 
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="input" v-else-if="ruleForm.faburiqi" label="发布日期" prop="faburiqi">
					<el-input v-model="ruleForm.faburiqi" placeholder="发布日期" readonly></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="select" v-if="type!='info'" label="教师工号" prop="jiaoshigonghao">
					<el-select :disabled="ro.jiaoshigonghao" @change="jiaoshigonghaoChange" v-model="ruleForm.jiaoshigonghao" placeholder="请选择教师工号">
						<el-option
							v-for="(item,index) in jiaoshigonghaoOptions"
							v-bind:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="input" v-else-if="ruleForm.jiaoshigonghao" label="教师工号" prop="jiaoshigonghao">
					<el-input v-model="ruleForm.jiaoshigonghao" placeholder="教师工号" readonly></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' class="input" v-if="type!='info'"  label="联系电话" prop="lianxidianhua">
					<el-input v-model="ruleForm.lianxidianhua" placeholder="联系电话" clearable  :readonly="ro.lianxidianhua"></el-input>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else class="input" label="联系电话" prop="lianxidianhua">
					<el-input v-model="ruleForm.lianxidianhua" placeholder="联系电话" readonly></el-input>
				</el-form-item>
			</template>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-if="type!='info'"  label="课程描述" prop="kechengmiaoshu">
					<editor 
						style="min-width: 200px; max-width: 600px;"
						v-model="ruleForm.kechengmiaoshu" 
						class="editor" 
						action="file/upload">
					</editor>
				</el-form-item>
				<el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' v-else-if="ruleForm.kechengmiaoshu" label="课程描述" prop="kechengmiaoshu">
                    <span :style='{"fontSize":"16px","lineHeight":"40px","color":"inherit","fontWeight":"500","display":"inline-block"}' v-html="ruleForm.kechengmiaoshu"></span>
                </el-form-item>
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
import { 
	isIntNumer,
} from "@/utils/validate";
export default {
	data() {
		var validateIntNumber = (rule, value, callback) => {
			if(!value){
				callback();
			} else if (!isIntNumer(value)) {
				callback(new Error("请输入整数"));
			} else {
				callback();
			}
		};
		return {
			id: '',
			type: '',
			
			
			ro:{
				kechengmingcheng : false,
				kechengtupian : false,
				kechengfenlei : false,
				kechengshipin : false,
				xuexiziliao : false,
				kechengmiaoshu : false,
				faburiqi : false,
				jiaoshigonghao : false,
				lianxidianhua : false,
				thumbsupnum : false,
				crazilynum : false,
				clicktime : false,
				clicknum : false,
				discussnum : false,
				storeupnum : false,
			},
			
			
			ruleForm: {
				kechengmingcheng: '',
				kechengtupian: '',
				kechengfenlei: '',
				kechengshipin: '',
				xuexiziliao: '',
				kechengmiaoshu: '',
				faburiqi: '',
				jiaoshigonghao: '',
				lianxidianhua: '',
				clicktime: '',
			},
		
			kechengfenleiOptions: [],
			jiaoshigonghaoOptions: [],

			
			rules: {
				kechengmingcheng: [
					{ required: true, message: '课程名称不能为空', trigger: 'blur' },
				],
				kechengtupian: [
				],
				kechengfenlei: [
				],
				kechengshipin: [
				],
				xuexiziliao: [
				],
				kechengmiaoshu: [
				],
				faburiqi: [
				],
				jiaoshigonghao: [
					{ required: true, message: '教师工号不能为空', trigger: 'blur' },
				],
				lianxidianhua: [
				],
				thumbsupnum: [
					{ validator: validateIntNumber, trigger: 'blur' },
				],
				crazilynum: [
					{ validator: validateIntNumber, trigger: 'blur' },
				],
				clicktime: [
				],
				clicknum: [
					{ validator: validateIntNumber, trigger: 'blur' },
				],
				discussnum: [
					{ validator: validateIntNumber, trigger: 'blur' },
				],
				storeupnum: [
					{ validator: validateIntNumber, trigger: 'blur' },
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
		this.ruleForm.faburiqi = this.getCurDate()
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
						if(o=='kechengmingcheng'){
							this.ruleForm.kechengmingcheng = obj[o];
							this.ro.kechengmingcheng = true;
							continue;
						}
						if(o=='kechengtupian'){
							this.ruleForm.kechengtupian = obj[o];
							this.ro.kechengtupian = true;
							continue;
						}
						if(o=='kechengfenlei'){
							this.ruleForm.kechengfenlei = obj[o];
							this.ro.kechengfenlei = true;
							continue;
						}
						if(o=='kechengshipin'){
							this.ruleForm.kechengshipin = obj[o];
							this.ro.kechengshipin = true;
							continue;
						}
						if(o=='xuexiziliao'){
							this.ruleForm.xuexiziliao = obj[o];
							this.ro.xuexiziliao = true;
							continue;
						}
						if(o=='kechengmiaoshu'){
							this.ruleForm.kechengmiaoshu = obj[o];
							this.ro.kechengmiaoshu = true;
							continue;
						}
						if(o=='faburiqi'){
							this.ruleForm.faburiqi = obj[o];
							this.ro.faburiqi = true;
							continue;
						}
						if(o=='jiaoshigonghao'){
							this.ruleForm.jiaoshigonghao = obj[o];
							this.ro.jiaoshigonghao = true;
							continue;
						}
						if(o=='lianxidianhua'){
							this.ruleForm.lianxidianhua = obj[o];
							this.ro.lianxidianhua = true;
							continue;
						}
						if(o=='thumbsupnum'){
							this.ruleForm.thumbsupnum = obj[o];
							this.ro.thumbsupnum = true;
							continue;
						}
						if(o=='crazilynum'){
							this.ruleForm.crazilynum = obj[o];
							this.ro.crazilynum = true;
							continue;
						}
						if(o=='clicktime'){
							this.ruleForm.clicktime = obj[o];
							this.ro.clicktime = true;
							continue;
						}
						if(o=='clicknum'){
							this.ruleForm.clicknum = obj[o];
							this.ro.clicknum = true;
							continue;
						}
						if(o=='discussnum'){
							this.ruleForm.discussnum = obj[o];
							this.ro.discussnum = true;
							continue;
						}
						if(o=='storeupnum'){
							this.ruleForm.storeupnum = obj[o];
							this.ro.storeupnum = true;
							continue;
						}
				}
			}
			// 获取用户信息
			this.$http({
				url: `${this.$storage.get('sessionTable')}/session`,
				method: "get"
			}).then(({ data }) => {
				if (data && data.code === 0) {
					var json = data.data;
					if(((json.jiaoshigonghao!=''&&json.jiaoshigonghao) || json.jiaoshigonghao==0) && this.$storage.get("role")!="管理员"){
						this.ruleForm.jiaoshigonghao = json.jiaoshigonghao
						this.ro.jiaoshigonghao = true;
					}
					if(((json.lianxidianhua!=''&&json.lianxidianhua) || json.lianxidianhua==0) && this.$storage.get("role")!="管理员"){
						this.ruleForm.lianxidianhua = json.lianxidianhua
						this.ro.lianxidianhua = true;
					}
				} else {
					this.$message.error(data.msg);
				}
			});
            this.$http({
				url: `option/kechengfenlei/kechengfenlei`,
				method: "get"
            }).then(({ data }) => {
				if (data && data.code === 0) {
					this.kechengfenleiOptions = data.data;
				} else {
					this.$message.error(data.msg);
				}
            });
            this.$http({
				url: `option/jiaoshi/jiaoshigonghao`,
				method: "get"
            }).then(({ data }) => {
				if (data && data.code === 0) {
					this.jiaoshigonghaoOptions = data.data;
				} else {
					this.$message.error(data.msg);
				}
            });
			
		},
			// 下二随
			jiaoshigonghaoChange () {
				this.$http({
					url: `follow/jiaoshi/jiaoshigonghao?columnValue=`+ this.ruleForm.jiaoshigonghao,
					method: "get"
				}).then(({ data }) => {
					if (data && data.code === 0) {
						if(data.data.lianxidianhua){
							this.ruleForm.lianxidianhua = data.data.lianxidianhua
						}
					} else {
						this.$message.error(data.msg);
					}
				});
			},
    // 多级联动参数

    info(id) {
      this.$http({
        url: `kechengxinxi/info/${id}`,
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
        this.ruleForm = data.data;
        //解决前台上传图片后台不显示的问题
        let reg=new RegExp('../../../upload','g')//g代表全部
        this.ruleForm.kechengmiaoshu = this.ruleForm.kechengmiaoshu.replace(reg,'../../../nodejscxo422bd/upload');
        } else {
          this.$message.error(data.msg);
        }
      });
    },


    // 提交
    onSubmit() {
	if(this.ruleForm.kechengtupian!=null) {
		this.ruleForm.kechengtupian = this.ruleForm.kechengtupian.replace(new RegExp(this.$base.url,"g"),"");
	}
	if(this.ruleForm.kechengshipin!=null) {
		this.ruleForm.kechengshipin = this.ruleForm.kechengshipin.replace(new RegExp(this.$base.url,"g"),"");
	}
	if(this.ruleForm.xuexiziliao!=null) {
		this.ruleForm.xuexiziliao = this.ruleForm.xuexiziliao.replace(new RegExp(this.$base.url,"g"),"");
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
					url: "kechengxinxi/page", 
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
								url: `kechengxinxi/${!this.ruleForm.id ? "save" : "update"}`,
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
											this.parent.kechengxinxiCrossAddOrUpdateFlag = false;
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
				url: `kechengxinxi/${!this.ruleForm.id ? "save" : "update"}`,
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
							this.parent.kechengxinxiCrossAddOrUpdateFlag = false;
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
      this.parent.kechengxinxiCrossAddOrUpdateFlag = false;
      this.parent.contentStyleChange();
    },
    kechengtupianUploadChange(fileUrls) {
	    this.ruleForm.kechengtupian = fileUrls;
    },
    kechengshipinUploadChange(fileUrls) {
	    this.ruleForm.kechengshipin = fileUrls;
    },
    xuexiziliaoUploadChange(fileUrls) {
	    this.ruleForm.xuexiziliao = fileUrls;
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
