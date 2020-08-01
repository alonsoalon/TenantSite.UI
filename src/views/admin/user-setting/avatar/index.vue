<template>
  <div class="avatarRoot">
    <div class="avatar-content">
      <avatar :username="info.displayName" :size="80" :src="avatar"> </avatar>
      <!-- {{ info.name }} -->
    </div>
    <div class="cropper-content">
      <div class="cropper">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
          @imgLoad="imgLoad"
        ></vueCropper>
      </div>
      <div class="preview">
        <div :style="previews.div" class="preview-layer">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>
    <div class="toolbar">
      <label class="btn-choose" for="uploads">
        选择图片
      </label>
      <input
        type="file"
        id="uploads"
        :value="imgFile"
        style="position:absolute; clip:rect(0 0 0 0);"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event)"
      />
      <el-button-group>
        <el-button
          type="primary"
          icon="el-icon-plus"
          circle
          @click="changeScale(1)"
        >
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-minus"
          circle
          @click="changeScale(-1)"
        >
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh-left"
          circle
          @click="rotateLeft"
        >
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          circle
          @click="rotateRight"
        >
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-bottom"
          circle
          @click="down('base64')"
        >
        </el-button>
      </el-button-group>
      <el-button
        v-loading="uploadLoading"
        type="primary"
        round
        @click="finish('blob')"
      >
        上传图片
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { VueCropper } from "vue-cropper";
import Avatar from "vue-avatar";
import { uploadAvatar } from "@/api/admin/user";
import Setting from "@/settings";
export default {
  name: "admin--user-setting--avatar--index",
  components: {
    Avatar,
    VueCropper
    // MyConfirmButton
  },
  data() {
    return {
      uploadLoading: false,
      //headImg: "",
      //avatar: "",
      //剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: "",
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true
      },
      fileName: "", //本机文件地址
      downImg: "#",
      imgFile: ""
    };
  },
  computed: {
    ...mapState("admin/user", ["info"]),
    ...mapState("admin/account", ["tenant"]),
    avatar() {
      if (this.info.avatar == "") return "";
      return Setting.avatarURL + this.info.avatar + "?t=" + Math.random();
    }
  },
  methods: {
    ...mapActions("admin/user", ["setUserInfo"]),
    //放大/缩小
    changeScale(num) {
      console.log("changeScale");
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    //坐旋转
    rotateLeft() {
      console.log("rotateLeft");
      this.$refs.cropper.rotateLeft();
    },
    //右旋转
    rotateRight() {
      console.log("rotateRight");
      this.$refs.cropper.rotateRight();
    },
    //上传图片（点击上传按钮）
    async finish(type) {
      // 输出
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(async data => {
          let img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;

          //this.avatar = img;

          let formData = new FormData();
          formData.append("file", data, this.fileName);
          this.uploadLoading = true;
          const res = await uploadAvatar(formData);
          this.uploadLoading = false;
          if (res.success) {
            this.$message({
              message: this.$t("common.updateOk"),
              type: "success"
            });
            this.info.avatar = res.data + "?t=" + Math.random();
            this.setUserInfo(this.info);
          } else {
            this.$message({ message: res.message, type: "error" });
          }
        });
      } else {
        this.$refs.cropper.getCropData(async data => {
          let para = { avatar: data };
          this.uploadLoading = true;
          const res = await uploadAvatar(para);
          this.uploadLoading = false;

          if (res.success) {
            this.$message({
              message: this.$t("common.updateOk"),
              type: "success"
            });
            this.avatar = data;
          } else {
            this.$message({ message: res.message, type: "error" });
          }
        });
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    // 下载图片
    down(type) {
      var aLink = document.createElement("a");
      aLink.download = this.info.name + "-avatar";
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          this.downImg = window.URL.createObjectURL(data);
          aLink.href = window.URL.createObjectURL(data);
          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.downImg = data;
          aLink.href = data;
          aLink.click();
        });
      }
    },
    //选择本地图片
    uploadImg(e) {
      var _this = this;
      //上传图片
      var file = e.target.files[0];
      _this.fileName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: "图片类型必须是.gif,jpeg,jpg,png,bmp中的一种",
          type: "warning"
        });
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        _this.option.img = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    // 载入图片完成
    // eslint-disable-next-line no-unused-vars
    imgLoad(msg) {
      //   console.log("imgLoad");
      //   console.log(msg);
    }
  }
};
</script>

<style lang="scss" scoped>
.avatarRoot {
  .avatar-content {
    margin-bottom: 20px;
  }

  .cropper-content {
    display: flex;
    display: -webkit-flex;
    margin-bottom: 20px;
    .cropper {
      width: 336px;
      height: 336px;
    }
    .preview {
      flex: 1;
      margin-left: 20px;
      .preview-layer {
        overflow: hidden;
        border-radius: 50%;
        border: 1px solid #cccccc;
        background: #cccccc;
      }
    }
  }
  .btn-choose {
    text-rendering: auto;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    align-items: flex-start;
    font: 400 13.3333px Arial;

    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;

    color: #fff;
    background-color: #409eff;
    border-color: #409eff;

    font-size: 12px;
    border-radius: 20px;
    padding: 9px 15px;

    margin-right: 10px;
  }
  .el-button-group {
    margin-right: 10px;
  }
}
</style>
