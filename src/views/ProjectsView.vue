<script setup>
import { computed, ref } from 'vue'
import { usePortfolioData } from '../composables/usePortfolioData'

const { projects, categories, loading, error } = usePortfolioData()
const activeCategory = ref('All')

const filteredProjects = computed(() => {
  if (activeCategory.value === 'All') {
    return projects.value
  }
  return projects.value.filter((project) => (project.category || 'Other') === activeCategory.value)
})
</script>

<template>
  <main class="page">
    <section class="container">
      <h1>Projects</h1>
      <p class="lead">All published projects grouped by category.</p>

      <p v-if="loading">Loading projects...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <template v-else>
        <div class="tabs">
          <button
            class="tab"
            :class="{ active: activeCategory === 'All' }"
            @click="activeCategory = 'All'"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category"
            class="tab"
            :class="{ active: activeCategory === category }"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="grid">
          <article v-for="project in filteredProjects" :key="project.id" class="card">
            <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" loading="lazy" />
            <h2>{{ project.title }}</h2>
            <p>{{ project.summary }}</p>
            <p class="meta">{{ project.category }}</p>
            <div class="links">
              <RouterLink :to="`/projects/${project.id}`">Details</RouterLink>
              <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank" rel="noreferrer">Live</a>
              <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noreferrer">Repo</a>
            </div>
          </article>
        </div>
      </template>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding: 2.5rem 0 4rem;
}

.container {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 0 1.25rem;
}

h1 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  margin-bottom: 0.5rem;
}

.lead {
  margin-bottom: 1rem;
  color: #6b7280;
}

.error {
  color: #dc2626;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0 1.25rem;
}

.tab {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  cursor: pointer;
}

.tab.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 0.9rem;
}

img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.7rem;
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 0.35rem;
}

.meta {
  margin: 0.4rem 0 0.6rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.links {
  display: flex;
  gap: 0.65rem;
}

a {
  color: #4f46e5;
  text-decoration: none;
}
</style>
