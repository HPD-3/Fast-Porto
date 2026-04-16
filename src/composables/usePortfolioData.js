import { computed, ref } from 'vue'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

const projects = ref([])
const certificates = ref([])
const loading = ref(true)
const error = ref('')
let started = false

export function usePortfolioData() {
  if (!started) {
    started = true
    const projectsQuery = query(
      collection(db, 'projects'),
      where('status', '==', 'published'),
      orderBy('category'),
      orderBy('title'),
    )
    const certificatesQuery = query(
      collection(db, 'certificates'),
      where('status', '==', 'published'),
      orderBy('year', 'desc'),
      orderBy('title'),
    )

    let projectsLoaded = false
    let certificatesLoaded = false
    const finishLoading = () => {
      if (projectsLoaded && certificatesLoaded) {
        loading.value = false
      }
    }

    onSnapshot(
      projectsQuery,
      (snapshot) => {
        projects.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        projectsLoaded = true
        finishLoading()
      },
      (err) => {
        error.value = err.message
        projectsLoaded = true
        finishLoading()
      },
    )

    onSnapshot(
      certificatesQuery,
      (snapshot) => {
        certificates.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        certificatesLoaded = true
        finishLoading()
      },
      (err) => {
        error.value = err.message
        certificatesLoaded = true
        finishLoading()
      },
    )
  }

  const categories = computed(() =>
    Array.from(new Set(projects.value.map((project) => project.category || 'Other'))),
  )

  return {
    projects,
    certificates,
    categories,
    loading,
    error,
  }
}
