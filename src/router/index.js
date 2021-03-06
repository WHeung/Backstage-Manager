import Vue from 'vue'
import Router from 'vue-router'

/* 以一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。 不可删除 */
const salesStock = () => import(/* webpackChunkName: "stock" */ '~src/views/sales/indexView/index.vue')
const salesEditStock = () => import(/* webpackChunkName: "stock" */ '~src/views/sales/editView/index.vue')
const orderList = () => import(/* webpackChunkName: "order" */ '~src/views/sales/orderListView/index.vue')
const orderDetail = () => import(/* webpackChunkName: "order" */ '~src/views/sales/orderDetailView/index.vue')
const hotelList = () => import(/* webpackChunkName: "hotel" */ '~src/views/sales/hotelListView/index.vue')
const hotelUpdate = () => import(/* webpackChunkName: "hotel" */ '~src/views/sales/hotelUpdateView/index.vue')
const specialList = () => import(/* webpackChunkName: "special" */ '~src/views/sales/specialListView/index.vue')
const specialEdit = () => import(/* webpackChunkName: "special" */ '~src/views/sales/specialListView/specialEdit.vue')
const dreamTripOrder = () => import(/* webpackChunkName: "dreamTrip" */ '~src/views/dreamTrip/orderListView/index.vue')
const visaTaiwanIndex = () => import(/* webpackChunkName: "order" */ '~src/views/visaTaiwan/indexView/index.vue')
const visaTaiwanDetail = () => import(/* webpackChunkName: "order" */ '~src/views/visaTaiwan/detailView/index.vue')
const modelTable = () => import(/* webpackChunkName: "model" */ '~src/views/model/TableView/index.vue')
const modelEditor = () => import(/* webpackChunkName: "model" */ '~src/views/model/EditorView/index.vue')
const modelInput = () => import(/* webpackChunkName: "model" */ '~src/views/model/InputView/index.vue')
const modelTab = () => import(/* webpackChunkName: "model" */ '~src/views/model/TabView/index.vue')
const modelFull = () => import(/* webpackChunkName: "model" */ '~src/views/model/FullView/index.vue')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/sales/orders', name: 'orderList', component: orderList },
    { path: '/sales/order/:id', name: 'order', component: orderDetail },
    { path: '/sales/hotels', name: 'hotelList', component: hotelList },
    { path: '/sales/hotel/add', name: 'addHotel', component: hotelUpdate },
    { path: '/sales/hotel/update/:id', name: 'updateHotel', component: hotelUpdate },
    { path: '/sales/stock', name: 'salesStock', component: salesStock },
    { path: '/sales/stock/:pType/add', name: 'salesStockAdd', component: salesEditStock },
    { path: '/sales/stock/edit/:id', name: 'salesStockEdit', component: salesEditStock },
    { path: '/sales/special/:type?', name: 'specialList', component: specialList },
    { path: '/sales/special/:type/:operation/:id?', name: 'specialEdit', component: specialEdit },
    { path: '/dreamTrip/orders', name: 'dreamTripOrder', component: dreamTripOrder },
    { path: '/visatw', name: 'visaTwOrderList', component: visaTaiwanIndex },
    { path: '/visatw/detail', name: 'visaTwOrder', component: visaTaiwanDetail },
    { path: '/model/table', name: 'modelTable', component: modelTable },
    { path: '/model/editor', name: 'modelEditor', component: modelEditor },
    { path: '/model/input', name: 'modelInput', component: modelInput },
    { path: '/model/tab', name: 'modelTab', component: modelTab },
    { path: '/model/full', name: 'modelFull', component: modelFull }
  ]
})
