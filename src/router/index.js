import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Upload from '../views/Upload.vue'
import LoanApply from '../views/LoanApply.vue'
import RepaymentPlan from '../views/RepaymentPlan.vue'
import RepaymentRecord from '../views/RepaymentRecord.vue'
import CreditScore from '../views/CreditScore.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload,
      meta: { requiresAuth: true }
    },
    {
      path: '/loan-apply',
      name: 'LoanApply',
      component: LoanApply,
      meta: { requiresAuth: true }
    },
    {
      path: '/repayment-plan',
      name: 'RepaymentPlan',
      component: RepaymentPlan,
      meta: { requiresAuth: true }
    },
    {
      path: '/repayment-record',
      name: 'RepaymentRecord',
      component: RepaymentRecord,
      meta: { requiresAuth: true }
    },
    {
      path: '/credit-score',
      name: 'CreditScore',
      component: CreditScore,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('currentUser');
  if (to.meta.requiresAuth && !currentUser) {
    next('/login');
  } else if (to.path === '/login' && currentUser) {
    next('/');
  } else {
    next();
  }
})

export default router