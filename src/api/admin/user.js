import request from "@/request";

/**
 * 得到分页列表数据
 */
export const getPageList = params => {
  return request.post("api/v1/system/user/pagelist", params);
};

/**
 * 得到单一实体
 * @param {*} params
 */
export const getItem = params => {
  return request.post("/api/v1/system/user/Item", params);
};

/**
 * 更新单一实体
 * @param {*} params
 */
export const update = params => {
  return request.post("/api/v1/system/user/update", params);
};
