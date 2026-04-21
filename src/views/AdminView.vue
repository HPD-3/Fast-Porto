<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'
import { supabase, supabaseStorageBucket } from '@/supabase'
import {
  createCertificate,
  createProject,
  deleteCertificate,
  deleteProject,
  updateCertificate,
  updateProject,
} from '../api/admin'
import { usePortfolioData } from '../composables/usePortfolioData'

const { projects, certificates } = usePortfolioData()
const currentUser = ref(auth.currentUser)
const allowedAdminEmail = 'hapidh333@gmail.com'
const activeTab = ref('projects')

const email = ref('')
const password = ref('')
const authError = ref('')
const actionMessage = ref('')
const provider = new GoogleAuthProvider()

function getDefaultProjectForm() {
  return {
    title: '',
    summary: '',
    category: 'Web',
    imageUrl: '',
    projectUrl: '',
    repoUrl: '',
    techStack: '',
    status: 'published',
  }
}

function getDefaultCertificateForm() {
  return {
    title: '',
    issuer: '',
    year: new Date().getFullYear(),
    imageUrl: '',
    verifyUrl: '',
    status: 'published',
  }
}

const projectForm = ref(getDefaultProjectForm())
const certificateForm = ref(getDefaultCertificateForm())
const projectImageFile = ref(null)
const certificateImageFile = ref(null)

const editingProjectId = ref('')
const editingProjectForm = ref(getDefaultProjectForm())
const editingProjectImageFile = ref(null)

const editingCertificateId = ref('')
const editingCertificateForm = ref(getDefaultCertificateForm())
const editingCertificateImageFile = ref(null)

const publishedProjectCount = computed(
  () => projects.value.filter((item) => item.status === 'published').length,
)
const publishedCertificateCount = computed(
  () => certificates.value.filter((item) => item.status === 'published').length,
)

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

function normalizeImageUrl(url) {
  const value = String(url || '').trim().replace(/i\.ibb\.co\.com/gi, 'i.ibb.co')
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) {
    return value.replace(/^http:\/\//i, 'https://')
  }
  return `https://${value}`
}

function sanitizeFileName(value) {
  return String(value || 'image')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parseTechStack(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatTechStack(value) {
  return Array.isArray(value) ? value.join(', ') : String(value || '')
}

async function uploadImageToSupabase(file) {
  if (!file) {
    throw new Error('Please choose an image file before uploading.')
  }

  const uploadedFileName = `${Date.now()}-${sanitizeFileName(file.name || 'image')}`
  const uploadPath = `portfolio-images/${uploadedFileName}`

  const { error: uploadError } = await supabase.storage.from(supabaseStorageBucket).upload(uploadPath, file, {
    upsert: false,
    contentType: file.type || 'application/octet-stream',
  })

  if (uploadError) {
    throw new Error(uploadError.message || 'Supabase upload failed.')
  }

  const { data } = supabase.storage.from(supabaseStorageBucket).getPublicUrl(uploadPath)
  const publicUrl = data?.publicUrl || ''
  if (!publicUrl) {
    throw new Error('Supabase did not return a public image URL.')
  }

  return normalizeImageUrl(publicUrl)
}

function onProjectImageChange(event) {
  const [file] = event.target.files || []
  projectImageFile.value = file || null
}

function onCertificateImageChange(event) {
  const [file] = event.target.files || []
  certificateImageFile.value = file || null
}

function onEditProjectImageChange(event) {
  const [file] = event.target.files || []
  editingProjectImageFile.value = file || null
}

function onEditCertificateImageChange(event) {
  const [file] = event.target.files || []
  editingCertificateImageFile.value = file || null
}

function resetProjectCreateForm() {
  projectForm.value = getDefaultProjectForm()
  projectImageFile.value = null
}

function resetCertificateCreateForm() {
  certificateForm.value = getDefaultCertificateForm()
  certificateImageFile.value = null
}

function cancelProjectEdit() {
  editingProjectId.value = ''
  editingProjectForm.value = getDefaultProjectForm()
  editingProjectImageFile.value = null
}

function cancelCertificateEdit() {
  editingCertificateId.value = ''
  editingCertificateForm.value = getDefaultCertificateForm()
  editingCertificateImageFile.value = null
}

function startEditProject(project) {
  authError.value = ''
  actionMessage.value = ''
  editingProjectId.value = project.id
  editingProjectForm.value = {
    title: project.title || '',
    summary: project.summary || '',
    category: project.category || 'Web',
    imageUrl: project.imageUrl || '',
    projectUrl: project.projectUrl || '',
    repoUrl: project.repoUrl || '',
    techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : String(project.techStack || ''),
    status: project.status || 'published',
  }
  editingProjectImageFile.value = null
}

function startEditCertificate(certificate) {
  authError.value = ''
  actionMessage.value = ''
  editingCertificateId.value = certificate.id
  editingCertificateForm.value = {
    title: certificate.title || '',
    issuer: certificate.issuer || '',
    year: Number(certificate.year || new Date().getFullYear()),
    imageUrl: certificate.imageUrl || '',
    verifyUrl: certificate.verifyUrl || '',
    status: certificate.status || 'published',
  }
  editingCertificateImageFile.value = null
}

async function submitProject() {
  authError.value = ''
  actionMessage.value = ''
  try {
    let imageUrl = normalizeImageUrl(projectForm.value.imageUrl)
    if (projectImageFile.value) {
      imageUrl = await uploadImageToSupabase(projectImageFile.value)
    }
    await createProject({
      ...projectForm.value,
      imageUrl,
      techStack: parseTechStack(projectForm.value.techStack),
    })
    resetProjectCreateForm()
    actionMessage.value = 'Project created.'
  } catch (err) {
    authError.value = err.message
  }
}

async function submitCertificate() {
  authError.value = ''
  actionMessage.value = ''
  try {
    let imageUrl = normalizeImageUrl(certificateForm.value.imageUrl)
    if (certificateImageFile.value) {
      imageUrl = await uploadImageToSupabase(certificateImageFile.value)
    }
    await createCertificate({
      ...certificateForm.value,
      imageUrl,
      year: Number(certificateForm.value.year),
    })
    resetCertificateCreateForm()
    actionMessage.value = 'Certificate created.'
  } catch (err) {
    authError.value = err.message
  }
}

async function saveProjectEdit(id) {
  authError.value = ''
  actionMessage.value = ''
  try {
    let imageUrl = normalizeImageUrl(editingProjectForm.value.imageUrl)
    if (editingProjectImageFile.value) {
      imageUrl = await uploadImageToSupabase(editingProjectImageFile.value)
    }
    await updateProject(id, {
      ...editingProjectForm.value,
      imageUrl,
      techStack: parseTechStack(editingProjectForm.value.techStack),
    })
    cancelProjectEdit()
    actionMessage.value = 'Project updated.'
  } catch (err) {
    authError.value = err.message
  }
}

async function saveCertificateEdit(id) {
  authError.value = ''
  actionMessage.value = ''
  try {
    let imageUrl = normalizeImageUrl(editingCertificateForm.value.imageUrl)
    if (editingCertificateImageFile.value) {
      imageUrl = await uploadImageToSupabase(editingCertificateImageFile.value)
    }
    await updateCertificate(id, {
      ...editingCertificateForm.value,
      imageUrl,
      year: Number(editingCertificateForm.value.year),
    })
    cancelCertificateEdit()
    actionMessage.value = 'Certificate updated.'
  } catch (err) {
    authError.value = err.message
  }
}

async function removeProject(id) {
  authError.value = ''
  actionMessage.value = ''
  try {
    await deleteProject(id)
    if (editingProjectId.value === id) cancelProjectEdit()
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
    if (editingCertificateId.value === id) cancelCertificateEdit()
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
      <p class="lead">Full CRUD for projects and certificates with Supabase image upload.</p>

      <p v-if="authError" class="error">{{ authError }}</p>
      <p v-if="actionMessage" class="success">{{ actionMessage }}</p>

      <div v-if="!currentUser" class="panel auth-panel">
        <h2>Admin Login</h2>
        <div class="fields">
          <input v-model="email" type="email" placeholder="Admin email" />
          <input v-model="password" type="password" placeholder="Password" />
          <button @click="loginWithEmail">Login with Email</button>
          <button class="secondary" @click="loginWithGoogle">Continue with Google</button>
        </div>
      </div>

      <template v-else>
        <div class="toolbar panel">
          <div>
            <p class="toolbar-title">Signed in as {{ currentUser.email || currentUser.displayName }}</p>
            <small class="lead">Projects: {{ projects.length }} ({{ publishedProjectCount }} published) • Certificates: {{ certificates.length }} ({{ publishedCertificateCount }} published)</small>
          </div>
          <div class="toolbar-actions">
            <button class="secondary" @click="loginWithGoogle">Switch Google</button>
            <button @click="logout">Logout</button>
          </div>
        </div>

        <div class="tabs">
          <button :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">Projects</button>
          <button :class="{ active: activeTab === 'certificates' }" @click="activeTab = 'certificates'">Certificates</button>
        </div>

        <section v-if="activeTab === 'projects'" class="panel">
          <h2>Create Project</h2>
          <div class="fields">
            <input v-model="projectForm.title" placeholder="Title" />
            <textarea v-model="projectForm.summary" placeholder="Summary" rows="3" />
            <input v-model="projectForm.category" placeholder="Category (Web, Mobile, etc.)" />
            <input v-model="projectForm.projectUrl" placeholder="Live project URL" />
            <input v-model="projectForm.repoUrl" placeholder="Repository URL" />
            <input v-model="projectForm.techStack" placeholder="Tech stack (comma separated)" />
            <select v-model="projectForm.status">
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
            <input type="file" accept="image/*" @change="onProjectImageChange" />
            <input v-model="projectForm.imageUrl" placeholder="Image URL fallback (optional)" />
            <div class="row-actions">
              <button @click="submitProject">Create Project</button>
              <button class="ghost" @click="resetProjectCreateForm">Reset</button>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'certificates'" class="panel">
          <h2>Create Certificate</h2>
          <div class="fields">
            <input v-model="certificateForm.title" placeholder="Certificate title" />
            <input v-model="certificateForm.issuer" placeholder="Issuer" />
            <input v-model.number="certificateForm.year" type="number" placeholder="Year" />
            <input v-model="certificateForm.verifyUrl" placeholder="Verification URL" />
            <select v-model="certificateForm.status">
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
            <input type="file" accept="image/*" @change="onCertificateImageChange" />
            <input v-model="certificateForm.imageUrl" placeholder="Image URL fallback (optional)" />
            <div class="row-actions">
              <button @click="submitCertificate">Create Certificate</button>
              <button class="ghost" @click="resetCertificateCreateForm">Reset</button>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'projects'" class="panel">
          <h2>Projects (Read / Update / Delete)</h2>
          <ul class="records">
            <li v-for="project in projects" :key="project.id" class="record">
              <template v-if="editingProjectId === project.id">
                <div class="fields">
                  <input v-model="editingProjectForm.title" placeholder="Title" />
                  <textarea v-model="editingProjectForm.summary" placeholder="Summary" rows="3" />
                  <input v-model="editingProjectForm.category" placeholder="Category" />
                  <input v-model="editingProjectForm.projectUrl" placeholder="Live project URL" />
                  <input v-model="editingProjectForm.repoUrl" placeholder="Repository URL" />
                  <input v-model="editingProjectForm.techStack" placeholder="Tech stack (comma separated)" />
                  <select v-model="editingProjectForm.status">
                    <option value="published">published</option>
                    <option value="draft">draft</option>
                  </select>
                  <input type="file" accept="image/*" @change="onEditProjectImageChange" />
                  <input v-model="editingProjectForm.imageUrl" placeholder="Image URL" />
                </div>
                <div class="record-actions">
                  <button @click="saveProjectEdit(project.id)">Save</button>
                  <button class="ghost" @click="cancelProjectEdit">Cancel</button>
                </div>
              </template>
              <template v-else>
                <div class="record-main">
                  <strong>{{ project.title }}</strong>
                  <small class="muted">{{ project.category }} • {{ project.status || 'published' }}</small>
                  <small class="muted" v-if="formatTechStack(project.techStack)">Stack: {{ formatTechStack(project.techStack) }}</small>
                  <small class="muted url" v-if="project.imageUrl">Image: {{ project.imageUrl }}</small>
                </div>
                <div class="record-actions">
                  <button @click="startEditProject(project)">Edit</button>
                  <button class="danger" @click="removeProject(project.id)">Delete</button>
                </div>
              </template>
            </li>
          </ul>
        </section>

        <section v-if="activeTab === 'certificates'" class="panel">
          <h2>Certificates (Read / Update / Delete)</h2>
          <ul class="records">
            <li v-for="certificate in certificates" :key="certificate.id" class="record">
              <template v-if="editingCertificateId === certificate.id">
                <div class="fields">
                  <input v-model="editingCertificateForm.title" placeholder="Certificate title" />
                  <input v-model="editingCertificateForm.issuer" placeholder="Issuer" />
                  <input v-model.number="editingCertificateForm.year" type="number" placeholder="Year" />
                  <input v-model="editingCertificateForm.verifyUrl" placeholder="Verification URL" />
                  <select v-model="editingCertificateForm.status">
                    <option value="published">published</option>
                    <option value="draft">draft</option>
                  </select>
                  <input type="file" accept="image/*" @change="onEditCertificateImageChange" />
                  <input v-model="editingCertificateForm.imageUrl" placeholder="Image URL" />
                </div>
                <div class="record-actions">
                  <button @click="saveCertificateEdit(certificate.id)">Save</button>
                  <button class="ghost" @click="cancelCertificateEdit">Cancel</button>
                </div>
              </template>
              <template v-else>
                <div class="record-main">
                  <strong>{{ certificate.title }}</strong>
                  <small class="muted">{{ certificate.issuer }} • {{ certificate.year }}</small>
                  <small class="muted">{{ certificate.status || 'published' }}</small>
                  <small class="muted url" v-if="certificate.imageUrl">Image: {{ certificate.imageUrl }}</small>
                </div>
                <div class="record-actions">
                  <button @click="startEditCertificate(certificate)">Edit</button>
                  <button class="danger" @click="removeCertificate(certificate.id)">Delete</button>
                </div>
              </template>
            </li>
          </ul>
        </section>
      </template>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  padding: 2rem 0 4rem;
  background: #f5f7fb;
  min-height: 100vh;
  color: #0f172a;
}

.container {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 0 1.25rem;
}

h1 {
  margin-bottom: 0.4rem;
  color: #0f172a;
}

h2 {
  margin-top: 0;
  color: #0f172a;
}

.lead {
  color: #334155;
  margin-bottom: 1rem;
}

.error,
.success {
  padding: 0.55rem 0.7rem;
  border-radius: 0.5rem;
}

.error {
  color: #991b1b;
  background: #fee2e2;
  border: 1px solid #fecaca;
}

.success {
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.panel {
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 1rem;
  background: #fff;
  color: #0f172a;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  margin-bottom: 1rem;
}

.auth-panel {
  max-width: 560px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.toolbar-title {
  margin: 0 0 0.2rem;
  font-weight: 700;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

.tabs {
  display: flex;
  gap: 0.55rem;
  margin-bottom: 1rem;
}

.tabs button {
  background: #e5e7eb;
  color: #111827;
}

.tabs button.active {
  background: #111827;
  color: #fff;
}

.fields {
  display: grid;
  gap: 0.55rem;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #94a3b8;
  border-radius: 0.5rem;
  padding: 0.55rem 0.65rem;
  font: inherit;
  background: #fff;
  color: #0f172a;
}

input::placeholder,
textarea::placeholder {
  color: #475569;
  opacity: 1;
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

button.ghost {
  background: #e5e7eb;
  color: #111827;
}

button.danger {
  background: #b91c1c;
}

.row-actions {
  display: flex;
  gap: 0.55rem;
}

.records {
  list-style: none;
  display: grid;
  gap: 0.7rem;
  padding: 0;
  margin: 0;
}

.record {
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  padding: 0.75rem;
  display: grid;
  gap: 0.7rem;
}

.record-main {
  display: grid;
  gap: 0.2rem;
}

.record-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.muted {
  color: #475569;
}

.url {
  word-break: break-all;
}

@media (max-width: 860px) {
  .toolbar {
    flex-direction: column;
  }
}
</style>
