<template>
  <div class="main-content" :style='{"border":"1px solid #ddd","minHeight":"100vh","padding":"20px 30px 30px","margin":"40px auto","color":"#333","borderRadius":"10px","background":"#eee","width":"calc(100% - 20px)","fontSize":"16px","position":"relative","height":"100%"}'>
    <!-- 列表页 -->
    <template v-if="!showFlag">
      <el-form :style='{"padding":"0px 10px 20px","margin":"0px","color":"#333","flexWrap":"wrap","background":"rgba(255,255,255,0)","display":"flex","width":"calc(100% - 250px)","fontSize":"inherit","position":"relative","justifyContent":"center"}' :inline="true" :model="searchForm" class="center-form-pv">
        <el-row :style='{"width":"auto","margin":"0 50px 0 0","fontSize":"inherit","alignItems":"center","justifyContent":"center","display":"flex"}'>
			<div :style='{"margin":"0 10px 0 0","fontSize":"inherit","display":"inline-block"}'>
			  <label :style='{"margin":"0 10px 0 0","color":"inherit","display":"inline-block","lineHeight":"40px","fontSize":"inherit","fontWeight":"500","height":"40px"}' class="item-label">在线测试</label>
			  <el-input v-model="searchForm.papername" placeholder="在线测试名称" clearable></el-input>
			</div>
			<div :style='{"margin":"0 10px 0 0","fontSize":"inherit","display":"inline-block"}'>
			  <label :style='{"margin":"0 10px 0 0","color":"inherit","display":"inline-block","lineHeight":"40px","fontSize":"inherit","fontWeight":"500","height":"40px"}' class="item-label">测试题目</label>
			  <el-input v-model="searchForm.questionname" placeholder="测试题目名称" clearable></el-input>
			</div>
			<el-button class="search" :style='{"border":"0px solid #47defa","cursor":"pointer","padding":"0 24px","outline":"none","color":"#fff","borderRadius":"4px","background":"linear-gradient(30deg, rgba(75,180,247,1) 0%, rgba(48,138,196,1) 100%)","width":"100px","fontSize":"inherit","height":"40px"}' type="success" @click="search()">
				<span class="icon iconfont icon-chakan12" :style='{"margin":"0 2px","fontSize":"inherit","color":"inherit","display":"none","height":"40px"}'></span>
				搜索
			</el-button>
		</el-row>
      </el-form>
	<div :style='{"padding":"0","borderColor":"rgba(48,138,196,.3)","margin":"10px 0 0","borderRadius":"10px 10px 4px 4px","background":"rgba(255,255,255,1)","borderWidth":"1px 0","width":"calc(100% - 250px)","borderStyle":"solid"}'>
        <el-table
		  :stripe='true'
		  :style='{"padding":"0","borderColor":"rgba(48,138,196,.3)","color":"inherit","borderRadius":"10px 10px 4px 4px","borderWidth":"0 1px","background":"none","width":"100%","fontSize":"inherit","borderStyle":"solid"}'
          :data="dataList"
          :border='true'
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandler"
          style="width: 100%;"
        >
          <el-table-column :resizable='true' type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column :resizable='true' :sortable='true' prop="username" header-align="center" align="center" label="姓名"></el-table-column>
          <el-table-column
		    :resizable='true' :sortable='true'
            prop="papername"
            header-align="center"
            align="center"
            label="在线测试"
          ></el-table-column>
          <el-table-column
		    :resizable='true' :sortable='true'
            prop="questionname"
            header-align="center"
            align="center"
            label="测试题目名称"
          ></el-table-column>
		  <el-table-column
			:resizable='true' :sortable='true'
		    prop="type"
		    header-align="center"
		    align="center"
		    label="测试题目类型"
		  >
		    <template slot-scope="scope">
		      <el-tag type="success" v-if="scope.row.type==0">单选题</el-tag>
		      <el-tag type="warning" v-if="scope.row.type==1">多选题</el-tag>
		      <el-tag type="info" v-if="scope.row.type==2">判断题</el-tag>
		      <el-tag type="primary" v-if="scope.row.type==3">填空题</el-tag>
		      <el-tag type="danger" v-if="scope.row.type==4">主观题</el-tag>
		    </template>
		  </el-table-column>
          <el-table-column :resizable='true' :sortable='true' prop="score" header-align="center" align="center" label="分值"></el-table-column>
          <el-table-column :resizable='true' :sortable='true' prop="right" header-align="center" align="center" label="正确答案"></el-table-column>
          <el-table-column
		    :resizable='true' :sortable='true'
            prop="myanswer"
            header-align="center"
            align="center"
            label="考生答案"
          ></el-table-column>
          <el-table-column
		    :resizable='true' :sortable='true'
            prop="analysis"
            header-align="center"
            align="center"
            label="测试题目分析"
          ></el-table-column>
          <el-table-column
		    :resizable='true' :sortable='true'
            prop="addtime"
            header-align="center"
            align="center"
            width="170"
            label="在线测试时间"
          ></el-table-column>
        </el-table>
	</div>

        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pageSize"
          :total="totalPage"
          :layout="layouts.join()"
          prev-text="上一页"
          next-text="下一页"
          :hide-on-single-page="false"
          :style='{"padding":"20px 0 20px","margin":"10px 0 0","whiteSpace":"nowrap","color":"inherit","borderRadius":"4px","textAlign":"center","background":"rgba(48,138,196,.6)","width":"calc(100% - 250px)","fontSize":"inherit","fontWeight":"500"}'
        ></el-pagination>
    </template>
  </div>
</template>
<script>
	export default {
		data() {
			return {
				layouts: ["total","prev","pager","next","sizes","jumper"],
				searchForm: {
					key: ""
				},
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				showFlag: false,
				user: {}
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
			this.init();
			this.getDataList();
		},
		components: {},
		methods: {
			init() {},
			search() {
				this.pageIndex = 1;
				this.getDataList();
			},
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true;
				var params = {
					page: this.pageIndex,
					limit: this.pageSize,
					sort: "id",
					myscore: 0,
					userid: this.id,
					ismark: 1
				};
				if (this.searchForm.papername) {
					params["papername"] = `%${this.searchForm.papername}%`;
				}
				if (this.searchForm.questionname) {
					params["questionname"] = `%${this.searchForm.questionname}%`;
				}
				this.$http({
					url: this.$api.examrecordpage,
					method: "get",
					params: params
				}).then(({ data }) => {
					if (data && data.code === 0) {
						let arr = []
						for(let x in data.data.list){
							if(data.data.list[x].type==0||data.data.list[x].type==2){
								arr = JSON.parse(data.data.list[x].options)
								for(let i in arr){
									if(data.data.list[x].answer == arr[i].code){
										data.data.list[x].right = arr[i].text
									}
								}
							}else if(data.data.list[x].type==1){
								arr = JSON.parse(data.data.list[x].options)
								data.data.list[x].answer.split(',').forEach(item=>{
									for(let i in arr){
										if (item == arr[i].code) {
											if (data.data.list[x].right) {
												data.data.list[x].right += ','
												data.data.list[x].right = data.data.list[x].right + arr[i].text
											}else{
												data.data.list[x].right = arr[i].text
											}
										}
									}
								})
							}else if(data.data.list[x].type==3){
								data.data.list[x].right = data.data.list[x].answer
							}else if(data.data.list[x].type==4){
								data.data.list[x].right = '略'
							}
						}
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
			}
		}
	};
</script>
<style lang="scss" scoped>
.form-content {
	background: transparent;
}
.table-content {
	background: transparent;
}

	.center-form-pv {
		.el-input {
		  width: auto;
		}
	  .el-date-editor.el-input {
	    width: auto;
	  }
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
</style>
