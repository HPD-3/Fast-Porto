<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioData } from '../composables/usePortfolioData'
import BrandLogo from '@/components/BrandLogo.vue'

const route = useRoute()
const { projects, loading, error } = usePortfolioData()
const mobileMenuOpen = ref(false)
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certificates', to: '/certificates' },
]

const project = computed(() => projects.value.find((item) => item.id === route.params.id))
</script>

<template>
  <main class="page">
    <header class="top-nav">
      <BrandLogo name="Hafidh" :invert="true" />
      <nav class="nav-links">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: item.to === '/projects' }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <button
        type="button"
        class="menu-toggle"
        aria-label="Toggle navigation menu"
        :aria-expanded="mobileMenuOpen"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <iconify-icon :icon="mobileMenuOpen ? 'mdi:close' : 'mdi:menu'"></iconify-icon>
      </button>
    </header>
    <nav class="mobile-menu" :class="{ open: mobileMenuOpen }">
      <RouterLink
        v-for="item in navItems"
        :key="`mobile-${item.to}`"
        :to="item.to"
        class="mobile-link"
        :class="{ active: item.to === '/projects' }"
        @click="mobileMenuOpen = false"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
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
  padding: 1.8rem 0 3rem;
  background: #e9e9e9;
  min-height: 100vh;
}

.container {
  width: min(100%, 920px);
  margin: 0 auto;
  padding: 4.4rem 1.25rem 0;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(100%, 1080px);
  padding: 0.6rem 1.25rem;
  background: rgba(233, 233, 233, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #cfcfcf;
  z-index: 50;
}

.nav-links {
  display: flex;
  gap: 1.2rem;
}

.nav-link {
  text-decoration: none;
  color: #111;
  font-size: 0.82rem;
  border-bottom: 1px solid transparent;
}

.nav-link.active {
  border-bottom-color: #111;
}

.menu-toggle {
  display: none;
  border: 1px solid #111;
  background: transparent;
  border-radius: 0.3rem;
  width: 2rem;
  height: 2rem;
  place-items: center;
  cursor: pointer;
}

.mobile-menu {
  display: none;
}

.back-link {
  text-decoration: none;
  color: #111;
  border: 1px solid #111;
  border-radius: 999px;
  padding: 0.28rem 0.75rem;
  display: inline-block;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.detail-card {
  border: 1px solid #2d2d2d;
  border-radius: 0.85rem;
  padding: 0.95rem;
  background: #111;
  color: #f3f3f3;
}

.hero-image {
  width: 100%;
  max-height: 330px;
  object-fit: cover;
  border-radius: 0.65rem;
  margin-bottom: 0.85rem;
}

h1 {
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  margin-bottom: 0.3rem;
  letter-spacing: -0.02em;
}

.meta {
  color: #a3a3a3;
  margin-bottom: 0.75rem;
}

.summary {
  line-height: 1.5;
  margin-bottom: 0.85rem;
  color: #d4d4d4;
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.badge {
  background: #f3f3f3;
  color: #111;
  border-radius: 999px;
  padding: 0.28rem 0.72rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.actions a {
  color: #fff;
  text-decoration: none;
  border: 1px solid #fff;
  border-radius: 999px;
  padding: 0.25rem 0.68rem;
  font-size: 0.78rem;
}

.error {
  color: #dc2626;
}

@media (max-width: 900px) {
  .nav-links {
    display: none;
  }

  .menu-toggle {
    display: grid;
  }

  .mobile-menu {
    display: grid;
    position: fixed;
    top: 3.1rem;
    left: 0.8rem;
    right: 0.8rem;
    background: rgba(233, 233, 233, 0.97);
    border: 1px solid #cfcfcf;
    border-radius: 0.45rem;
    padding: 0.45rem;
    gap: 0.2rem;
    transform: translateY(-10px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 49;
  }

  .mobile-menu.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .mobile-link {
    text-decoration: none;
    color: #111;
    padding: 0.55rem 0.45rem;
    border-radius: 0.3rem;
    font-size: 0.86rem;
  }

  .mobile-link.active {
    background: #111;
    color: #fff;
  }

  .container {
    padding-top: 4.1rem;
  }
}
</style>
