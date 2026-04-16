<template>
  <div class="social-links" :class="{ 'social-links--dark': dark }">
    <a href="https://github.com/HPD-3" aria-label="github"><iconify-icon icon="mdi:github"></iconify-icon></a>
    <a href="https://www.tiktok.com/@jobswebsites_" aria-label="tiktok"><iconify-icon icon="bxl:tiktok"></iconify-icon></a>
    <a href="https://www.instagram.com/hapidhapit/" aria-label="instagram"><iconify-icon icon="mdi:instagram"></iconify-icon></a>
    <a href="https://www.linkedin.com/in/muhamad-hafidh-khoerullah-0b4997363/" aria-label="linkedin"><iconify-icon icon="mdi:linkedin"></iconify-icon></a>
  </div>
</template>

<script setup>
defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.social-links {
  display: flex;
  gap: 0.5rem;
}

.social-links a {
  width: 1.85rem;
  height: 1.85rem;
  border: 1px solid #111;
  border-radius: 0.2rem;
  display: grid;
  place-items: center;
  text-decoration: none;
  color: #111;
  font-size: 0.68rem;
}

.social-links--dark a {
  border-color: #fff;
  color: #fff;
}

.social-links iconify-icon {
  font-size: 0.88rem;
}
</style>
