<template>
  <el-container>
    <el-header>
      <el-col class="doc-name" :span="12">
        <router-link to="/">{{ doc.name }}</router-link>
      </el-col>
      <el-col class="doc-down" :span="12">
        <a :href="downUri">下载离线文档(Markdown)</a>
      </el-col>
    </el-header>
    <el-container>

      <el-aside>
        <el-row>
          <el-input class="search" v-model="search" placeholder="搜索" prefix-icon="el-icon-search"></el-input>
        </el-row>
        <div style="overflow-y:auto; height:calc(100% - 55px)">
          <el-menu
              v-for="(doc_class,key) in docClasses" :key="key"
              class="el-menu-vertical-demo"
              text-color="#000"
              active-text-color="#5cba5c">
            <el-submenu :index="doc_class.description">
              <template slot="title">
                <i class="el-icon-title"></i>
                <span slot="title" class="title-font">{{ doc_class.description }}</span>
              </template>
              <el-menu-item :index="key+''"
                            @click="openMenuItem(doc_method)"
                            v-for="(doc_method,key) in doc_class.doc_methods" :key="key">
                {{ doc_method.description }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-main v-if="method">
        <el-row class="title-font"><i class="el-icon-detail"></i>接口详情</el-row>
        <el-row :gutter="20">
          <el-col :span="16" :offset="4">
            <el-row class="method-description">
              {{ method.description }}
            </el-row>
            <el-row class="method-label">请求地址</el-row>
            <el-row v-for="(item, key) in method.uri_set" :key="key">
              <code class="method-uri">{{ item }}</code>
              <el-tag class="method-mode" v-for="(item, key) in method.mode_set" :key="key"
                      :type="methodMode(item)">{{ item }}
              </el-tag>
              <span class="test-button" @click="openTest(method.mode_set,item,method)">接口测试</span>
            </el-row>
            <el-row class="method-label">请求参数</el-row>
            <el-row v-if="method.params&&method.params.length>0">
              <el-table
                  :data="method.params"
                  border>
                <el-table-column
                    prop="name"
                    label="参数名">
                </el-table-column>
                <el-table-column
                    prop="type"
                    width="100"
                    label="类型">
                </el-table-column>
                <el-table-column
                    prop="requited"
                    width="100"
                    label="是否必传">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.requited? 'success' : 'danger'"
                            disable-transitions>{{ scope.row.requited ? '是' : '否' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述">
                </el-table-column>
                <el-table-column
                    prop="format"
                    label="格式">
                </el-table-column>
                <el-table-column
                    prop="default_value"
                    label="默认值">
                </el-table-column>
                <el-table-column
                    prop="example"
                    label="示例">
                </el-table-column>
              </el-table>
            </el-row>
            <el-row v-else-if="method.param_json&&method.param_json.length>0">
              <el-row class="buttons">
                <el-col :span="2" class="button1" :class="!isExample?'select':''">
                  <div @click="changeSelect(false)">模型</div>
                </el-col>
                <el-col :span="2" class="button2" :class="isExample?'select':''">
                  <div @click="changeSelect(true)">示例</div>
                </el-col>
              </el-row>
              <pre v-if="!isExample" v-highlightjs="method.param_json"><code class="javascript code"></code></pre>
              <pre v-else v-highlightjs="method.param_example"><code class="javascript code"></code></pre>
              <el-row>
                <el-col :span="2">
                  <div class="down-border" @click="showCode('java', method.param_android)"><i
                      class="el-icon-android"></i></div>
                </el-col>
                <el-col :span="2">
                  <div class="down-border" @click="showCode('ios', method.param_ios)"><i class="el-icon-ios"></i></div>
                </el-col>
                <el-col :span="2">
                  <div class="down-border" @click="showCode('html', method.param_vue)"><i class="el-icon-vue"></i></div>
                </el-col>
              </el-row>
            </el-row>
            <el-row v-else>
              无
            </el-row>
            <el-row class="method-label">响应</el-row>
            <el-row v-if="method.return_json&&method.return_json.length>0">
              <pre v-highlightjs="method.return_json"><code class="javascript code"></code></pre>
              <el-row>
                <el-col :span="2">
                  <div class="down-border" @click="showCode('java', method.return_android)"><i
                      class="el-icon-android"></i></div>
                </el-col>
                <el-col :span="2">
                  <div class="down-border" @click="showCode('ios', method.return_ios)"><i class="el-icon-ios"></i></div>
                </el-col>
                <el-col :span="2">
                  <div class="down-border" @click="showCode('html', method.return_vue)"><i class="el-icon-vue"></i>
                  </div>
                </el-col>
              </el-row>
            </el-row>
            <el-row v-else>
              无
            </el-row>
            <el-row class="method-label">状态码</el-row>
            <el-row>
              <el-table
                  class="code-table"
                  :data="method.doc_codes"
                  border>
                <el-table-column
                    prop="name"
                    label="参数名">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="值">
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述">
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
        </el-row>
      </el-main>
      <el-main v-else>
        <defaultPage/>
      </el-main>
    </el-container>
    <el-dialog
        :center="true"
        :visible.sync="dialogVisible"
        width="50%">
      <el-row>
        <el-col :push="22" :span="1">
          <el-button type="primary" class="copyCode" @click="copyCode">复制</el-button>
        </el-col>
      </el-row>
      <pre v-highlightjs="code"><code class="code" :class="codeClass"></code></pre>
    </el-dialog>
    <el-dialog
        title="接口测试"
        :center="true"
        :visible.sync="testDialogVisible"
        class="testDialog"
        width="80%">
      <el-row>
        <el-col :span="12">
          <div class="test-title-left">请求</div>
          <div class="test-content-left">
            <div class="test-header">
              <div class="header-title">请求头</div>
              <div class="test-header-value">
                <el-row v-for="(item,key) in requestHeaders" :key="key">
                  <el-col :span="5">
                    <el-input v-model="item.key"></el-input>
                  </el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14">
                    <el-input v-model="item.value"></el-input>
                  </el-col>
                  <el-col :span="2"><i @click="plusHeader(key)" class="test-button-border el-icon-plus"></i></el-col>
                  <el-col :span="2"><i @click="minusHeader(key)" v-if="requestHeaders.length>1"
                                       class="test-button-border el-icon-minus"></i></el-col>
                </el-row>
              </div>
            </div>
            <div class="test-param" v-if="paramItem&&paramItem.length>0">
              <div class="header-title">
                请求参数
              </div>
              <el-form label-width="120px" v-model="requestParam">

                <el-form-item :label="item.description?item.description:item.name" v-for="(item,key) in paramItem"
                              :key="key">
                  <el-row class="param-value">
                    <el-col :span="21">

                      <el-date-picker v-if="item.type==='datetime'" type="datetime" :format="item.format"
                                      :value-format="item.format" placeholder="选择日期时间"
                                      v-model="requestParam[item.name]" clearable></el-date-picker>
                      <el-date-picker v-if="item.type==='date'" type="date" placeholder="选择日期" :format="item.format"
                                      :value-format="item.format" v-model="requestParam[item.name]"
                                      clearable></el-date-picker>
                      <el-time-picker v-if="item.type==='time'" type="time" placeholder="选择时间" :format="item.format"
                                      :value-format="item.format" v-model="requestParam[item.name]"
                                      clearable></el-time-picker>
                      <input v-if="item.type==='file'" type="file" @change="selectFile(item.name,$event)" clearable/>
                      <el-input
                          v-if="item.type.indexOf('datetime')<0&&item.type!=='date'&&item.type!=='time'&&item.type!=='file'"
                          :type="item.type==='int'||item.type==='long'?'number':'text'"
                          :placeholder="item.type.indexOf('[]')>0?'多个逗号分割，如：1,2,3,4':''"
                          v-model="requestParam[item.name]" clearable></el-input>
                    </el-col>
                    <el-col class="auto-value" :span="3">
                      <el-button @click="addValue(item.name,item.type,item.format)">数据</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </div>
            <div class="test-param" v-if="requestJson&&requestJson.length>0">
              <div class="header-title">
                请求body体
              </div>
              <el-input class="requestJson" type="textarea" :autosize="{ minRows: 2}" v-model="requestJson"></el-input>
            </div>
            <el-row class="send" v-for="(item,key) in requestUrl" :key="key">
              <el-col :span="2">
                <el-tag class="method-mode" :type="methodMode(item.mode)">{{ item.mode }}</el-tag>
              </el-col>
              <el-col :span="19">
                <el-input v-model="item.uri" disabled></el-input>
              </el-col>
              <el-col :span="3">
                <el-button @click="send(item)">发送</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="test-title-right">响应</div>
          <div v-if="responseHeaders.length>0" class="test-content-right">
            <div class="test-header">
              <div class="header-title">响应头</div>
              <div class="test-header-value">
                <el-row v-for="(item,key) in responseHeaders" :key="key">
                  <el-col :span="6">
                    {{ item.key }}
                  </el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="16">
                    <el-input v-model="item.value" disabled></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="result" class="test-param">
              <div class="header-title">
                响应结果
              </div>
              <pre v-highlightjs="result"><code class="code" :class="codeClass"></code></pre>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </el-container>
</template>

<script>
import defaultPage from "./Default"
import Clipboard from 'clipboard'

export default {
  components: {
    defaultPage
  },
  name: 'Index',
  data() {
    return {
      doc: {},
      docClasses: {},
      isExample: false,
      method: null,
      search: "",
      code: "",
      dialogVisible: false,
      codeClass: "ios",
      downUri: window.location.pathname.replace("/citrsw/index.html", "") + "/citrsw/api/down/markdown",
      testDialogVisible: false,
      requestHeaders: [],
      responseHeaders: [],
      requestParam: {},
      requestJson: {},
      paramItem: [],
      paramFiles: {},
      requestUrl: [],
      result: {}
    };
  },
  mounted() {
    this.queryApi();
  },
  watch: {
    search(val) {
      this.docClasses = []
      for (let i = 0; i < this.doc.doc_classes.length; i++) {
        let docClass = this.doc.doc_classes[i];
        if (docClass.description.indexOf(val) !== -1) {
          this.docClasses.push(docClass);
        }
      }
    }
  },
  methods: {
    openMenuItem(item) {
      this.method = item;
      this.isExample = false
    },
    methodMode(mode) {
      switch (mode) {
        case "GET":
          return "";
        case "POST":
          return "success";
        case "PUT":
          return "warning";
        case "DELETE":
          return "danger";
      }
      return "";
    },
    showCode(codeClass, code) {
      this.dialogVisible = true
      this.codeClass = codeClass
      this.code = code;
    },
    copyCode() {
      let _this = this;
      let clipboard = new Clipboard('.copyCode', {
        text: function () {
          return _this.code
        }
      })
      // eslint-disable-next-line no-unused-vars
      clipboard.on('success', e => {
        this.$message({message: '复制成功', showClose: true, type: 'success'})
        // 释放内存
        clipboard.destroy()
      })
      // eslint-disable-next-line no-unused-vars
      clipboard.on('error', e => {
        this.$message({message: '复制失败,', showClose: true, type: 'error'})
        clipboard.destroy()
      })
    },
    /**
     * 打开测试
     */
    openTest(modeSet, item, method) {
      let param = method.params;
      let json = method.param_example;
      this.testDialogVisible = true;
      this.paramItem = []
      this.responseHeaders = []
      this.requestParam = {}
      this.paramFiles = {}
      this.requestJson = ''
      this.result = ''
      if (param && param.length > 0) {
        for (let i = 0; i < param.length; i++) {
          this.paramItem.push(param[i])
        }
      } else if (json && json.length > 0) {
        this.requestJson = json
      }
      this.requestUrl = []
      for (let i = 0; i < modeSet.length; i++) {
        this.requestUrl.push({mode: modeSet[i], uri: item})
      }
      this.requestHeaders = localStorage.getItem("api-headers") ? JSON.parse(localStorage.getItem("api-headers")) : [{
        key: "",
        value: ""
      }]
    },
    plusHeader(index) {
      this.requestHeaders.splice(index + 1, 0, {key: "", value: ""});
    },
    minusHeader(index) {
      this.requestHeaders.splice(index, 1);
    },
    queryApi() {
      // this.axios.get("/citrsw/citrsw/api").then((response) => {
        this.axios.get(window.location.pathname.replace("/citrsw/index.html", "") + "/citrsw/api").then((response) => {
        this.doc = response.data
        this.docClasses = this.doc.doc_classes;
      })
    },
    send(item) {
      let header = {}
      let headers = []
      let requestData = Object.assign({}, this.requestParam)
      for (let i = 0; i < this.requestHeaders.length; i++) {
        if (this.requestHeaders[i].key === "content-type") {
          continue
        }
        if (this.requestHeaders[i].key.length > 0 && this.requestHeaders[i].value.length > 0) {
          headers.push(this.requestHeaders[i])
        }
      }

      if (this.requestJson) {
        headers.push({key: "content-type", value: "application/json"})
      } else {
        Object.keys(this.requestParam).forEach((key) => {
          item.uri = item.uri.replace("{" + key + "}", this.requestParam[key])
        })
        if (JSON.stringify(this.paramFiles) !== "{}") {
          headers.push({key: "content-type", value: "multipart/form-data"})
          //转换为form-data形式
          requestData = new FormData();
          Object.keys(this.requestParam).forEach((key) => {
            if (this.requestParam[key] != null) {
              if (this.paramFiles[this.requestParam[key]] != null) {
                requestData.append(key, this.paramFiles[this.requestParam[key]]);
              } else {
                requestData.append(key, this.requestParam[key]);
              }
            }
          });
        } else {
          headers.push({key: "content-type", value: ""})
        }
      }
      if (headers.length === 0) {
        headers = [{
          key: "",
          value: ""
        }]
      }
      this.requestHeaders = headers;
      for (let i = 0; i < this.requestHeaders.length; i++) {
        if (this.requestHeaders[i].key.length > 0 && this.requestHeaders[i].value.length > 0) {
          header[this.requestHeaders[i].key] = this.requestHeaders[i].value
        }
      }
      localStorage.setItem("api-headers", JSON.stringify(this.requestHeaders))
      this.responseHeaders = []
      switch (item.mode) {
        case "GET":
          this.axios.get(window.location.pathname.replace("/citrsw/index.html", "") + item.uri, {
            params: requestData,
            data: this.requestJson,
            headers: header
          }).then((response) => {
            let headers = response.headers;
            for (let key in headers) {
              this.responseHeaders.push({key: key + "", value: headers[key + ""]});
            }
            this.result = JSON.stringify(response.data, null, 2);
          })
          break
        case "PUT":
          this.axios.put(window.location.pathname.replace("/citrsw/index.html", "") + item.uri, this.requestJson, {
            params: requestData,
            headers: header
          }).then((response) => {
            let headers = response.headers;
            for (let key in headers) {
              this.responseHeaders.push({key: key + "", value: headers[key + ""]});
            }
            this.result = JSON.stringify(response.data, null, 2);
          })
          break
        case "DELETE":
          this.axios.delete(window.location.pathname.replace("/citrsw/index.html", "") + item.uri, {
            params: requestData,
            data: this.requestJson,
            headers: header
          }).then((response) => {
            let headers = response.headers;
            for (let key in headers) {
              this.responseHeaders.push({key: key + "", value: headers[key + ""]});
            }
            this.result = JSON.stringify(response.data, null, 2);
          })
          break
        case "POST":
          this.axios.post(window.location.pathname.replace("/citrsw/index.html", "") + item.uri, this.requestJson, {
            headers: header
          }).then((response) => {
            let headers = response.headers;
            for (let key in headers) {
              this.responseHeaders.push({key: key + "", value: headers[key + ""]});
            }
            this.result = JSON.stringify(response.data, null, 2);
          })
          break
      }
    },
    addValue(name, type, format) {
      let value = ""
      let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      debugger
      switch (type) {
        case "int":
          value = Math.floor(Math.random() * (214748364))
          break
        case "int[]":
          value = Math.floor(Math.random() * (214748364)) + "," + Math.floor(Math.random() * (214748364)) + "," + Math.floor(Math.random() * (214748364)) + "," + Math.floor(Math.random() * (214748364))
          break
        case "long":
          value = Math.floor(Math.random() * (922337203685477580))
          break
        case "long[]":
          value = Math.floor(Math.random() * (922337203685477580)) + "," + Math.floor(Math.random() * (922337203685477580)) + "," + Math.floor(Math.random() * (922337203685477580))
          break
        case "string":

          for (let i = 6; i > 0; --i) {
            result += str[Math.floor(Math.random() * str.length)];
          }
          value = result
          break
        case "string[]":
          for (let i = 6; i > 0; --i) {
            result += str[Math.floor(Math.random() * str.length)];
          }
          value += result + ","
          for (let i = 6; i > 0; --i) {
            result += str[Math.floor(Math.random() * str.length)];
          }
          value += result + ","
          for (let i = 6; i > 0; --i) {
            result += str[Math.floor(Math.random() * str.length)];
          }
          value += result
          break
        case "datetime":
        case "date":
        case "time":
          value = this.formatDate(new Date(), format)
          break
      }
      this.$set(this.requestParam, name, value)
    },
    formatDate(date, format) {
      debugger
      if (!format) format = "yyyy-MM-dd HH:mm:ss";
      let dict = {
        "yyyy": date.getFullYear(),
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "H": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "S": ("" + (date.getMilliseconds() + 1000)).substr(1),
        "MM": ("" + (date.getMonth() + 101)).substr(1),
        "dd": ("" + (date.getDate() + 100)).substr(1),
        "HH": ("" + (date.getHours() + 100)).substr(1),
        "mm": ("" + (date.getMinutes() + 100)).substr(1),
        "ss": ("" + (date.getSeconds() + 100)).substr(1)
      };
      return format.replace(/(y+|M+|d+|H+|s+|m+|S)/g,
          function (a) {
            return dict[a];
          });
    },
    selectFile(name, e) {
      this.requestParam[name] = "file"
      this.paramFiles[name] = e.target.files[0]
    },
    changeSelect(isExample) {
      this.isExample = isExample;
    }

  }
}
</script>
<style scoped>
.el-icon-title {
  background: url("../assets/ico/list.png") center no-repeat;
}

.el-icon-title:before {
  padding: 0 5px;
  content: "\8d3a";
  font-size: 22px;
  visibility: hidden;
}

.title-font {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 18px;
}

.el-icon-detail {
  background: url("../assets/ico/detail.png") center no-repeat;
}

.el-icon-detail:before {
  padding: 0 5px;
  content: "\8d3a";
  font-size: 22px;
  visibility: hidden;
}

.el-icon-android {
  background: url("../assets/ico/android.png") center no-repeat;
}

.el-icon-android:before {
  padding: 0 5px;
  content: "\8d3a";
  font-size: 22px;
  visibility: hidden;
}

.el-icon-ios {
  background: url("../assets/ico/ios.png") center no-repeat;
}

.el-icon-ios:before {
  padding: 0 5px;
  content: "\8d3a";
  font-size: 22px;
  visibility: hidden;
}


.el-icon-vue {
  background: url("../assets/ico/vue.png") center no-repeat;
}

.el-icon-vue:before {
  padding: 0 5px;
  content: "\8d3a";
  font-size: 22px;
  visibility: hidden;
}

.down-border {
  border: 2px solid #000;
  text-align: center;
  margin-right: 10px;
  border-radius: 30px
}

.down-border:hover {
  cursor: pointer;
}

.el-submenu {
  text-align: left;
  border-bottom: 1px solid #DCDFE6;
  background-color: #ededed;
}

.el-menu-item {
  border-top: 1px solid #DCDFE6;
}

.el-header {
  background-color: #5cba5c;
}

.el-header {
  line-height: 60px;
  font-weight: bold;
}

.doc-name {
  text-align: left;
}

.doc-name a {
  font-size: 20px;
  text-decoration: none;
  color: #FFFFFF;
}

.doc-down {
  text-align: right;
}

.doc-down a {
  font-size: 16px;
  text-decoration: none;
  color: #002fff;
}

.el-container {
  height: calc(100% - 20px);
}

.el-aside {
  height: 100%;
  border-right: 1px solid #dcdfe6;
  background-color: #fafafa;
}

.el-menu {
  border: none;
}

.el-menu-item {
  height: 40px;
  line-height: 40px;
}

.el-menu--inline .is-active {
  background-color: #fafafa;
}

.code {
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
  font-weight: bold;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.el-row {
  text-align: left;
  margin: 10px 0;
}

.code-table {
  width: 500px;
}

.method-description {
  font-size: 25px;
  color: #5cba5c;
}

.method-label {
  font-size: 16px;
  font-weight: bold;
}

.method-uri {
  padding: 2px 4px;
  font-size: 12px;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}

.method-mode {
  font-weight: bold;
  margin-left: 5px;
}

.button1 {
  text-align: center;
  padding: 2px 8px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  cursor: pointer;
  border: 2px solid #000;
  border-right: none;
}

.button2 {
  text-align: center;
  padding: 2px 8px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  border: 2px solid #000;
}

.select {
  color: #ffffff;
  background-color: #5cba5c;
}

.test-button {
  margin-left: 30px;
  border-radius: 20px;
  font-size: 10px;
  cursor: pointer;
  color: #ffffff;
  background-color: #4884ff;
  padding: 3px 10px;
}

.test-content-left {
  height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #5cba5c;
  border-right: none;
  padding: 10px;
}

.test-title-left {
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  padding: 5px;
  height: 20px;
  color: #ffffff;
  background-color: #5cba5c;
  border-right: 1px solid #ffffff;
  border-left: 1px solid #5cba5c;
}

.test-content-right {
  height: 60vh;
  overflow-y: auto;
  border: 1px solid #5cba5c;
  padding: 10px;
}

.test-title-right {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  padding: 5px;
  height: 20px;
  color: #ffffff;
  background-color: #5cba5c;
  border-left: 1px solid #ffffff;
  border-right: 1px solid #5cba5c;
}

.test-header, .test-param {
  border-bottom: 1px solid #5cba5c;
  padding: 5px;
}

.test-header-value {
  margin-left: 30px;
}

.test-header-value .el-col {
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.test-button-border {
  border: 1px solid #5cba5c;
  padding: 7px;
}

.requestJson {
}

.el-input.is-disabled >>> .el-input__inner {
  background-color: #FFF;
  border-color: #E4E7ED;
  color: #606266;
  cursor: auto;
}

.testDialog >>> .el-dialog__body {
  padding: 0 15px 5px 15px;
}

.send {
  height: 30px;
  line-height: 30px;
}

.param-value {
  margin: 0;
}

.send .el-col, .param-value .auto-value {
  text-align: center;
}

.header-title {
  margin: 5px 0;
  font-weight: bold;
  font-size: 16px;
}
</style>
