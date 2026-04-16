<script setup>
import { onBeforeUnmount, ref } from 'vue'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'
import {
  createCertificate,
  createProject,
  deleteCertificate,
  deleteProject,
} from '../api/admin'
import { usePortfolioData } from '../composables/usePortfolioData'

const { projects, certificates } = usePortfolioData()
const currentUser = ref(auth.currentUser)
const allowedAdminEmail = 'hapidh333@gmail.com'

const email = ref('')
const password = ref('')
const authError = ref('')
const actionMessage = ref('')
const provider = new GoogleAuthProvider()

function isAllowedAdminEmail(value) {
  return typeof value === 'string' && value.toLowerCase() === allowedAdminEmail
}

async function enforceAllowedAccount(user) {
  const userEmail = user?.email || ''
  if (!isAllowedAdminEmail(userEmail)) {
    await signOut(auth)
    authError.value = 'Only the authorized Gmail account can access admin.'
    actionMessage.value = ''
    return false
  }
  return true
}

const projectForm = ref({
  title: '',
  summary: '',
  category: 'Web',
  imageUrl: '',
  projectUrl: '',
  repoUrl: '',
  techStack: '',
  status: 'published',
})

const certificateForm = ref({
  title: '',
  issuer: '',
  year: new Date().getFullYear(),
  imageUrl: '',
  verifyUrl: '',
  status: 'published',
})

const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (user && !isAllowedAdminEmail(user.email || '')) {
    enforceAllowedAccount(user)
    currentUser.value = null
    return
  }
  currentUser.value = user
})

onBeforeUnmount(() => {
  unsubscribe()
})

async function loginWithEmail() {
  authError.value = ''
  actionMessage.value = ''
  if (!isAllowedAdminEmail(email.value.trim())) {
    authError.value = 'Only the authorized Gmail account can access admin.'
    return
  }
  try {
    const credential = await signInWithEmailAndPassword(auth, email.value, password.value)
    if (!(await enforceAllowedAccount(credential.user))) return
    actionMessage.value = 'Logged in as admin.'
  } catch (err) {
    authError.value = err.message
  }
}

async function loginWithGoogle() {
  authError.value = ''
  actionMessage.value = ''
  try {
    const credential = await signInWithPopup(auth, provider)
    if (!(await enforceAllowedAccount(credential.user))) return
    actionMessage.value = 'Logged in with Google.'
  } catch (err) {
    const isPopupFlowIssue =
      err?.code === 'auth/popup-blocked' ||
      err?.code === 'auth/cancelled-popup-request' ||
      err?.code === 'auth/popup-closed-by-user' ||
      err?.message?.includes('Cross-Origin-Opener-Policy')
    if (isPopupFlowIssue) {
      await signInWithRedirect(auth, provider)
      return
    }
    authError.value = err.message
  }
}

async function logout() {
  await signOut(auth)
  actionMessage.value = 'Logged out.'
}

async function submitProject() {
  authError.value = ''
  actionMessage.value = ''
  try {
    await createProject({
      ...projectForm.value,
      techStack: projectForm.value.techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    })
    actionMessage.value = 'Project created.'
  } catch (err) {
    authError.value = err.message
  }
}

async function submitCertificate() {
  authError.value = ''
  actionMessage.value = ''
  try {
    await createCertificate(certificateForm.value)
    actionMessage.value = 'Certificate created.'
  } catch (err) {
    authError.value = err.message
  }
}

async function removeProject(id) {
  authError.value = ''
  actionMessage.value = ''
  try {
    await deleteProject(id)
    actionMessage.value = 'Project deleted.'
  } catch (err) {
    authError.value = err.message
  }
}

async function removeCertificate(id) {
  authError.value = ''
  actionMessage.value = ''
  try {
    await deleteCertificate(id)
    actionMessage.value = 'Certificate deleted.'
  } catch (err) {
    authError.value = err.message
  }
}
</script>

<template>
  <main class="admin-page">
    <section class="container">
      <h1>Admin Dashboard</h1>
      <p class="lead">Manage projects and certificates content.</p>

      <p v-if="authError" class="error">{{ authError }}</p>
      <p v-if="actionMessage" class="success">{{ actionMessage }}</p>

      <div v-if="!currentUser" class="panel">
        <h2>Admin Login</h2>
        <div class="fields">
          <input v-model="email" type="email" placeholder="Admin email" />
          <input v-model="password" type="password" placeholder="Password" />
          <button @click="loginWithEmail">Login with Email</button>
          <button class="secondary" @click="loginWithGoogle">Continue with Google</button>
        </div>
      </div>

      <template v-else>
        <div class="toolbar">
          <p>Signed in as {{ currentUser.email || currentUser.displayName }}</p>
          <div class="toolbar-actions">
            <button class="secondary" @click="loginWithGoogle">Login with Google</button>
            <button @click="logout">Logout</button>
          </div>
        </div>

        <div class="grid">
          <section class="panel">
            <h2>Create Project</h2>
            <div class="fields">
              <input v-model="projectForm.title" placeholder="Title" />
              <textarea v-model="projectForm.summary" placeholder="Summary" rows="3" />
              <input v-model="projectForm.category" placeholder="Category (Web, Mobile, etc.)" />
              <input v-model="projectForm.imageUrl" placeholder="Image URL" />
              <input v-model="projectForm.projectUrl" placeholder="Live project URL" />
              <input v-model="projectForm.repoUrl" placeholder="Repository URL" />
              <input v-model="projectForm.techStack" placeholder="Tech stack (comma separated)" />
              <button @click="submitProject">Create Project</button>
            </div>
          </section>

          <section class="panel">
            <h2>Create Certificate</h2>
            <div class="fields">
              <input v-model="certificateForm.title" placeholder="Certificate title" />
              <input v-model="certificateForm.issuer" placeholder="Issuer" />
              <input v-model.number="certificateForm.year" type="number" placeholder="Year" />
              <input v-model="certificateForm.imageUrl" placeholder="Image URL" />
              <input v-model="certificateForm.verifyUrl" placeholder="Verification URL" />
              <button @click="submitCertificate">Create Certificate</button>
            </div>
          </section>
        </div>

        <div class="grid">
          <section class="panel">
            <h2>Projects</h2>
            <ul>
              <li v-for="project in projects" :key="project.id">
                <span>{{ project.title }} ({{ project.category }})</span>
                <button @click="removeProject(project.id)">Delete</button>
              </li>
            </ul>
          </section>
          <section class="panel">
            <h2>Certificates</h2>
            <ul>
              <li v-for="certificate in certificates" :key="certificate.id">
                <span>{{ certificate.title }} ({{ certificate.year }})</span>
                <button @click="removeCertificate(certificate.id)">Delete</button>
              </li>
            </ul>
          </section>
        </div>
      </template>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  padding: 2.5rem 0 4rem;
}

.container {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 0 1.25rem;
}

h1 {
  margin-bottom: 0.4rem;
}

.lead {
  color: #6b7280;
  margin-bottom: 1rem;
}

.error {
  color: #dc2626;
}

.success {
  color: #15803d;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel {
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 0.95rem;
}

.fields {
  display: grid;
  gap: 0.55rem;
}

input,
textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.55rem 0.65rem;
  font: inherit;
}

button {
  border: 0;
  border-radius: 0.5rem;
  background: #111827;
  color: #fff;
  padding: 0.55rem 0.75rem;
  cursor: pointer;
}

button.secondary {
  background: #2563eb;
}

ul {
  list-style: none;
  display: grid;
  gap: 0.4rem;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  border: 1px solid #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.45rem;
}
</style>
