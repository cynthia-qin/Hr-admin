import dayJs from 'dayjs'
// Vue.filter('dateFormat', (time) => {
//   return dayJs(time).format('YYYY-MM-DD')
// })
export const dateFormat = (time) => {
  return dayJs(time).format('YYYY-MM-DD')
}
