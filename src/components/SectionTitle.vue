<template>
  <h2 class="section-title" :class="{ 'section-title--dark': dark }">
    {{ normal }}
    <strong>{{ highlight }}</strong>
  </h2>
</template>

<script setup>
defineProps({
  normal: {
    type: String,
    required: true,
  },
  highlight: {
    type: String,
    required: true,
  },
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.section-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.section-title--dark {
  color: #fff;
}

.section-title strong {
  font-weight: 700;
}
</style>
