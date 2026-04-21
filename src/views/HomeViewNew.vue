<template>
  <main class="portfolio-page">
    <section id="home" class="hero section-light">
      <div class="shell">
        <header class="top-nav">
          <BrandLogo name="Hafidh" :invert="true" />
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
          <a
            href="https://drive.google.com/file/d/1-0XqrkubeV1dJkkKsoolgHcq2sFEpK3E/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            class="resume-btn"
          >
            CV ⤓
          </a>
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
            <p class="eyebrow">Hello I’am <strong>Muhamad Hafidh Khoerullah.</strong></p>
            <h1>
              Web Developer<br />
              Based In <strong>Bogor, Indonesia.</strong>
            </h1>
            <p class="hero-text">
              Vocational high school student majoring in Software and Game Development with hands-on
              experience building fullstack web applications, API integrations, and database-driven
              products using Vue, React, Node.js, Express, Laravel, MySQL, Firebase, and Google Cloud.
            </p>
            <SocialLinks class="hero-socials" />
          </div>
          <div class="hero-illustration">
            <img :src="heroBannerImage" alt="Hero banner illustration" />
          </div>
        </div>
      </div>
    </section>

    <section id="skills" class="section-light">
      <div class="shell">
        <SectionTitle normal="My " highlight="Skills" />
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
        <SectionTitle normal="My " highlight="Experience" :dark="true" />
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
          <SectionTitle normal="About " highlight="Me" />
          <p>
            I’m a web developer and cloud enthusiast from Bogor, Indonesia. I focus on building useful
            digital products with clean interfaces, dependable backend logic, and practical workflows
            that are easy to maintain and grow.
          </p>
          <p>
            My background includes fullstack web apps, school and event projects, REST API integration,
            database management, and collaborative development through internships, bootcamps, and hackathon-style work.
          </p>
        </div>
      </div>
    </section>

    <section id="projects" class="section-dark projects">
      <div class="shell">
        <SectionTitle normal="My " highlight="Projects" :dark="true" />
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

    <section id="certificates" class="section-light certificates">
      <div class="shell">
        <SectionTitle normal="My " highlight="Certificates" />
        <div v-if="loading" class="state">Loading certificates...</div>
        <div v-else class="highlights-grid">
          <article v-for="certificate in featuredCertificates" :key="certificate.id" class="highlight-card">
            <div class="certificate-image-wrap">
              <img
                v-if="certificate.imageUrl"
                :src="normalizeImageUrl(certificate.imageUrl)"
                :alt="certificate.title"
                class="certificate-image"
                @error="onImageError"
                loading="lazy"
              />
              <div v-else class="certificate-image placeholder">Certificate Preview</div>
            </div>
            <h3>{{ certificate.title }}</h3>
            <p>{{ certificate.issuer }} · {{ certificate.year }}</p>
            <a
              v-if="certificate.verifyUrl"
              :href="normalizeExternalUrl(certificate.verifyUrl)"
              target="_blank"
              rel="noopener noreferrer"
              class="certificate-link"
            >
              Verify ↗
            </a>
          </article>
        </div>
        <div v-if="certificates.length > featuredCertificates.length" class="certificates-actions">
          <RouterLink to="/certificates" class="see-all-certificates">See All Certificates</RouterLink>
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
            <SocialLinks class="contact-socials" />
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
        <BrandLogo name="Hafidh" />
        <p class="footer-center-text">© 2024-{{ currentYear }} Hafidh · Made With ❤︎</p>
        <span class="footer-spacer" aria-hidden="true"></span>
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
import BrandLogo from '@/components/BrandLogo.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import SocialLinks from '@/components/SocialLinks.vue'

const { projects, certificates, loading, error } = usePortfolioData()

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
const currentYear = new Date().getFullYear()

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

const featuredCertificates = computed(() => certificates.value.slice(0, 6))

const skills = [
  { name: 'JavaScript', icon: 'mdi:language-javascript' },
  { name: 'Vue.js', icon: 'simple-icons:vuedotjs', active: true },
  { name: 'React', icon: 'simple-icons:react' },
  { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
  { name: 'Express.js', icon: 'simple-icons:express' },
  { name: 'Laravel', icon: 'simple-icons:laravel' },
  { name: 'MySQL', icon: 'simple-icons:mysql' },
  { name: 'Firebase', icon: 'simple-icons:firebase' },
  { name: 'Google Cloud', icon: 'simple-icons:googlecloud' },
  { name: 'Git', icon: 'mdi:git' },
]

const experiences = [
  {
    role: 'Fullstack Developer',
    company: 'Coding Camp 2026 in Dicoding by DBS',
    mark: 'simple-icons:dicoding',
    period: 'Jan 2026 - Present',
    description:
      'Learning fullstack web development through frontend and backend technologies, RESTful APIs, MySQL, Firebase integration, Git, and deployment workflows with Vercel.',
  },
  {
    role: 'Web Developer',
    company: 'JHIC 2025',
    mark: 'mdi:web',
    period: 'Aug 2025',
    description:
      'Developed a responsive school website using HTML, CSS, JavaScript, and Tailwind CSS while collaborating in a team environment.',
  },
  {
    role: 'Game Developer',
    company: 'Indonesia Game Week',
    mark: 'mdi:gamepad-variant',
    period: 'Aug 2025',
    description:
      'Built a Jakarta-themed educational game in GDevelop, designing gameplay mechanics, assets, and UI within a limited event schedule.',
  },
  {
    role: 'Fullstack Developer',
    company: 'Coding Camp 2025 in Dicoding by DBS',
    mark: 'simple-icons:dicoding',
    period: 'Feb 2024 - Nov 2025',
    description:
      'Developed a solar panel monitoring web app using Node.js, API integration, data handling, and responsive interfaces for dashboard-style monitoring.',
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

  const { name, email, website, message } = contactForm.value
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!name.trim() || !email.trim() || !message.trim()) {
    formError.value = 'Please fill name, email, and message.'
    return
  }

  if (!emailPattern.test(email)) {
    formError.value = 'Please enter a valid email address.'
    return
  }

  const targetEmail = 'hapidh333@gmail.com'
  const subject = encodeURIComponent(`Portfolio inquiry from ${name.trim()}`)
  const body = encodeURIComponent(
    `Name: ${name.trim()}\nEmail: ${email.trim()}\nWebsite: ${website.trim() || '-'}\n\nMessage:\n${message.trim()}`,
  )

  window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`
  formSuccess.value = 'Opening your email app with pre-filled message...'
}

function normalizeExternalUrl(url) {
  const value = String(url || '').trim()
  if (!value) return '#'
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
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

.nav-links {
  display: flex;
  gap: 1.4rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
  margin-left: auto;
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
  margin-left: auto;
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
  display: flex;
  flex-direction: column;
}

.certificate-image-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.65rem;
  background: #e9e9e9;
  border: 1px solid #d8d8d8;
}

.certificate-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.certificate-image.placeholder {
  display: grid;
  place-items: center;
  color: #6b6b6b;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
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

.certificate-link {
  display: inline-block;
  margin-top: 0.55rem;
  text-decoration: none;
  color: #111;
  font-size: 0.85rem;
  font-weight: 600;
}

.certificates-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.see-all-certificates {
  text-decoration: none;
  color: #fff;
  background: #111;
  border: 1px solid #111;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  font-size: 0.78rem;
}

.footer-center-text {
  margin: 0;
  justify-self: center;
  text-align: center;
}

.footer-spacer {
  justify-self: end;
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

@media (max-width: 640px) {
  .highlights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
