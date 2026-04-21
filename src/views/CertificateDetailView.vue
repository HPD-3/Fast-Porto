<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioData } from '../composables/usePortfolioData'
import BrandLogo from '@/components/BrandLogo.vue'

const route = useRoute()
const { certificates, loading, error } = usePortfolioData()
const mobileMenuOpen = ref(false)
const isImageModalOpen = ref(false)
const modalImageUrl = ref('')
const modalImageAlt = ref('')
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certificates', to: '/certificates' },
]

const certificate = computed(() =>
  certificates.value.find((item) => item.id === route.params.id),
)

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

function openImageModal(url, alt) {
  const normalized = normalizeImageUrl(url)
  if (!normalized) return
  modalImageUrl.value = normalized
  modalImageAlt.value = alt || 'Certificate image'
  isImageModalOpen.value = true
}

function closeImageModal() {
  isImageModalOpen.value = false
  modalImageUrl.value = ''
  modalImageAlt.value = ''
}

function onGlobalKeydown(event) {
  if (event.key === 'Escape' && isImageModalOpen.value) {
    closeImageModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
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
      <RouterLink to="/certificates" class="back-link">← Back to certificates</RouterLink>

      <p v-if="loading">Loading certificate...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <article v-else-if="certificate" class="detail-card">
        <img
          v-if="certificate.imageUrl"
          :src="normalizeImageUrl(certificate.imageUrl)"
          :alt="certificate.title"
          class="hero-image"
          @error="onImageError"
          @click="openImageModal(certificate.imageUrl, certificate.title)"
          @keydown.enter.prevent="openImageModal(certificate.imageUrl, certificate.title)"
          @keydown.space.prevent="openImageModal(certificate.imageUrl, certificate.title)"
          tabindex="0"
        />
        <h1>{{ certificate.title }}</h1>
        <p class="meta">{{ certificate.issuer }} • {{ certificate.year }}</p>
        <div class="actions">
          <a
            v-if="certificate.verifyUrl"
            :href="certificate.verifyUrl"
            target="_blank"
            rel="noreferrer"
          >
            Verify Certificate
          </a>
        </div>
      </article>
      <p v-else class="error">Certificate not found.</p>
    </section>

    <div v-if="isImageModalOpen" class="image-modal" @click.self="closeImageModal">
      <button type="button" class="close-modal" @click="closeImageModal" aria-label="Close image preview">
        ✕
      </button>
      <img :src="modalImageUrl" :alt="modalImageAlt" class="modal-image" />
    </div>
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
  height: auto;
  max-height: none;
  object-fit: contain;
  border-radius: 0.65rem;
  margin-bottom: 0.85rem;
  display: block;
  background: #fff;
  cursor: zoom-in;
}

.hero-image:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: grid;
  place-items: center;
  z-index: 100;
  padding: 1rem;
}

.modal-image {
  max-width: min(96vw, 1600px);
  max-height: 92vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
}

.close-modal {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  cursor: pointer;
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
