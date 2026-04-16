<template>
  <main class="landing-new">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-container">
        <Motion
          :initial="{ opacity: 0, x: -50 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="hero-text"
        >
          <p class="hero-subtitle">Welcome to my portfolio</p>
          <h1 class="hero-title">
            <span class="gradient-text">Creative Designer & Developer</span>
          </h1>
          <p class="hero-description">
            Crafting beautiful, high-performance web experiences with modern design principles and cutting-edge technology.
          </p>
          <div class="hero-buttons">
            <RouterLink to="/projects" class="btn btn-primary">View My Work</RouterLink>
            <RouterLink to="/certificates" class="btn btn-secondary">Learn More</RouterLink>
          </div>
        </Motion>

        <Motion
          :initial="{ opacity: 0, x: 50 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.2 }"
          class="hero-image"
        >
          <div class="profile-circle">
            <div class="circle-gradient"></div>
          </div>
        </Motion>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section-new">
      <div class="container">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="section-header"
        >
          <h2 class="section-title">About Me</h2>
          <p class="section-subtitle">Get to know me better</p>
        </Motion>

        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.1 }"
          class="about-grid"
        >
          <div class="about-card">
            <div class="card-icon">💼</div>
            <h3>Professional Experience</h3>
            <p>Multiple years of experience designing and developing web applications that users love.</p>
          </div>
          <div class="about-card">
            <div class="card-icon">🎨</div>
            <h3>Design Focused</h3>
            <p>Attention to detail and a passion for creating intuitive, beautiful user interfaces.</p>
          </div>
          <div class="about-card">
            <div class="card-icon">⚡</div>
            <h3>Performance</h3>
            <p>Building fast, optimized applications that deliver exceptional user experiences.</p>
          </div>
        </Motion>
      </div>
    </section>

    <!-- Education Section -->
    <section class="education-section">
      <div class="container">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="section-header"
        >
          <h2 class="section-title">Latest Education</h2>
          <p class="section-subtitle">My most recent academic background</p>
        </Motion>

        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.1 }"
          class="education-card"
        >
          <h3>{{ latestEducation.degree }}</h3>
          <p class="education-institution">{{ latestEducation.institution }}</p>
          <p class="education-period">{{ latestEducation.period }}</p>
          <p class="education-focus">{{ latestEducation.focus }}</p>
        </Motion>
      </div>
    </section>

    <!-- Technologies Section -->
    <section class="technologies-section">
      <div class="container">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="section-header"
        >
          <h2 class="section-title">Technologies & Tools</h2>
          <p class="section-subtitle">Technologies I work with</p>
        </Motion>

        <div class="tech-grid">
          <Motion
            v-for="(tech, index) in technologies"
            :key="tech"
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.6, ease: 'easeOut', delay: 0.05 * index }"
            class="tech-badge"
          >
            <div class="tech-icon">{{ getTechIcon(tech) }}</div>
            <p>{{ tech }}</p>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="projects-section-new">
      <div class="container">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="section-header"
        >
          <h2 class="section-title">Featured Projects</h2>
          <RouterLink to="/projects" class="view-all">View All Projects →</RouterLink>
        </Motion>

        <div v-if="loading" class="loading">Loading projects...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="projects-grid-new">
          <Motion
            v-for="(project, index) in featuredProjects"
            :key="project.id"
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, ease: 'easeOut', delay: 0.1 * index }"
          >
            <RouterLink :to="`/projects/${project.id}`" class="project-card-new">
              <div class="project-image-container">
                <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" loading="lazy" />
                <div v-else class="image-placeholder">No Image</div>
              </div>
              <div class="project-info-new">
                <h3>{{ project.title }}</h3>
                <p class="project-category-new">{{ project.category }}</p>
                <p class="project-description">{{ project.summary?.substring(0, 80) }}...</p>
              </div>
            </RouterLink>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Certificates Section -->
    <section class="certificates-section">
      <div class="container">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="section-header"
        >
          <h2 class="section-title">Certificates & Achievements</h2>
          <RouterLink to="/certificates" class="view-all">View All →</RouterLink>
        </Motion>

        <div v-if="certificatesLoading" class="loading">Loading certificates...</div>
        <div v-else class="certificates-grid">
          <Motion
            v-for="(cert, index) in certificates.slice(0, 3)"
            :key="cert.id"
            :initial="{ opacity: 0, scale: 0.9 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.6, ease: 'easeOut', delay: 0.1 * index }"
            class="cert-card-new"
          >
            <div class="cert-icon">🏆</div>
            <h3>{{ cert.title }}</h3>
            <p class="cert-issuer">{{ cert.issuer }}</p>
            <p class="cert-date">{{ formatDate(cert.issueDate) }}</p>
          </Motion>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <Motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="cta-content"
        >
          <h2>Ready to work together?</h2>
          <p>Let's create something amazing. Get in touch and let's discuss your project.</p>
          <button class="btn btn-primary btn-large">Get In Touch</button>
        </Motion>
      </div>
    </section>
  </main>
</template>

<script>
import { Motion } from 'motion-v'
import { usePortfolioData } from '@/composables/usePortfolioData'
import { computed } from 'vue'

export default {
  name: 'HomeViewNew',
  components: {
    Motion,
  },
  setup() {
    const { projects, certificates, loading: portfolioLoading } = usePortfolioData()

    const featuredProjects = computed(() => projects.value?.slice(0, 3) || [])
    const certificatesLoading = computed(() => portfolioLoading.value)
    const latestEducation = {
      degree: 'Bachelor of Computer Science',
      institution: 'University of Technology',
      period: '2021 - 2025',
      focus: 'Web Development, Software Engineering, and Cloud Computing',
    }

    const technologies = [
      'Vue.js', 'React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3',
      'Tailwind CSS', 'Firebase', 'Node.js', 'Git', 'Figma', 'Redux'
    ]

    const getTechIcon = (tech) => {
      const icons = {
        'Vue.js': '🖖',
        'React': '⚛️',
        'JavaScript': '⚡',
        'TypeScript': '📘',
        'HTML5': '🏗️',
        'CSS3': '🎨',
        'Tailwind CSS': '💨',
        'Firebase': '🔥',
        'Node.js': '🟢',
        'Git': '📦',
        'Figma': '✏️',
        'Redux': '🔄',
      }
      return icons[tech] || '✨'
    }

    const formatDate = (date) => {
      if (!date) return ''
      const parsedDate = new Date(date)
      if (Number.isNaN(parsedDate.getTime())) {
        return String(date)
      }
      return parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    }

    return {
      featuredProjects,
      certificates,
      certificatesLoading,
      loading: portfolioLoading,
      latestEducation,
      technologies,
      getTechIcon,
      formatDate,
    }
  },
}
</script>

<style scoped>
/* Root Variables */
:root {
  --primary-blue: #3B82F6;
  --primary-dark: #2563EB;
  --secondary-blue: #1E40AF;
  --dark-bg: #0F172A;
  --card-bg: #1E293B;
  --border-color: rgba(59, 130, 246, 0.2);
  --text-primary: #FFFFFF;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --gradient: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing-new {
  background: var(--dark-bg);
  color: var(--text-primary);
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 0.5) 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  top: -100px;
  left: -100px;
  z-index: 0;
}

.hero-section::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -50px;
  right: -50px;
  z-index: 0;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  animation-duration: 0.8s;
}

.hero-subtitle {
  color: var(--primary-blue);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-circle {
  width: 300px;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-gradient {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--gradient);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-gradient::after {
  content: '';
  position: absolute;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border-radius: 50%;
  background: var(--dark-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid rgba(59, 130, 246, 0.5);
}

.btn-secondary:hover {
  border-color: var(--primary-blue);
  background: rgba(59, 130, 246, 0.1);
}

.btn-large {
  padding: 18px 48px;
  font-size: 1rem;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.view-all {
  display: inline-block;
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 10px 20px;
  border-radius: 50px;
  margin-top: 1rem;
}

.view-all:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--primary-blue);
  transform: translateX(3px);
}

/* About Section */
.about-section-new {
  padding: 6rem 2rem;
  background: var(--dark-bg);
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.about-card {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.about-card:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--primary-blue);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.about-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.about-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Education Section */
.education-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%);
}

.education-card {
  max-width: 760px;
  margin: 0 auto;
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.education-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.education-institution {
  color: var(--primary-blue);
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.education-period {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.education-focus {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Technologies Section */
.technologies-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
}

.tech-badge {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tech-badge:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: var(--primary-blue);
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.tech-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.tech-badge p {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Projects Section */
.projects-section-new {
  padding: 6rem 2rem;
  background: var(--dark-bg);
}

.projects-grid-new {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card-new {
  display: block;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.project-card-new:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--primary-blue);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
}

.project-image-container {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card-new:hover .project-image-container img {
  transform: scale(1.05);
}

.image-placeholder {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.project-info-new {
  padding: 1.5rem;
}

.project-info-new h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.project-category-new {
  display: inline-block;
  background: rgba(59, 130, 246, 0.15);
  color: var(--primary-blue);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.project-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Certificates Section */
.certificates-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.cert-card-new {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.cert-card-new:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--primary-blue);
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.cert-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cert-card-new h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.cert-issuer {
  color: var(--primary-blue);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.cert-date {
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* CTA Section */
.cta-section {
  padding: 6rem 2rem;
  background: var(--gradient);
  text-align: center;
}

.cta-content h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Loading & Error States */
.loading,
.error {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.error {
  color: #EF4444;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-image {
    margin-top: 2rem;
  }

  .profile-circle {
    width: 200px;
    height: 200px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .hero-title {
    font-size: 2rem;
  }

  .about-grid,
  .projects-grid-new,
  .certificates-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .view-all {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-section {
    min-height: auto;
    padding: 3rem 1rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .tech-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .btn {
    padding: 12px 24px;
    font-size: 0.75rem;
  }
}
</style>
