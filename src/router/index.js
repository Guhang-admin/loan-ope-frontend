import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Upload from '../views/Upload.vue'
import LoanApply from '../views/LoanApply.vue'
import RepaymentPlan from '../views/RepaymentPlan.vue'
import RepaymentRecord from '../views/RepaymentRecord.vue'
import CreditScore from '../views/CreditScore.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/loan-apply',
      name: 'LoanApply',
      component: LoanApply
    },
    {
      path: '/repayment-plan',
      name: 'RepaymentPlan',
      component: RepaymentPlan
    },
    {
      path: '/repayment-record',
      name: 'RepaymentRecord',
      component: RepaymentRecord
    },
    {
      path: '/credit-score',
      name: 'CreditScore',
      component: CreditScore
    }
  ]
})