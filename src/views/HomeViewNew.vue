<template>
  <main class="portfolio-page">
    <section id="home" class="hero section-light">
      <div class="shell">
        <header class="top-nav">
          <div class="brand">
            <iconify-icon class="brand-dot" icon="tabler:fingerprint"></iconify-icon>
            <span>Personal</span>
          </div>
          <nav class="nav-links">
            <button
              v-for="item in navItems"
              :key="item.id"
              type="button"
              :class="{ active: activeSection === item.id }"
              @click="handleNavClick(item.id)"
            >
              {{ item.label }}
            </button>
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
          <RouterLink to="/certificates" class="resume-btn">Resume ⤓</RouterLink>
        </header>
        <nav class="mobile-menu" :class="{ open: mobileMenuOpen }">
          <button
            v-for="item in navItems"
            :key="`mobile-${item.id}`"
            type="button"
            :class="{ active: activeSection === item.id }"
            @click="handleNavClick(item.id)"
          >
            {{ item.label }}
          </button>
        </nav>

        <div class="hero-content">
          <div class="hero-copy">
            <p class="eyebrow">Hello I’am <strong>Evren Shah.</strong></p>
            <h1>
              Frontend Developer<br />
              Based In <strong>India.</strong>
            </h1>
            <p class="hero-text">
              I’m Evren Shah. Lorem ipsum is simply dummy text of the printing and typesetting industry.
              Lorem ipsum has been the industry’s standard dummy text ever since the 1500s.
            </p>
            <div class="hero-socials">
              <a href="#" aria-label="github"><iconify-icon icon="mdi:github"></iconify-icon></a>
              <a href="#" aria-label="dribbble"><iconify-icon icon="mdi:dribbble"></iconify-icon></a>
              <a href="#" aria-label="twitter"><iconify-icon icon="mdi:twitter"></iconify-icon></a>
              <a href="#" aria-label="linkedin"><iconify-icon icon="mdi:linkedin"></iconify-icon></a>
            </div>
          </div>
          <div class="hero-illustration">
            <img :src="heroBannerImage" alt="Hero banner illustration" />
          </div>
        </div>
      </div>
    </section>

    <section id="skills" class="section-light">
      <div class="shell">
        <h2 class="section-title">My <strong>Skills</strong></h2>
        <div class="skills-grid">
          <article
            v-for="(skill, index) in skills"
            :key="`${skill.name}-${index}`"
            class="skill-card"
            :class="{ active: selectedSkillIndex === index }"
            tabindex="0"
            @mouseenter="selectedSkillIndex = index"
            @focus="selectedSkillIndex = index"
          >
            <span class="skill-icon"><iconify-icon :icon="skill.icon"></iconify-icon></span>
            <p>{{ skill.name }}</p>
          </article>
        </div>
        <p class="interactive-note">Focused skill: {{ skills[selectedSkillIndex]?.name }}</p>
      </div>
    </section>

    <section class="section-dark experience">
      <div class="shell">
        <h2 class="section-title">My <strong>Experience</strong></h2>
        <div class="experience-list">
          <article v-for="item in experiences" :key="item.company" class="experience-card">
            <div class="experience-head">
              <h3>
                <span class="company-mark"><iconify-icon :icon="item.mark"></iconify-icon></span>
                {{ item.role }} at {{ item.company }}
              </h3>
              <span>{{ item.period }}</span>
            </div>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="about" class="section-light about">
      <div class="shell about-grid">
        <div class="about-portrait">
          <img :src="aboutImage" alt="About profile illustration" />
        </div>
        <div>
          <h2 class="section-title">About <strong>Me</strong></h2>
          <p>
            I’m a product designer and front-end developer focused on crafting clear, useful digital
            experiences. I combine clean visual design with practical engineering to build interfaces
            that are fast, maintainable, and easy to use.
          </p>
          <p>
            My work spans design systems, landing pages, and full web applications. I care about
            accessibility, consistency, and shipping polished details that improve real user outcomes.
          </p>
        </div>
      </div>
    </section>

    <section id="projects" class="section-dark projects">
      <div class="shell">
        <h2 class="section-title">My <strong>Projects</strong></h2>
        <div v-if="projectCategories.length" class="project-filters">
          <button
            v-for="category in projectCategories"
            :key="category"
            type="button"
            :class="{ active: selectedProjectCategory === category }"
            @click="selectedProjectCategory = category"
          >
            {{ category }}
          </button>
        </div>
        <div v-if="loading" class="state">Loading projects...</div>
        <div v-else-if="error" class="state error">{{ error }}</div>
        <div v-else class="project-list">
          <article v-for="(project, index) in filteredProjects" :key="project.id" class="project-row">
            <div class="project-image">
              <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" loading="lazy" />
              <div v-else class="project-fallback">{{ String(index + 1).padStart(2, '0') }}</div>
            </div>
            <div class="project-copy">
              <p class="project-index">{{ String(index + 1).padStart(2, '0') }}</p>
              <h3>{{ project.title }}</h3>
              <p>{{ project.summary || 'No description available for this project yet.' }}</p>
              <RouterLink :to="`/projects/${project.id}`" class="project-link">↗</RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section-light highlights">
      <div class="shell">
        <h2 class="section-title">What I <strong>Offer</strong></h2>
        <div class="highlights-grid">
          <article v-for="item in offerings" :key="item.title" class="highlight-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="contact" class="section-light contact">
      <div class="shell contact-grid">
        <form class="contact-form" @submit.prevent="submitContactForm">
          <input v-model="contactForm.name" type="text" placeholder="Your name" />
          <input v-model="contactForm.email" type="email" placeholder="Email" />
          <input v-model="contactForm.website" type="text" placeholder="Your website (if exists)" />
          <textarea v-model="contactForm.message" rows="4" placeholder="How can I help?"></textarea>
          <div class="contact-actions">
            <button type="submit">Get In Touch</button>
            <div class="contact-socials">
              <a href="#" aria-label="github"><iconify-icon icon="mdi:github"></iconify-icon></a>
              <a href="#" aria-label="dribbble"><iconify-icon icon="mdi:dribbble"></iconify-icon></a>
              <a href="#" aria-label="twitter"><iconify-icon icon="mdi:twitter"></iconify-icon></a>
              <a href="#" aria-label="linkedin"><iconify-icon icon="mdi:linkedin"></iconify-icon></a>
            </div>
          </div>
          <p v-if="formError" class="form-feedback error">{{ formError }}</p>
          <p v-if="formSuccess" class="form-feedback success">{{ formSuccess }}</p>
        </form>
        <div class="contact-copy">
          <h2>Let’s talk for Something special</h2>
          <p>
            I seek to push the limits of creativity to create high-engaging user-friendly and memorable
            interactive experiences.
          </p>
          <p class="contact-item">youremail@gmail.com</p>
          <p class="contact-item">1234567890</p>
        </div>
      </div>
    </section>

    <footer class="footer section-dark">
      <div class="shell footer-inner">
        <div class="brand">
          <iconify-icon class="brand-dot" icon="tabler:fingerprint"></iconify-icon>
          <span>Personal</span>
        </div>
        <p>© 2019-2023 Personal · Made in Figma</p>
      </div>
    </footer>

    <button
      v-show="showBackToTop"
      type="button"
      class="back-to-top"
      aria-label="Back to top"
      @click="scrollToSection('home')"
    >
      <iconify-icon icon="mdi:arrow-up"></iconify-icon>
    </button>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePortfolioData } from '@/composables/usePortfolioData'
import heroBannerImage from '@/assets/Hero-Banner.svg'
import aboutImage from '@/assets/About-me-pic.svg'

const { projects, loading, error } = usePortfolioData()

const navItems = [
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Project' },
  { id: 'contact', label: 'Contact Me' },
]

const activeSection = ref('home')
const showBackToTop = ref(false)
const mobileMenuOpen = ref(false)
const selectedProjectCategory = ref('All')
const selectedSkillIndex = ref(1)
const contactForm = ref({
  name: '',
  email: '',
  website: '',
  message: '',
})
const formError = ref('')
const formSuccess = ref('')

const projectCategories = computed(() => [
  'All',
  ...Array.from(new Set(projects.value.map((project) => project.category || 'Other'))),
])

const filteredProjects = computed(() => {
  const base =
    selectedProjectCategory.value === 'All'
      ? projects.value
      : projects.value.filter((project) => (project.category || 'Other') === selectedProjectCategory.value)
  return base.slice(0, 3)
})

const skills = [
  { name: 'Git', icon: 'mdi:git' },
  { name: 'Javascript', icon: 'mdi:language-javascript', active: true },
  { name: 'Sass/Scss', icon: 'mdi:sass' },
  { name: 'Nest.Js', icon: 'simple-icons:nestjs' },
  { name: 'Storybook', icon: 'simple-icons:storybook' },
  { name: 'Nest.Js', icon: 'simple-icons:nestjs' },
  { name: 'Git', icon: 'mdi:git' },
  { name: 'Storybook', icon: 'simple-icons:storybook' },
  { name: 'Socket.io', icon: 'simple-icons:socketdotio' },
  { name: 'Sass/Scss', icon: 'mdi:sass' },
]

const experiences = [
  {
    role: 'Lead Software Engineer',
    company: 'Google',
    mark: 'logos:google-icon',
    period: 'Nov 2019 - Present',
    description:
      'Led end-to-end implementation across major product areas and improved platform quality by driving performance, architecture, and developer tooling initiatives.',
  },
  {
    role: 'Software Engineer',
    company: 'YouTube',
    mark: 'logos:youtube-icon',
    period: 'Jan 2017 - Oct 2019',
    description:
      'Built internal systems and creator-facing features, focusing on reliability, delivery speed, and measurable UX improvements for core surfaces.',
  },
  {
    role: 'Junior Software Engineer',
    company: 'Apple',
    mark: 'logos:apple',
    period: 'Jan 2016 - Dec 2017',
    description:
      'Contributed to foundational UI modules and collaborated across design and engineering teams to ship maintainable components at scale.',
  },
]

const offerings = [
  {
    title: 'Website Design',
    text: 'Modern interface design focused on clear structure, branding consistency, and user-friendly layout.',
  },
  {
    title: 'Frontend Development',
    text: 'Fast and responsive web apps built with clean component architecture and maintainable code.',
  },
  {
    title: 'Performance Optimization',
    text: 'Improved loading speed, accessibility, and SEO to deliver better user experience and reach.',
  },
]

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (!section) return
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleNavClick(sectionId) {
  mobileMenuOpen.value = false
  scrollToSection(sectionId)
}

function updateScrollState() {
  const sectionIds = ['home', 'skills', 'about', 'projects', 'contact']
  const triggerLine = window.scrollY + 120

  for (const id of sectionIds) {
    const element = document.getElementById(id)
    if (!element) continue
    const start = element.offsetTop
    const end = start + element.offsetHeight
    if (triggerLine >= start && triggerLine < end) {
      activeSection.value = id
      break
    }
  }

  showBackToTop.value = window.scrollY > 500
}

function submitContactForm() {
  formError.value = ''
  formSuccess.value = ''

  const { name, email, message } = contactForm.value
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!name.trim() || !email.trim() || !message.trim()) {
    formError.value = 'Please fill name, email, and message.'
    return
  }

  if (!emailPattern.test(email)) {
    formError.value = 'Please enter a valid email address.'
    return
  }

  formSuccess.value = 'Thanks! Your message is ready to be sent.'
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollState, { passive: true })
  updateScrollState()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
})
</script>

<style scoped>
.portfolio-page {
  background: #e9e9e9;
  color: #101010;
}

.shell {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 0 1.25rem;
}

.section-light {
  background: #e9e9e9;
  padding: 1.6rem 0;
}

.section-dark {
  background: #0b0b0b;
  color: #f4f4f4;
  padding: 1.9rem 0;
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

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
  font-size: 0.88rem;
}

.brand-dot {
  font-size: 0.95rem;
}

.nav-links {
  display: flex;
  gap: 1.4rem;
}

.nav-links button {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font-size: 0.83rem;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.nav-links button.active {
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

.menu-toggle iconify-icon {
  font-size: 1.05rem;
}

.mobile-menu {
  display: none;
}

.resume-btn {
  text-decoration: none;
  color: #fff;
  background: #111;
  border: 1px solid #111;
  border-radius: 0.35rem;
  padding: 0.45rem 0.8rem;
  font-size: 0.78rem;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: end;
  border-bottom: 1px solid #202020;
  padding: 4.1rem 0 0.9rem;
}

.eyebrow {
  font-size: 1.8rem;
  line-height: 1.1;
  margin-bottom: 0.2rem;
}

h1 {
  font-size: 2.3rem;
  line-height: 1.06;
  font-weight: 700;
  margin-bottom: 0.45rem;
}

.hero-text {
  max-width: 560px;
  color: #4a4a4a;
  font-size: 0.82rem;
  line-height: 1.45;
}

.hero-socials {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.65rem;
}

.hero-socials a {
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

.hero-socials iconify-icon,
.contact-socials iconify-icon {
  font-size: 0.88rem;
}

.hero-illustration {
  height: 250px;
  display: grid;
  place-items: end center;
}

.hero-illustration img {
  width: min(100%, 360px);
  max-height: 250px;
  object-fit: contain;
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.section-title strong {
  font-weight: 700;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.8rem;
}

.skill-card {
  border: 1px solid #262626;
  min-height: 90px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 0.6rem;
  background: #f8f8f8;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.skill-card.active {
  background: #0f0f0f;
  color: #fff;
  transform: translateY(-2px);
}

.skill-icon {
  font-weight: 700;
  margin-bottom: 0.3rem;
  display: block;
}

.skill-card p {
  font-size: 0.84rem;
}

.interactive-note {
  margin-top: 0.5rem;
  font-size: 0.76rem;
  color: #555;
  text-align: center;
}

.experience .section-title,
.projects .section-title {
  color: #fff;
}

.experience-list {
  display: grid;
  gap: 1rem;
}

.experience-card {
  border: 1px solid #2d2d2d;
  border-radius: 0.35rem;
  padding: 0.9rem;
  background: #111;
}

.experience-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.55rem;
}

.experience-head h3 {
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.company-mark {
  width: 1rem;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}

.experience-head span {
  font-size: 0.74rem;
  color: #9b9b9b;
}

.experience-card p {
  font-size: 0.78rem;
  color: #c7c7c7;
}

.about-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 0.7rem;
  align-items: center;
}

.about-portrait {
  border: 0px solid #1b1b1b;
  border-radius: 0.45rem;
  min-height: 250px;
  background: transparent;
  overflow: hidden;
}

.about-portrait img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.about p {
  font-size: 0.84rem;
  color: #3f3f3f;
  margin-bottom: 0.55rem;
}

.project-list {
  display: grid;
  gap: 1.15rem;
}

.project-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
}

.project-filters button {
  border: 1px solid #494949;
  background: transparent;
  color: #d8d8d8;
  border-radius: 999px;
  padding: 0.22rem 0.6rem;
  font-size: 0.72rem;
  cursor: pointer;
}

.project-filters button.active {
  background: #fff;
  color: #111;
  border-color: #fff;
}

.project-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
  align-items: center;
}

.project-row:nth-child(2n) .project-image {
  order: 2;
}

.project-row:nth-child(2n) .project-copy {
  order: 1;
}

.project-image {
  border-radius: 0.45rem;
  overflow: hidden;
  border: 1px solid #222;
  min-height: 180px;
  background: #181818;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-fallback {
  width: 100%;
  height: 100%;
  min-height: 180px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: #8f8f8f;
}

.project-index {
  font-size: 1.7rem;
  font-weight: 700;
}

.project-copy h3 {
  font-size: 1.4rem;
  margin: 0.15rem 0;
}

.project-copy p {
  font-size: 0.82rem;
  color: #c3c3c3;
  max-width: 460px;
}

.project-link {
  text-decoration: none;
  color: #fff;
  display: inline-block;
  margin-top: 0.6rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.highlight-card {
  border: 1px solid #d4d4d4;
  border-radius: 0.55rem;
  background: #f6f6f6;
  padding: 1.1rem;
  min-height: 130px;
}

.highlight-card h3 {
  font-size: 1.15rem;
  margin-bottom: 0.55rem;
  font-weight: 700;
}

.highlight-card p {
  font-size: 0.82rem;
  color: #3f3f3f;
  line-height: 1.55;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.3rem;
}

.contact-form {
  display: grid;
  gap: 0.45rem;
}

.contact-form input,
.contact-form textarea {
  border: 1px solid #1e1e1e;
  background: #ececec;
  padding: 0.5rem 0.55rem;
  border-radius: 0.12rem;
  font: inherit;
}

.contact-form button {
  border: 0;
  background: #111;
  color: #fff;
  padding: 0.58rem 0.72rem;
  cursor: pointer;
  justify-self: start;
}

.form-feedback {
  font-size: 0.76rem;
  margin-top: 0.1rem;
}

.form-feedback.error {
  color: #b91c1c;
}

.form-feedback.success {
  color: #166534;
}

.contact-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-socials {
  display: inline-flex;
  gap: 0.4rem;
}

.contact-socials a {
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

.contact-copy h2 {
  font-size: 2.2rem;
  line-height: 1.05;
  margin-bottom: 0.4rem;
}

.contact-copy p {
  font-size: 0.84rem;
  color: #3e3e3e;
}

.contact-item {
  color: #111 !important;
  font-weight: 600;
  margin-top: 0.45rem;
}

.footer {
  padding: 0.8rem 0;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.78rem;
}

.state {
  color: #d0d0d0;
  text-align: center;
  padding: 1rem 0;
}

.state.error {
  color: #ff6b6b;
}

.back-to-top {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: 2.2rem;
  height: 2.2rem;
  border: 0;
  border-radius: 999px;
  background: #111;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 900px) {
  .hero-content,
  .about-grid,
  .project-row,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .project-row:nth-child(2n) .project-image,
  .project-row:nth-child(2n) .project-copy {
    order: initial;
  }

  .skills-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .highlights-grid {
    grid-template-columns: 1fr;
  }

  .contact-copy h2 {
    font-size: 2.1rem;
  }

  .eyebrow {
    font-size: 1.4rem;
  }

  h1 {
    font-size: 2rem;
  }

  .nav-links {
    display: none;
  }

  .resume-btn {
    display: none;
  }

  .menu-toggle {
    display: grid;
  }

  .top-nav {
    padding: 0.5rem 1rem;
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

  .mobile-menu button {
    border: 0;
    background: transparent;
    text-align: left;
    padding: 0.55rem 0.45rem;
    border-radius: 0.3rem;
    font-size: 0.86rem;
    cursor: pointer;
  }

  .mobile-menu button.active {
    background: #111;
    color: #fff;
  }
}
</style>
