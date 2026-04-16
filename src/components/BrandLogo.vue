<template>
  <div class="brand">
    <img :src="logoImage" alt="Brand logo" class="brand-logo" :class="{ 'brand-logo--invert': invert }" />
    <span>{{ name }}</span>
  </div>
</template>

<script setup>
import logoImage from '@/assets/logo.png'

defineProps({
  name: {
    type: String,
    default: 'Hafidh',
  },
  invert: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
  font-size: 0.88rem;
}

.brand-logo {
  width: 1.35rem;
  height: 1.35rem;
  object-fit: contain;
  display: block;
}

.brand-logo--invert {
  filter: invert(1);
}
</style>
