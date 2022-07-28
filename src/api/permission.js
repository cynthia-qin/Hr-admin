import request from '@/utils/request'
/**
 * 获取所有的权限列表
 * @returns
 */
export const getPermission = () => {
  return request({
    url: '/sys/permission'
  })
}
/**
 * 获取对应id的角色权限
 * @param {*} id
 * @returns
 */
export const getPermissionById = (id) => {
  return request({
    url: `/sys/role/${id}`
  })
}

// 给角色分配权限
export const assignPermission = (id, permIds) => {
  return request({
    url: '/sys/role/assignPrem',
    data: { id, permIds },
    method: 'PUT'
  })
}
