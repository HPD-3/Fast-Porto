<script setup>
import { computed, ref } from 'vue'
import { usePortfolioData } from '../composables/usePortfolioData'
import BrandLogo from '@/components/BrandLogo.vue'

const { projects, categories, loading, error } = usePortfolioData()
const activeCategory = ref('All')
const mobileMenuOpen = ref(false)
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certificates', to: '/certificates' },
]

const filteredProjects = computed(() => {
  if (activeCategory.value === 'All') {
    return projects.value
  }
  return projects.value.filter((project) => (project.category || 'Other') === activeCategory.value)
})
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
  padding: 1.8rem 0 3rem;
  background: #e9e9e9;
  min-height: 100vh;
}

.container {
  width: min(100%, 1080px);
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

h1 {
  font-size: clamp(2rem, 4vw, 2.4rem);
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
}

.lead {
  margin-bottom: 0.8rem;
  color: #4a4a4a;
}

.error {
  color: #dc2626;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.8rem 0 1rem;
}

.tab {
  border: 1px solid #494949;
  background: transparent;
  color: #1f1f1f;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.tab.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
  align-items: start;
}

.card {
  border: 1px solid #2d2d2d;
  border-radius: 0.85rem;
  padding: 0.85rem;
  background: #111;
  color: #f3f3f3;
  width: 100%;
  max-width: 520px;
}

img {
  width: 100%;
  height: 165px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.65rem;
}

h2 {
  font-size: 1.25rem;
  margin-bottom: 0.3rem;
  letter-spacing: -0.02em;
}

.meta {
  margin: 0.35rem 0 0.55rem;
  font-size: 0.8rem;
  color: #a3a3a3;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

a,
.links :deep(a) {
  color: #fff;
  text-decoration: none;
  border: 1px solid #fff;
  border-radius: 999px;
  padding: 0.22rem 0.62rem;
  font-size: 0.74rem;
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
