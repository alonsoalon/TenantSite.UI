import request from "@/request";

// 模块名
const module = "system";
// 控制器名
const controller = "resource";
// 路径
const path = `${module}/${controller}`;

/**
 * exec 执行命令 - 创建
 * @param {Object} params 参数
 */
export const execCreate = params => {
  return request.post(`/api/v1/${path}/create`, params);
};

/**
 * exec 执行命令 - 更新
 * @param {Object} params 参数
 */
export const execUpdate = params => {
  return request.put(`/api/v1/${path}/update`, params);
};

/**
 * 03 exec 执行命令 - 物理删除 单条
 * @param {Object} params 参数
 */
export const execDelete = params => {
  return request.delete(`/api/v1/${path}/delete`, { params });
};

/**
 * exec 执行命令 - 物理删除 批量
 * @param {Object} params 参数
 */
export const execDeleteBatch = params => {
  return request.put(`/api/v1/${path}/deletebatch`, params);
};

/**
 * exec 执行命令 - 软删除 单条
 * @param {Object} params 参数
 */
export const execSoftDelete = params => {
  return request.delete(`/api/v1/${path}/softdelete`, { params });
};

/**
 * exec 执行命令 - 软删除 批量
 * @param {Object} params 参数
 */
export const execSoftDeleteBatch = params => {
  return request.put(`/api/v1/${path}/softdeletebatch`, params);
};

/**
 * get 查询 - 得到实体对象
 * @param {Object} params 参数
 */
export const getItem = params => {
  return request.get(`api/v1/${path}/getitem`, { params });
};

/**
 * get 查询 - 得到分页列表数据
 * @param {Object} params 查询参数
 */
export const getList = params => {
  return request.post(`api/v1/${path}/getlist`, params);
};

/**
 * get 查询 - 得到列表数据不分页
 * @param {Object} params 查询参数
 */
export const getAll = params => {
  return request.post(`api/v1/${path}/getAll`, params);
};

//---------------------- 上面为通用方法 和后台规约好了------------------------------
//---------------------- 巨完美的分割线 -------------------------------------------
//---------------------- 下面为特殊方法 如有需求请写在以下区域-----------------------

/**
 * 根据指定资源ID获取该资源的API集合
 * @param {Object} params 资源ID
 */
export const getResourceApisById = params => {
  return request.get(`api/v1/${path}/getResourceApisById`, { params });
};
/**
 * 根据指定资源ID更新该资源下的API集合
 * @param {Object} params resourceId,ApiIds
 */
export const updateResourceApisById = params => {
  return request.put(`api/v1/${path}/UpdateResourceApisById`, params);
};

/**
 * 得到资源列表（专供角色配置使用，合并了功能点资源）
 * @param {*} params
 */
export const getResources = params => {
  return request.get(`api/v1/${path}/getResources`, { params });
};
