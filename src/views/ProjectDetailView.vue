<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioData } from '../composables/usePortfolioData'

const route = useRoute()
const { projects, loading, error } = usePortfolioData()

const project = computed(() => projects.value.find((item) => item.id === route.params.id))
</script>

<template>
  <main class="page">
    <section class="container">
      <RouterLink to="/projects" class="back-link">← Back to projects</RouterLink>

      <p v-if="loading">Loading project...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <article v-else-if="project" class="detail-card">
        <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" class="hero-image" />
        <h1>{{ project.title }}</h1>
        <p class="meta">{{ project.category }}</p>
        <p class="summary">{{ project.summary }}</p>

        <div v-if="project.techStack?.length" class="stack">
          <span v-for="tech in project.techStack" :key="tech" class="badge">{{ tech }}</span>
        </div>

        <div class="actions">
          <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank" rel="noreferrer">Live Demo</a>
          <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noreferrer">Repository</a>
        </div>
      </article>
      <p v-else class="error">Project not found.</p>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding: 2.5rem 0 4rem;
}

.container {
  width: min(100%, 920px);
  margin: 0 auto;
  padding: 0 1.25rem;
}

.back-link {
  text-decoration: none;
  color: #4f46e5;
  display: inline-block;
  margin-bottom: 1rem;
}

.detail-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 1rem;
}

.hero-image {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 0.65rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  margin-bottom: 0.4rem;
}

.meta {
  color: #6b7280;
  margin-bottom: 0.85rem;
}

.summary {
  line-height: 1.75;
  margin-bottom: 1rem;
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.badge {
  background: #eef2ff;
  color: #3730a3;
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  font-size: 0.85rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.actions a {
  color: #4f46e5;
  text-decoration: none;
}

.error {
  color: #dc2626;
}
</style>
