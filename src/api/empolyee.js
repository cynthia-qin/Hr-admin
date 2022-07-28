import request from '@/utils/request'
// 获取所有的员工列表
export const getEmployee = ({ page, size }) => {
  return request({
    url: '/sys/user',
    params: { page, size }
  })
}
// 批量从excel中导入员工列表
export const importEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}
/**
 *给员工分配角色
 * @param {*} param0
 * @returns
 */
export const assignRole = ({ id, roleIds }) => request({
  url: '/sys/user/assignRoles',
  method: 'PUT',
  data: { id, roleIds }
})
/**
 * 保存员工更新得信息
 * @param {*} id 用户ID
 * @param {*} data 更新的信息
 * @returns
 */
export const saveEmployee = (id, data) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'PUT',
    data
  })
}
/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}
/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
