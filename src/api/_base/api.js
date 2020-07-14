/**
 * 通用接口，与后台达成协议的通用接口，不用改动
 */
import request from "@/request";

const api = path => {
  let url = path;
  return {
    /**
     * exec 执行命令 - 创建
     * @param {Object} params 参数
     */
    execCreate: params => {
      return request.post(`${url}/create`, params);
    },

    /**
     * exec 执行命令 - 更新
     * @param {Object} params 参数
     */
    execUpdate: params => {
      return request.put(`${url}/update`, params);
    },

    /**
     * 03 exec 执行命令 - 物理删除 单条
     * @param {Object} params 参数
     */
    execDelete: params => {
      return request.delete(`${url}/delete`, { params });
    },

    /**
     * exec 执行命令 - 物理删除 批量
     * @param {Object} params 参数
     */
    execDeleteBatch: params => {
      return request.put(`${url}/deletebatch`, params);
    },

    /**
     * exec 执行命令 - 软删除 单条
     * @param {Object} params 参数
     */
    execSoftDelete: params => {
      return request.delete(`${url}/softdelete`, { params });
    },

    /**
     * exec 执行命令 - 软删除 批量
     * @param {Object} params 参数
     */
    execSoftDeleteBatch: params => {
      return request.put(`${url}/softdeletebatch`, params);
    },

    /**
     * get 查询 - 得到实体对象
     * @param {Object} params 参数
     */
    getItem: params => {
      return request.get(`${url}/getitem`, { params });
    },

    /**
     * get 查询 - 得到分页列表数据
     * @param {Object} params 查询参数
     */
    getList: params => {
      return request.post(`${url}/getlist`, params);
    },

    /**
     * get 查询 - 得到列表数据不分页
     * @param {Object} params 查询参数
     */
    getAll: params => {
      return request.post(`${url}/getAll`, params);
    }
  };
};

export default api;
