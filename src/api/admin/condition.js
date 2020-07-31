//import request from "@/request";

import api from "@/api/_base/api.js";
let baseApi = api("/api/v1/System/Condition");

// 通用接口 开始
export const execCreate = baseApi.execCreate;
export const execDelete = baseApi.execDelete;
export const execDeleteBatch = baseApi.execDeleteBatch;
export const execSoftDelete = baseApi.execSoftDelete;
export const execSoftDeleteBatch = baseApi.execSoftDeleteBatch;
export const execUpdate = baseApi.execUpdate;
export const getAll = baseApi.getAll;
export const getItem = baseApi.getItem;
export const getList = baseApi.getList;
// 通用接口 结束
// ---------------------------------------------------------------
// 自定义接口 开始
// ...这儿编写接口函数
// 自定义接口 结束

// export default {
//   ...baseApi
//   // 自定义接口 开始

//   // 自定义接口 结束
// };
