<template>
  <div class="main-content" :style='{"border":"1px solid #ddd","minHeight":"100vh","padding":"20px 30px 30px","margin":"40px auto","color":"#333","borderRadius":"10px","background":"#eee","width":"calc(100% - 20px)","fontSize":"16px","position":"relative","height":"100%"}'>
    <!-- 列表页 -->
    <div v-if="!showFlag">
      <el-form :style='{"border":"1px solid #ddd","padding":"40px","boxShadow":"0 0px 0px rgba(64, 158, 255, .3)","borderRadius":"10px","alignItems":"center","flexWrap":"wrap","background":"#fff","display":"flex","fontSize":"inherit"}' :inline="true" :model="searchForm" class="add-update-preview">
        <el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' label="在线测试">
          <el-input v-model="searchForm.papername" placeholder="在线测试名称" clearable></el-input>
        </el-form-item>
        <el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}' label="测试题目">
          <el-input v-model="searchForm.questionname" placeholder="测试题目名称" clearable></el-input>
        </el-form-item>
        <el-form-item :style='{"width":"100%","margin":"0 0 30px 0","fontSize":"inherit","color":"inherit"}'>
          <el-button :style='{"border":"0","cursor":"pointer","padding":"0","margin":"0 20px 0 0","outline":"none","color":"rgba(255, 255, 255, 1)","borderRadius":"4px","background":"rgba(64, 158, 255, 1)","width":"128px","lineHeight":"40px","fontSize":"14px","height":"40px"}' round @click="search()">查询</el-button>
          <el-button :style='{"border":"1px solid rgba(64, 158, 255, 1)","cursor":"pointer","padding":"0","margin":"0","outline":"none","color":"rgba(64, 158, 255, 1)","borderRadius":"4px","background":"rgba(255, 255, 255, 1)","width":"128px","lineHeight":"40px","fontSize":"14px","height":"40px"}' type="primary" round @click="back()">返回</el-button>
        </el-form-item>
      </el-form>
      <div class="table-content">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandler"
          style="width: 100%;"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="username" header-align="center" align="center" sortable label="姓名"></el-table-column>
          <el-table-column
            prop="papername"
            header-align="center"
            align="center"
            sortable
            label="在线测试"
          ></el-table-column>
          <el-table-column
            prop="questionname"
            header-align="center"
            align="center"
            sortable
            label="测试题目名称"
          ></el-table-column>
		  <el-table-column
		    prop="myscore"
		    header-align="center"
		    align="center"
		    sortable
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
          <el-table-column prop="score" header-align="center" align="center" sortable label="分值"></el-table-column>
          <el-table-column prop="answer" header-align="center" align="center" sortable label="正确答案"></el-table-column>
          <el-table-column
            prop="myanswer"
            header-align="center"
            align="center"
            sortable
            label="考生答案"
          ></el-table-column>
          <el-table-column
            prop="myscore"
            header-align="center"
            align="center"
            sortable
            label="考生分值"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.myscore==0" type="info">{{scope.row.myscore}}</el-tag>
              <el-tag v-else type="warning">{{scope.row.myscore}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="addtime"
            header-align="center"
            align="center"
            sortable
            width="170"
            label="在线测试时间"
          ></el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination-content"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
      paperid: 0,
      userid: 0
    };
  },
  props: ["parent"],
  components: {},
  methods: {
    init(row) {
      this.paperid = row.paperid;
      this.userid = row.userid;
      this.getDataList();
    },
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
        paperid: this.paperid,
        userid: this.userid
        // sort: "id"
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
    back() {
      this.parent.showFlag = false;
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
</style>
