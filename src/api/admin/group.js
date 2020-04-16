import request from "@/request";

// 模块名
const module = "system";
// 控制器名
const controller = "group";
// 路径
const path = `${module}/${controller}`;

/**
 * exec 执行命令  创建、更新、删除
 * @param {Object} params 参数
 */
export const execCreate = params => {
  return request.post(`/api/v1/${path}/create`, params);
};

/**
 * 更新
 * @param {Object} params 参数
 */
export const execUpdate = params => {
  return request.put(`/api/v1/${path}/update`, params);
};

/**
 * 删除
 * @param {Object} params 参数
 */
export const execDelete = params => {
  return request.delete(`/api/v1/${path}/delete`, { params });
};

/**
 * 软删除
 * @param {Object} params 参数
 */
export const execSoftDelete = params => {
  return request.delete(`/api/v1/${path}/softdelete`, { params });
};

/**
 * 得到实体对象
 * @param {Object} params 参数
 */
export const getItem = params => {
  return request.get(`api/v1/${path}/get`, { params });
};

/**
 * 得到分页列表数据
 * @param {Object} params 参数
 */
export const getList = params => {
  return request.post(`api/v1/${path}/getlist`, params);
};

/**
 * 得到列表数据不分页
 * @param {Object} params 参数
 */
export const getAll = params => {
  return request.post(`api/v1/${path}/getAll`, params);
};
//----------------------上面为通用方法-----
//----------------------完成的美分割线-----
//----------------------下面为特殊方法-----
