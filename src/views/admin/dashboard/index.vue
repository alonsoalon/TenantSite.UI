<template>
  <div class="root">
    <el-alert
      title="欢迎使用 Tenant Site"
      type="info"
      show-icon
      :closable="false"
    >
    </el-alert>
    <div style="text-align:left; margin-top:20px; margin-rigt:100px;">
      <div class="block">
        <el-timeline>
          <el-timeline-item timestamp="2020/9/15" placement="top">
            <el-card>
              <h4>更新记录</h4>
              <p>
                1.增加配置管理<br />
                2.增加用户选择组件，示例见配置管理新增/编辑页面用户选择（需系统管理员身份登录）<br />
                3.资源管理添加子项无法代入初始数据BUG <br />
                4.文档更新用户选择组件a-user , 增加捐赠章节 <br />
                <a
                  href="https://www.iusaas.com/guide/ui.html#a-user"
                  style="color:blue"
                  target="_blank"
                  >查看用户选择组件文档</a
                >
              </p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2020/8/25" placement="top">
            <el-card>
              <h4>更新记录</h4>
              <p>
                1.增加数据条件控制功能<br />
                2.数据条件控制示例见数据字典分类列表数据，可通过系统管理员和观众登录查看效果<br />
              </p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2020/8/12" placement="top">
            <el-card>
              <h4>更新记录</h4>
              <p>
                1.增加内部组件无母版打开，示例见日志管理 > API访问日志
                菜单连接<br />
                2.资源管理中的菜单增加缓存功能，标记为缓存的资源菜单，在顶部标签切换时不会再次加载组件和数据<br />
                例子见：通过打开多个左边菜单页面，资源管理中标记为缓存的菜单在切换时不会再次加载，顶部的刷新可不受缓存限制
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "admin--dashboard--index",

  data() {
    return {
      reverse: false,
      activities: [
        {
          content:
            "更新记录<br />1.增加配置管理<br />2.增加用户选择组件，示例见配置管理新增/编辑页面用户选择（需系统管理员身份登录）<br />3.资源管理添加子项无法代入初始数据BUG<br />4.文档更新用户选择组件a-user, 增加捐赠章节",
          timestamp: "2018-04-15"
        },
        {
          content: "通过审核",
          timestamp: "2018-04-13"
        },
        {
          content: "创建成功",
          timestamp: "2018-04-11"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.root {
  text-align: center;
}
</style>
