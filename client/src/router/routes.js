
import store from '../store/index' // your vuex store 

const verifyAdmin = (req, res, next) => {
  if(isAuthenticated)
  store.getters.userType == "admin" ? next() : next(res);
  else
  next("/login")
}

const verifyManager = (req, res, next) => {
  if(isAuthenticated)
  store.getters.userType == "manager" || store.getters.userType == "admin" ? next() : next(res);
  else
  next("/login")
}

const verifyMentor = (req, res, next) => {
  if(isAuthenticated)
  store.getters.userType == "mentor" || store.getters.userType == "manager" || store.getters.userType == "admin" ? next() : next(res);
  else
  next("/login")
}

const verifyUser = (req, res, next) => {
  if(isAuthenticated)
  store.getters.userType == "user" || store.getters.userType == "mentor" || store.getters.userType == "manager" || store.getters.userType == "admin" ? next() : next("/login");
  else
  next("/login")
}

const isAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    return true
  }
  return false
}

const isNotAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    return next("/")
  }
  return next();
}

const routes = [
   {
    path: '/login',
    component: () => import('pages/Login.vue'),
    beforeEnter: isNotAuthenticated,
  },
  {
    path: '/',
    component: () => import('pages/Dashboard.vue'),
    beforeEnter: verifyUser,
  },
  {
    path: '/profile/*',
    component: () => import('pages/Profile.vue'),
  },
  {
    path: '/users',
    component: () => import('pages/Users.vue'),
    beforeEnter: verifyManager,
  },
  {
    path: '/events',
    component: () => import('pages/Events.vue'),
    beforeEnter: verifyUser,
  },
  {
    path: '/skills',
    component: () => import('pages/Skills.vue'),
    beforeEnter: verifyUser,
  },
  {
    path: '/daily-reports',
    component: () => import('pages/TimeSheets.vue'),
    beforeEnter: verifyUser,
  },
  {
    path: '/announcements',
    component: () => import('pages/Announcements.vue'),
    beforeEnter: verifyUser,
  },
  {
    path: '/teams',
    component: () => import('pages/Teams.vue'),
    beforeEnter: verifyManager,
  },
    // Always leave this as last one,
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  }
]

export default routes
