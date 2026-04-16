<script setup>
import { usePortfolioData } from '../composables/usePortfolioData'

const { certificates, loading, error } = usePortfolioData()
</script>

<template>
  <main class="page">
    <section class="container">
      <h1>Certificates</h1>
      <p class="lead">Verified achievements and professional credentials.</p>

      <p v-if="loading">Loading certificates...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <div v-else class="grid">
        <article v-for="certificate in certificates" :key="certificate.id" class="card">
          <img
            v-if="certificate.imageUrl"
            :src="certificate.imageUrl"
            :alt="certificate.title"
            loading="lazy"
          />
          <h2>{{ certificate.title }}</h2>
          <p>{{ certificate.issuer }} • {{ certificate.year }}</p>
          <a
            v-if="certificate.verifyUrl"
            :href="certificate.verifyUrl"
            target="_blank"
            rel="noreferrer"
          >
            Verify certificate
          </a>
        </article>
      </div>
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

a {
  display: inline-block;
  margin-top: 0.6rem;
  color: #4f46e5;
  text-decoration: none;
}
</style>
