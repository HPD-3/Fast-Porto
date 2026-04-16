import { auth } from '../firebase'
import { db } from '../firebase'
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createProject(payload) {
  const id = slugify(payload.title)
  const data = {
    id,
    title: payload.title,
    summary: payload.summary,
    category: payload.category,
    imageUrl: payload.imageUrl || '',
    projectUrl: payload.projectUrl || '',
    repoUrl: payload.repoUrl || '',
    techStack: payload.techStack || [],
    featured: !!payload.featured,
    status: payload.status || 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await setDoc(doc(db, 'projects', id), data)
  return { success: true, data }
}

export async function updateProject(id, payload) {
  const data = {
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  await updateDoc(doc(db, 'projects', id), data)
  return { success: true, id, data }
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, 'projects', id))
  return { success: true, id }
}

export async function createCertificate(payload) {
  const id = slugify(`${payload.title}-${payload.issuer}-${payload.year}`)
  const data = {
    id,
    title: payload.title,
    issuer: payload.issuer,
    year: Number(payload.year),
    imageUrl: payload.imageUrl || '',
    verifyUrl: payload.verifyUrl || '',
    status: payload.status || 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await setDoc(doc(db, 'certificates', id), data)
  return { success: true, data }
}

export async function updateCertificate(id, payload) {
  const data = {
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  await updateDoc(doc(db, 'certificates', id), data)
  return { success: true, id, data }
}

export async function deleteCertificate(id) {
  await deleteDoc(doc(db, 'certificates', id))
  return { success: true, id }
}
