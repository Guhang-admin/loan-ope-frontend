import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Upload from '../views/Upload.vue'
import LoanApply from '../views/LoanApply.vue'
import RepaymentPlan from '../views/RepaymentPlan.vue'
import RepaymentRecord from '../views/RepaymentRecord.vue'
import CreditScore from '../views/CreditScore.vue'
import ExamplesIndex from '../views/examples/Index.vue'
import TimeoutExample from '../views/examples/Timeout.vue'
import DataConsistencyExample from '../views/examples/DataConsistency.vue'
import MemoryLeakExample from '../views/examples/MemoryLeak.vue'
import ConcurrencyExample from '../views/examples/Concurrency.vue'
import JSExamplesIndex from '../views/js-examples/Index.vue'
import AsyncExample from '../views/js-examples/Async.vue'
import MemoryLeakJSExample from '../views/js-examples/MemoryLeak.vue'
import DomExample from '../views/js-examples/Dom.vue'
import SecurityExample from '../views/js-examples/Security.vue'

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
    },
    {
      path: '/examples',
      name: 'ExamplesIndex',
      component: ExamplesIndex,
      meta: { requiresAuth: true }
    },
    {
      path: '/examples/timeout',
      name: 'TimeoutExample',
      component: TimeoutExample,
      meta: { requiresAuth: true }
    },
    {
      path: '/examples/dataconsistency',
      name: 'DataConsistencyExample',
      component: DataConsistencyExample,
      meta: { requiresAuth: true }
    },
    {
      path: '/examples/memoryleak',
      name: 'MemoryLeakExample',
      component: MemoryLeakExample,
      meta: { requiresAuth: true }
    },
    {
      path: '/examples/concurrency',
      name: 'ConcurrencyExample',
      component: ConcurrencyExample,
      meta: { requiresAuth: true }
    },
    {
      path: '/js-examples',
      name: 'JSExamplesIndex',
      component: JSExamplesIndex,
      meta: { requiresAuth: true }
    },
    {
      path: '/js-examples/async',
      name: 'AsyncExample',
      component: AsyncExample,
      meta: { requiresAuth: true }
    },
    {
      path: '/js-examples/memoryleak',
      name: 'MemoryLeakJSExample',
      component: MemoryLeakJSExample,
      meta: { requiresAuth: true }
    },
    {
      path: '/js-examples/dom',
      name: 'DomExample',
      component: DomExample,
      meta: { requiresAuth: true }
    },
    {
      path: '/js-examples/security',
      name: 'SecurityExample',
      component: SecurityExample,
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