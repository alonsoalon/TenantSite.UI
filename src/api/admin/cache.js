import request from "@/request";

// 模块名
const module = "system";
// 控制器名
const controller = "cache";
// 路径
const path = `${module}/${controller}`;

/**
 * 得到缓存KEY模板列表
 */
export const getCacheKeyTemplates = () => {
  return request.get(`api/v1/${path}/GetCacheKeyTemplates`);
};

/**
 * 清除缓存
 */
export const clear = params => {
  return request.delete(`api/v1/${path}/clear`, { params: params });
};
