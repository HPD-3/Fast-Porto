import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeViewNew.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
    },
    {
      path: '/certificates',
      name: 'certificates',
      component: () => import('../views/CertificatesView.vue'),
    },
    {
      path: '/certificates/:id',
      name: 'certificate-detail',
      component: () => import('../views/CertificateDetailView.vue'),
    },
    {
      path: '/:legacyCertificateId(certificate-.+)',
      redirect: (to) => {
        const id = String(to.params.legacyCertificateId).replace(/^certificate-/, '')
        return { name: 'certificate-detail', params: { id } }
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
  ],
})

export default router
