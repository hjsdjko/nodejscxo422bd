<template>
	<div class="main-content" :style='{"border":"1px solid #ddd","minHeight":"100vh","padding":"20px 30px 30px","margin":"40px auto","color":"#333","borderRadius":"10px","background":"#eee","width":"calc(100% - 20px)","fontSize":"16px","position":"relative","height":"100%"}'>
		<!-- 列表页 -->
		<template v-if="showFlag">
			<el-form class="center-form-pv" :style='{"padding":"0px 10px 20px","margin":"0px","color":"#333","flexWrap":"wrap","background":"rgba(255,255,255,0)","display":"flex","width":"calc(100% - 250px)","fontSize":"inherit","position":"relative","justifyContent":"center"}' :inline="true" :model="searchForm">
				<el-row :style='{"width":"auto","margin":"0 50px 0 0","fontSize":"inherit","alignItems":"center","justifyContent":"center","display":"flex"}' >
					<div :style='{"margin":"0 10px 0 0","fontSize":"inherit","display":"inline-block"}'>
						<label :style='{"margin":"0 10px 0 0","color":"inherit","display":"inline-block","lineHeight":"40px","fontSize":"inherit","fontWeight":"500","height":"40px"}' class="item-label">标题</label>
						<el-input v-model="searchForm.title" placeholder="标题" @keydown.enter.native="search()" clearable></el-input>
					</div>
					<el-button class="search" type="success" @click="search()">
						<span class="icon iconfont icon-chakan12" :style='{"margin":"0 2px","fontSize":"inherit","color":"inherit","display":"none","height":"40px"}'></span>
						搜索
					</el-button>
				</el-row>

				<el-row class="actions" :style='{"margin":"0","color":"#fff","alignItems":"flex-start","textAlign":"left","display":"block","-webkitPerspective":"320px","right":"-230px","justifyContent":"space-between","top":"0px","flexWrap":"wrap","background":"none","width":"140px","perspective":"320px","fontSize":"16px","position":"absolute","zIndex":"999"}'>
					<el-button class="add" v-if="isAuth('news','新增')" type="success" @click="addOrUpdateHandler()">
						<span class="icon iconfont icon-tianjia13" :style='{"color":"inherit","margin":"0 2px","fontSize":"inherit"}'></span>
						增加
					</el-button>
					<el-button class="del" v-if="isAuth('news','删除')" :disabled="dataListSelections.length?false:true" type="danger" @click="deleteHandler()">
						<span class="icon iconfont icon-shanchu7" :style='{"margin":"0 2px","fontSize":"inherit","color":"inherit","height":"40px"}'></span>
						删除
					</el-button>



				</el-row>
			</el-form>
			<div :style='{"padding":"0","borderColor":"rgba(48,138,196,.3)","margin":"10px 0 0","borderRadius":"10px 10px 4px 4px","background":"rgba(255,255,255,1)","borderWidth":"1px 0","width":"calc(100% - 250px)","borderStyle":"solid"}'>
				<el-table class="tables"
					:stripe='true'
					:style='{"padding":"0","borderColor":"rgba(48,138,196,.3)","color":"inherit","borderRadius":"10px 10px 4px 4px","borderWidth":"0 1px","background":"none","width":"100%","fontSize":"inherit","borderStyle":"solid"}' 
					:border='true'
					v-if="isAuth('news','查看')"
					:data="dataList"
					v-loading="dataListLoading"
				@selection-change="selectionChangeHandler">
					<el-table-column :resizable='true' type="selection" align="center" width="50"></el-table-column>
					<el-table-column :resizable='true' :sortable='true' label="序号" type="index" width="50" />
					<el-table-column :resizable='true' :sortable='true'  
						prop="title"
						label="标题">
						<template slot-scope="scope">
							{{scope.row.title}}
						</template>
					</el-table-column>
					<el-table-column :resizable='true' :sortable='true'  
						prop="typename"
						label="分类名称">
						<template slot-scope="scope">
							{{scope.row.typename}}
						</template>
					</el-table-column>
					<el-table-column :resizable='true' :sortable='true'  
						prop="name"
						label="发布人">
						<template slot-scope="scope">
							{{scope.row.name}}
						</template>
					</el-table-column>
					<el-table-column :resizable='true' :sortable='true'  
						prop="clicknum"
						label="点击次数">
						<template slot-scope="scope">
							{{scope.row.clicknum}}
						</template>
					</el-table-column>
					<el-table-column :resizable='true' :sortable='true'  
						prop="storeupnum"
						label="收藏数">
						<template slot-scope="scope">
							{{scope.row.storeupnum}}
						</template>
					</el-table-column>
					<el-table-column :resizable='true' :sortable='true' prop="picture" width="200" label="图片">
						<template slot-scope="scope">
							<div v-if="scope.row.picture">
								<img v-if="scope.row.picture.substring(0,4)=='http'" :src="scope.row.picture.split(',')[0]" width="100" height="100" style="object-fit: cover" @click="imgPreView(scope.row.picture.split(',')[0])">
								<img v-else :src="$base.url+scope.row.picture.split(',')[0]" width="100" height="100" style="object-fit: cover" @click="imgPreView($base.url+scope.row.picture.split(',')[0])">
							</div>
							<div v-else>无图片</div>
						</template>
					</el-table-column>
					<el-table-column width="300" label="操作">
						<template slot-scope="scope">
							<el-button class="view" v-if=" isAuth('news','查看')" type="success" @click="addOrUpdateHandler(scope.row.id,'info')">
								<span class="icon iconfont icon-chakan12" :style='{"margin":"0 2px","fontSize":"inherit","color":"inherit","height":"40px"}'></span>
								浏览
							</el-button>
							<el-button class="edit" v-if=" isAuth('news','修改') " type="success" @click="addOrUpdateHandler(scope.row.id)">
								<span class="icon iconfont icon-xiugai6" :style='{"margin":"0 2px","fontSize":"inherit","color":"inherit","height":"40px"}'></span>
								修改
							</el-button>




							<el-button class="del" v-if="isAuth('news','删除') " type="primary" @click="deleteHandler(scope.row.id )">
								<span class="icon iconfont icon-guanbi1" :style='{"margin":"0 2px","fontSize":"inherit","color":"inherit","height":"40px"}'></span>
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-pagination
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
				:current-page="pageIndex"
				background
				:page-sizes="[10, 50, 100, 200]"
				:page-size="pageSize"
				:layout="layouts.join()"
				:total="totalPage"
				prev-text="上一页 "
				next-text="下一页 "
				:hide-on-single-page="false"
				:style='{"padding":"20px 0 20px","margin":"10px 0 0","whiteSpace":"nowrap","color":"inherit","borderRadius":"4px","textAlign":"center","background":"rgba(48,138,196,.6)","width":"calc(100% - 250px)","fontSize":"inherit","fontWeight":"500"}'
			></el-pagination>
		</template>
		
		<!-- 添加/修改页面  将父组件的search方法传递给子组件-->
		<add-or-update v-if="addOrUpdateFlag" :parent="this" ref="addOrUpdate"></add-or-update>





		<el-dialog title="预览图" :visible.sync="previewVisible" width="50%">
			<img :src="previewImg" alt="" style="width: 100%;">
		</el-dialog>
	</div>
</template>

<script>
import axios from 'axios'
import AddOrUpdate from "./add-or-update";
	export default {
		data() {
			return {
				searchForm: {
					key: ""
				},
				form:{},
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				showFlag: true,
				addOrUpdateFlag:false,
				layouts: ["total","prev","pager","next","sizes","jumper"],
				previewImg: '',
				previewVisible: false,
			};
		},
		created() {
			this.init();
			this.getDataList();
			this.contentStyleChange()
		},
		mounted() {
		},
		filters: {
			htmlfilter: function (val) {
				return val.replace(/<[^>]*>/g).replace(/undefined/g,'');
			}
		},
		computed: {
			tablename(){
				return this.$storage.get('sessionTable')
			},
		},
		components: {
			AddOrUpdate,
		},
		methods: {
			imgPreView(url){
				this.previewImg = url
				this.previewVisible = true
			},
			contentStyleChange() {
				this.contentPageStyleChange()
			},
			// 分页
			contentPageStyleChange(){
				let arr = []

				// if(this.contents.pageTotal) arr.push('total')
				// if(this.contents.pageSizes) arr.push('sizes')
				// if(this.contents.pagePrevNext){
				//   arr.push('prev')
				//   if(this.contents.pagePager) arr.push('pager')
				//   arr.push('next')
				// }
				// if(this.contents.pageJumper) arr.push('jumper')
				// this.layouts = arr.join()
				// this.contents.pageEachNum = 10
			},






    init () {
    },
    search() {
      this.pageIndex = 1;
      this.getDataList();
    },

    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      let params = {
        page: this.pageIndex,
        limit: this.pageSize,
        sort: 'id',
        order: 'desc',
      }
           if(this.searchForm.title!='' && this.searchForm.title!=undefined){
            params['title'] = '%' + this.searchForm.title + '%'
          }
			let user = JSON.parse(this.$storage.getObj('userForm'))
			console.log(user)
			this.$http({
				url: "news/page",
				method: "get",
				params: params
			}).then(({ data }) => {
				if (data && data.code === 0) {
					this.dataList = data.data.list;
					this.totalPage = data.data.total;
				} else {
					this.dataList = [];
					this.totalPage = 0;
				}
				this.dataListLoading = false;
			});
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandler(val) {
      this.dataListSelections = val;
    },
    // 添加/修改
    addOrUpdateHandler(id,type) {
      this.showFlag = false;
      this.addOrUpdateFlag = true;
      this.crossAddOrUpdateFlag = false;
      if(type!='info'){
        type = 'else';
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id,type);
      });
    },
    // 查看评论
    disscussListHandler(id,type) {
	this.$router.push({path:'/discussnews',query:{refid:id}});
    },
    // 下载
    download(file){
      let arr = file.replace(new RegExp('upload/', "g"), "")
      axios.get(this.$base.url + 'file/download?fileName=' + arr, {
      	headers: {
      		token: this.$storage.get('Token')
      	},
      	responseType: "blob"
      }).then(({
      	data
      }) => {
      	const binaryData = [];
      	binaryData.push(data);
      	const objectUrl = window.URL.createObjectURL(new Blob(binaryData, {
      		type: 'application/pdf;chartset=UTF-8'
      	}))
      	const a = document.createElement('a')
      	a.href = objectUrl
      	a.download = arr
      	// a.click()
      	// 下面这个写法兼容火狐
      	a.dispatchEvent(new MouseEvent('click', {
      		bubbles: true,
      		cancelable: true,
      		view: window
      	}))
      	window.URL.revokeObjectURL(data)
      },err=>{
		  axios.get((location.href.split(this.$base.name).length>1 ? location.href.split(this.$base.name)[0] :'') + this.$base.name + '/file/download?fileName=' + arr, {
		  	headers: {
		  		token: this.$storage.get('Token')
		  	},
		  	responseType: "blob"
		  }).then(({
		  	data
		  }) => {
		  	const binaryData = [];
		  	binaryData.push(data);
		  	const objectUrl = window.URL.createObjectURL(new Blob(binaryData, {
		  		type: 'application/pdf;chartset=UTF-8'
		  	}))
		  	const a = document.createElement('a')
		  	a.href = objectUrl
		  	a.download = arr
		  	// a.click()
		  	// 下面这个写法兼容火狐
		  	a.dispatchEvent(new MouseEvent('click', {
		  		bubbles: true,
		  		cancelable: true,
		  		view: window
		  	}))
		  	window.URL.revokeObjectURL(data)
		  })
	  })
    },
	// 预览
	preClick(file){
		if(!file){
			return false
		}
		window.open((location.href.split(this.$base.name).length>1 ? location.href.split(this.$base.name)[0] + this.$base.name + '/' + file :this.$base.url + file))
	},
	newsstatusChange(e,row){
		if(row.status==0){
			row.passwordwrongnum = 0
		}
		this.$http({
			url:'news/update',
			method:'post',
			data:row
		}).then(res=>{
			if(row.status==1){
				this.$message.error('该用户已锁定')
			}else{
				this.$message.success('该用户已解除锁定')
			}
		})
	},
    // 删除
    async deleteHandler(id ) {
		var ids = id? [Number(id)]: this.dataListSelections.map(item => {
			return Number(item.id);
		});
		await this.$confirm(`确定进行[${id ? "删除" : "批量删除"}]操作?`, "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(async () => {
			await this.$http({
				url: "news/delete",
				method: "post",
				data: ids
			}).then(async ({ data }) => {
				if (data && data.code === 0) {
					for(let x in ids){
						await this.$http.get('storeup/list',{params: {
							page: 1,
							limit: 100,
							refid: ids[x],
							tablename: 'news'
						}}).then(async obj=>{
							if(obj.data&&obj.data.code==0){
								if(obj.data.data.list.length){
									let arr = []
									for(let i in obj.data.data.list){
										arr.push(obj.data.data.list[i].id)
									}
									await this.$http.post('storeup/delete',arr).then(()=>{})
								}
							}
						})
					}
					this.$message({
						message: "操作成功",
						type: "success",
						duration: 1500,
						onClose: () => {
							this.search();
						}
					});
            
				} else {
					this.$message.error(data.msg);
				}
			});
		});
    },


  }

};
</script>
<style lang="scss" scoped>
	
	.center-form-pv {
	  .el-date-editor.el-input {
	    width: auto;
	  }
	}
	
	.el-input {
	  width: auto;
	}
	
	// form
	.center-form-pv .el-input /deep/ .el-input__inner {
				border-radius: 0px;
				padding: 0 12px;
				outline: none;
				color: inherit;
				background: none;
				width: 170px;
				font-size: 16px;
				border-color: #999;
				border-width: 0 0 1px;
				border-style: solid;
				height: 40px;
			}
	
	.center-form-pv .el-select /deep/ .el-input__inner {
				border-radius: 0px;
				padding: 0 10px;
				outline: none;
				color: inherit;
				background: none;
				width: 170px;
				font-size: 16px;
				border-color: #999;
				border-width: 0 0 1px;
				border-style: solid;
				height: 40px;
			}
	
	.center-form-pv .el-date-editor /deep/ .el-input__inner {
				border-radius: 0px;
				padding: 0 10px 0 30px;
				outline: none;
				color: inherit;
				background: none;
				width: 170px;
				font-size: 16px;
				border-color: #999;
				border-width: 0 0 1px;
				border-style: solid;
				height: 40px;
			}
	
	.center-form-pv .search {
				border: 0px solid #47defa;
				cursor: pointer;
				border-radius: 4px;
				padding: 0 24px;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(75,180,247,1) 0%, rgba(48,138,196,1) 100%);
				width: 100px;
				font-size: inherit;
				height: 40px;
			}
	
	.center-form-pv .search:hover {
			}
	
	.center-form-pv .actions .add {
				cursor: pointer;
				padding: 0 10px;
				margin: 4px 0 5px 0;
				color: inherit;
				font-size: inherit;
				border-color: #eee;
				transition: 0.3s linear;
				border-radius: 6px;
				background: linear-gradient(52deg, rgba(74,166,213,1) 0%, rgba(111,190,231,1) 30%, rgba(74,166,213,1) 100%),#00a8ff;
				width: 100%;
				border-width: 0px;
				border-style: solid;
				height: 42px;
			}
	
	.center-form-pv .actions .add:hover {
				box-shadow: 0 1px 3px rgba(89,195,255,.5);
				transform: rotateY(30deg);
			}
	
	.center-form-pv .actions .del {
				cursor: pointer;
				padding: 0 10px;
				margin: 4px 0 5px 0;
				color: inherit;
				font-size: inherit;
				border-color: #fff;
				transition: 0.3s linear;
				border-radius: 4px;
				outline: none;
				background: linear-gradient(52deg, rgba(204,0,0,1) 0%, rgba(213,72,72,1) 30%, rgba(204,0,0,1) 100%),#c00;
				width: 100%;
				border-width: 0px;
				border-style: solid;
				height: 42px;
			}
	
	.center-form-pv .actions .del:hover {
				box-shadow: 0 1px 3px #f4d1d1;
				transform: rotateY(-30deg);
			}
	
	.center-form-pv .actions .statis {
				cursor: pointer;
				padding: 0 10px;
				margin: 4px 0 5px 0;
				color: inherit;
				font-size: inherit;
				border-color: #fff;
				transition: 0.3s linear;
				border-radius: 4px;
				outline: none;
				background: linear-gradient(52deg, rgba(88,179,79,1) 0%, rgba(80,208,67,1) 30%, rgba(88,179,79,1) 100%),#58b34f;
				width: 100%;
				border-width: 0px;
				border-style: solid;
				height: 42px;
			}
	
	.center-form-pv .actions .statis:hover {
				box-shadow: 0 1px 3px #c0eabc;
				transform: rotateY(30deg);
			}
	
	.center-form-pv .actions .btn18 {
				cursor: pointer;
				padding: 0 10px;
				margin: 4px 0 5px 0;
				color: inherit;
				font-size: inherit;
				border-color: #fff;
				transition: 0.3s linear;
				border-radius: 4px;
				outline: none;
				background: linear-gradient(52deg, rgba(67,178,179,1) 0%, rgba(65,206,208,1) 30%, rgba(67,178,179,1) 100%),#43b2b3;
				width: 100%;
				border-width: 0px;
				border-style: solid;
				height: 42px;
			}
	
	.center-form-pv .actions .btn18:hover {
				box-shadow: 0 1px 3px #c3eff0;
				transform: rotateY(30deg);
			}
	
	// table
	.el-table /deep/ .el-table__header-wrapper thead {
				box-shadow: inset 0px 0px 16px 0px rgba(48,138,196,.3);
				color: #333;
				background: rgba(48,138,196,.01);
				width: 100%;
			}
	
	.el-table /deep/ .el-table__header-wrapper thead tr {
				background: none;
			}
	
	.el-table /deep/ .el-table__header-wrapper thead tr th {
				padding: 8px 0;
				background: none;
				border-color: rgba(48,138,196,.3);
				border-width: 0 0px 4px 0;
				border-style: solid;
				text-align: left;
			}

	.el-table /deep/ .el-table__header-wrapper thead tr th .cell {
				padding: 0 10px;
				word-wrap: normal;
				word-break: break-all;
				white-space: normal;
				font-weight: 500;
				display: inline-block;
				vertical-align: middle;
				width: 100%;
				line-height: 24px;
				position: relative;
				text-overflow: ellipsis;
			}

	
	.el-table /deep/ .el-table__body-wrapper tbody {
				padding: 0;
				width: 100%;
			}

	.el-table /deep/ .el-table__body-wrapper tbody tr {
				background: none;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td {
				padding: 6px 0;
				color: inherit;
				background: none;
				font-size: inherit;
				border-color: rgba(216,168,233,.5);
				border-width: 0 0px 0px 0px;
				border-style: solid;
				text-align: left;
			}
	
		.el-table /deep/ .el-table__body-wrapper tbody tr.el-table__row--striped td {
		background: rgba(48,138,196,.05);
	}
		
	.el-table /deep/ .el-table__body-wrapper tbody tr:hover td {
				padding: 6px 0;
				color: inherit;
				background: rgba(48,138,196,.1);
				border-color: rgba(48,138,196,.3);
				border-width: 0 0px 0px 0px;
				border-style: solid;
				text-align: left;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td {
				padding: 6px 0;
				color: inherit;
				background: none;
				font-size: inherit;
				border-color: rgba(216,168,233,.5);
				border-width: 0 0px 0px 0px;
				border-style: solid;
				text-align: left;
			}

	.el-table /deep/ .el-table__body-wrapper tbody tr td .cell {
				padding: 0 10px;
				overflow: hidden;
				color: inherit;
				word-break: break-all;
				white-space: normal;
				line-height: 24px;
				text-overflow: ellipsis;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .view {
				cursor: pointer;
				border: none;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0 5px 4px 0;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(75,180,247,1) 0%, rgba(48,138,196,1) 100%);
				width: auto;
				font-size: 16px;
				height: 32px;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .view:hover {
				transform: rotateX(45deg);
				opacity: 1;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .add {
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .add:hover {
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .edit {
				border: 0px solid rgba(254, 148, 34, .2);
				cursor: pointer;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0 5px 4px 0;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(57,196,48,1) 0%, rgba(35,163,27,1) 100%);
				width: auto;
				font-size: 16px;
				height: 32px;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .edit:hover {
				transform: rotateY(45deg);
				opacity: 1;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .del {
				border: 0px solid rgba(180, 52, 31, .2);
				cursor: pointer;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0 5px 4px 0;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(223,83,83,1) 0%, rgba(163,27,27,1) 100%);
				width: auto;
				font-size: 16px;
				height: 32px;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .del:hover {
				transform: rotateZ(-15deg);
				opacity: 1;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .btn8 {
				border: 0px solid rgba(31, 160, 180, .2);
				cursor: pointer;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0 5px 4px 0;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(64,222,232,1) 0%, rgba(0,158,168,1) 100%);
				width: auto;
				font-size: 16px;
				height: 32px;
			}
	
	.el-table /deep/ .el-table__body-wrapper tbody tr td .btn8:hover {
				transform: rotateX(45deg);
				opacity: 1;
			}
	
	// pagination
	.main-content .el-pagination /deep/ .el-pagination__total {
				margin: 0 10px 0 0;
				color: inherit;
				font-weight: 400;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 28px;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .btn-prev {
				border: none;
				border-radius: 2px;
				padding: 0 5px;
				margin: 0 5px;
				color: inherit;
				background: none;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 28px;
				min-width: 35px;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .btn-next {
				border: none;
				border-radius: 2px;
				padding: 0 5px;
				margin: 0 5px;
				color: inherit;
				background: none;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 28px;
				min-width: 35px;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .btn-prev:disabled {
				border: none;
				cursor: not-allowed;
				border-radius: 2px;
				padding: 0 5px;
				margin: 0 5px;
				color: inherit;
				background: none;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 28px;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .btn-next:disabled {
				border: none;
				cursor: not-allowed;
				border-radius: 2px;
				padding: 0 5px;
				margin: 0 5px;
				color: inherit;
				background: none;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 28px;
				height: 28px;
			}

	.main-content .el-pagination /deep/ .el-pager {
				padding: 0;
				margin: 0;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
			}

	.main-content .el-pagination /deep/ .el-pager .number {
				cursor: pointer;
				padding: 0 4px;
				margin: 0 5px;
				color: inherit;
				background: none;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 24px;
				text-align: center;
				height: 24px;
			}
	
	.main-content .el-pagination /deep/ .el-pager .number:hover {
				cursor: pointer;
				padding: 0 4px;
				margin: 0 5px;
				color: inherit;
				background: #fff;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 24px;
				text-align: center;
				height: 24px;
			}
	
	.main-content .el-pagination /deep/ .el-pager .number.active {
				cursor: default;
				padding: 0 4px;
				margin: 0 5px;
				color: inherit;
				background: #fff;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 24px;
				text-align: center;
				height: 24px;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__sizes {
				color: inherit;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 28px;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__sizes .el-input {
				margin: 0 5px;
				color: inherit;
				width: 100px;
				font-size: inherit;
				position: relative;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__sizes .el-input .el-input__inner {
				border: 0px solid #ddd;
				cursor: pointer;
				padding: 0 25px 0 8px;
				color: inherit;
				display: inline-block;
				font-size: inherit;
				line-height: 28px;
				border-radius: 3px;
				outline: 0;
				background: none;
				width: 100%;
				text-align: center;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__sizes .el-input span.el-input__suffix {
				top: 0;
				position: absolute;
				right: 0;
				height: 100%;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__sizes .el-input .el-input__suffix .el-select__caret {
				cursor: pointer;
				color: #333;
				width: 25px;
				font-size: 14px;
				line-height: 28px;
				text-align: center;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__jump {
				margin: 0 0 0 24px;
				color: inherit;
				display: inline-block;
				vertical-align: top;
				font-size: inherit;
				line-height: 28px;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__jump .el-input {
				border-radius: 3px;
				padding: 0 2px;
				margin: 0 2px;
				color: inherit;
				display: inline-block;
				width: 50px;
				font-size: inherit;
				line-height: 18px;
				position: relative;
				text-align: center;
				height: 28px;
			}
	
	.main-content .el-pagination /deep/ .el-pagination__jump .el-input .el-input__inner {
				cursor: pointer;
				padding: 0 0px;
				color: inherit;
				display: inline-block;
				font-size: inherit;
				border-color: #eee;
				line-height: 24px;
				border-radius: 3px;
				background: #fff;
				width: auto;
				border-width: 0px;
				border-style: solid;
				text-align: center;
				height: 24px;
			}
	
	// list one
	.one .list1-view {
				border: 0px solid rgba(126, 96, 16, .2);
				cursor: pointer;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0px 5px 5px 0;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(75,180,247,1) 0%, rgba(48,138,196,1) 100%);
				width: auto;
				font-size: inherit;
				height: 32px;
			}
	
	.one .list1-view:hover {
				transform: rotateX(45deg);
				opacity: 0.8;
			}
	
	.one .list1-edit {
				border: 0px solid rgba(254, 148, 34, .2);
				cursor: pointer;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0px 5px 5px 0;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(57,196,48,1) 0%, rgba(35,163,27,1) 100%);
				width: auto;
				font-size: inherit;
				height: 32px;
			}
	
	.one .list1-edit:hover {
				transform: rotateY(45deg);
				opacity: 0.8;
			}
	
	.one .list1-del {
				border: 0px solid rgba(180, 52, 31, .2);
				cursor: pointer;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0px 5px 5px 0;
				outline: none;
				color: #fff;
				background: linear-gradient(30deg, rgba(223,83,83,1) 0%, rgba(163,27,27,1) 100%);
				width: auto;
				font-size: inherit;
				height: 32px;
			}
	
	.one .list1-del:hover {
				transform: rotateZ(-30deg);
				opacity: 0.8;
			}
	
	.one .list1-btn8 {
				border: 0px solid rgba(31, 160, 180, .2);
				cursor: pointer;
				border-radius: 20px;
				padding: 0 6px 0 4px;
				margin: 0px 5px 5px 0;
				outline: none;
				color: #FFF;
				background: linear-gradient(30deg, rgba(64,222,232,1) 0%, rgba(0,158,168,1) 100%);
				width: auto;
				font-size: inherit;
				height: 32px;
			}
	
	.one .list1-btn8:hover {
				transform: rotateX(45deg);
				opacity: 0.8;
			}
	
	.main-content .el-table .el-switch {
				display: inline-flex;
				vertical-align: middle;
				line-height: 30px;
				position: relative;
				align-items: center;
				height: 30px;
			}
	.main-content .el-table .el-switch /deep/ .el-switch__label--left {
				cursor: pointer;
				margin: 0 10px 0 0;
				color: rgba(48,138,196,.6);
				font-weight: 500;
				display: inline-block;
				vertical-align: middle;
				font-size: 24px;
				transition: .2s;
				height: 30px;
			}
	.main-content .el-table .el-switch /deep/ .el-switch__label--right {
				cursor: pointer;
				margin: 0 0 0 10px;
				color: rgba(48,138,196,.6);
				font-weight: 500;
				display: inline-block;
				vertical-align: middle;
				font-size: 24px;
				transition: .2s;
				height: 30px;
			}
	.main-content .el-table .el-switch /deep/ .el-switch__core {
				border: 1px solid rgba(48,138,196,.6);
				cursor: pointer;
				border-radius: 15px;
				margin: 0;
				outline: 0;
				background: rgba(48,138,196,.6);
				display: inline-block;
				width: 55px;
				box-sizing: border-box;
				transition: border-color .3s,background-color .3s;
				height: 24px;
			}
	.main-content .el-table .el-switch /deep/ .el-switch__core::after {
				border-radius: 100%;
				top: 1px;
				left: 1px;
				background: #fff;
				width: 20px;
				position: absolute;
				transition: all .3s;
				height: 20px;
			}
	.main-content .el-table .el-switch.is-checked /deep/ .el-switch__core::after {
				margin: 0 0 0 -27px;
				left: 100%;
			}
	
	.main-content .el-table .el-rate /deep/ .el-rate__item {
				cursor: pointer;
				display: inline-block;
				vertical-align: middle;
				font-size: 0;
				position: relative;
			}
	.main-content .el-table .el-rate /deep/ .el-rate__item .el-rate__icon {
				margin: 0 3px;
				color: #333;
				display: inline-block;
				font-size: 18px;
				position: relative;
				transition: .3s;
			}

</style>
