<script setup>
import { computed, ref } from 'vue'
import { usePortfolioData } from '../composables/usePortfolioData'
import BrandLogo from '@/components/BrandLogo.vue'

const { certificates, loading, error } = usePortfolioData()
const mobileMenuOpen = ref(false)
const selectedIssuer = ref('All')
const selectedYear = ref('All')
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certificates', to: '/certificates' },
]

const issuerOptions = computed(() => [
  'All',
  ...Array.from(
    new Set(
      certificates.value
        .map((certificate) => String(certificate.issuer || '').trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b)),
])

const yearOptions = computed(() => [
  'All',
  ...Array.from(
    new Set(
      certificates.value
        .map((certificate) => String(certificate.year || '').trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => Number(b) - Number(a)),
])

const filteredCertificates = computed(() =>
  certificates.value.filter((certificate) => {
    const issuer = String(certificate.issuer || '').trim()
    const year = String(certificate.year || '').trim()

    const issuerMatches = selectedIssuer.value === 'All' || issuer === selectedIssuer.value
    const yearMatches = selectedYear.value === 'All' || year === selectedYear.value

    return issuerMatches && yearMatches
  }),
)

function resetFilters() {
  selectedIssuer.value = 'All'
  selectedYear.value = 'All'
}

function normalizeImageUrl(url) {
  const value = String(url || '').trim().replace(/i\.ibb\.co\.com/gi, 'i.ibb.co')
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) {
    return value.replace(/^http:\/\//i, 'https://')
  }
  return `https://${value}`
}

function onImageError(event) {
  const original = event.target.dataset.original || event.target.src
  event.target.dataset.original = original
  if (original.includes('i.ibb.co.com')) {
    event.target.src = original.replace('i.ibb.co.com', 'i.ibb.co')
  }
}
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
          :class="{ active: item.to === '/certificates' }"
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
        :class="{ active: item.to === '/certificates' }"
        @click="mobileMenuOpen = false"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <section class="container">
      <h1>Certificates</h1>
      <p class="lead">Verified achievements and professional credentials.</p>

      <div class="filters" aria-label="Certificate filters">
        <label class="filter-group">
          <span>Issuer</span>
          <select v-model="selectedIssuer">
            <option v-for="issuer in issuerOptions" :key="issuer" :value="issuer">{{ issuer }}</option>
          </select>
        </label>
        <label class="filter-group">
          <span>Year</span>
          <select v-model="selectedYear">
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
          </select>
        </label>
        <button type="button" class="reset-button" @click="resetFilters">Clear filters</button>
      </div>

      <p v-if="loading">Loading certificates...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <template v-else>
        <p class="results-count">Showing {{ filteredCertificates.length }} certificate(s)</p>
        <div class="grid">
          <article v-for="certificate in filteredCertificates" :key="certificate.id" class="card">
            <div class="image-wrap">
              <img
                v-if="certificate.imageUrl"
                :src="normalizeImageUrl(certificate.imageUrl)"
                :alt="certificate.title"
                @error="onImageError"
                loading="lazy"
              />
              <div v-else class="image-placeholder">No image</div>
            </div>
            <div class="card-body">
              <h2>{{ certificate.title }}</h2>
              <p class="meta">{{ certificate.issuer }} • {{ certificate.year }}</p>
              <RouterLink
                :to="{ name: 'certificate-detail', params: { id: certificate.id } }"
              >
                Details
              </RouterLink>
              <a
                v-if="certificate.verifyUrl"
                :href="certificate.verifyUrl"
                target="_blank"
                rel="noreferrer"
              >
                Verify certificate
              </a>
            </div>
          </article>
        </div>
        <p v-if="filteredCertificates.length === 0" class="empty-state">
          No certificates match the selected issuer and year.
        </p>
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

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: end;
  margin-bottom: 1rem;
}

.filter-group {
  display: grid;
  gap: 0.35rem;
  min-width: 180px;
}

.filter-group span {
  font-size: 0.78rem;
  color: #4a4a4a;
}

.filter-group select {
  width: 100%;
  border: 1px solid #2d2d2d;
  border-radius: 0.55rem;
  background: #f6f6f6;
  color: #111;
  padding: 0.55rem 0.7rem;
  font: inherit;
}

.reset-button {
  border: 1px solid #111;
  border-radius: 999px;
  background: #111;
  color: #fff;
  padding: 0.55rem 0.9rem;
  font: inherit;
  cursor: pointer;
}

.results-count,
.empty-state {
  margin-bottom: 0.8rem;
  color: #4a4a4a;
  font-size: 0.9rem;
}

.error {
  color: #dc2626;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.image-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #1f1f1f;
  margin-bottom: 0.65rem;
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin-bottom: 0;
  border-radius: 0;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #a3a3a3;
  font-size: 0.82rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
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

a {
  color: #fff;
  text-decoration: none;
  border: 1px solid #fff;
  border-radius: 999px;
  padding: 0.22rem 0.62rem;
  font-size: 0.74rem;
  display: inline-block;
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

  .filters {
    align-items: stretch;
  }

  .filter-group {
    min-width: 0;
    flex: 1 1 100%;
  }

  .reset-button {
    width: 100%;
  }
}
</style>
