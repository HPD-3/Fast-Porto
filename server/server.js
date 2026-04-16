import express from 'express'
import cors from 'cors'
import { db, auth } from './firebaseAdmin.js'

const app = express()

const allowedOrigins = [
    'https://hafidhportofolio-0.web.app',
    'https://hafidhportofolio-0.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:3000',
]

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
                return
            }
            callback(new Error('CORS blocked for this origin'))
        },
        credentials: true,
    }),
)

app.use(express.json())

function sanitizeProject(input) {
    if (!input?.id || !input?.title || !input?.summary || !input?.category) {
        return { error: 'Project requires id, title, summary, and category.' }
    }
    return {
        data: {
            id: String(input.id),
            title: String(input.title),
            summary: String(input.summary),
            category: String(input.category),
            imageUrl: String(input.imageUrl || ''),
            projectUrl: String(input.projectUrl || ''),
            repoUrl: String(input.repoUrl || ''),
            techStack: Array.isArray(input.techStack) ? input.techStack.map(String) : [],
            featured: Boolean(input.featured),
            status: input.status === 'draft' ? 'draft' : 'published',
            updatedAt: new Date().toISOString(),
        },
    }
}

function sanitizeCertificate(input) {
    if (!input?.id || !input?.title || !input?.issuer || !input?.year) {
        return { error: 'Certificate requires id, title, issuer, and year.' }
    }
    return {
        data: {
            id: String(input.id),
            title: String(input.title),
            issuer: String(input.issuer),
            year: Number(input.year),
            imageUrl: String(input.imageUrl || ''),
            verifyUrl: String(input.verifyUrl || ''),
            status: input.status === 'draft' ? 'draft' : 'published',
            updatedAt: new Date().toISOString(),
        },
    }
}

async function verifyAdmin(req, res, next) {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) {
        res.status(401).json({ error: 'Missing bearer token.' })
        return
    }

    try {
        const decoded = await auth.verifyIdToken(token)
        if (!decoded.admin) {
            res.status(403).json({ error: 'Admin role required.' })
            return
        }
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ error: `Invalid token: ${err.message}` })
    }
}

app.get('/api/health', async (req, res) => {
    try {
        await db.collection('meta').doc('health').set(
            {
                checkedAt: new Date().toISOString(),
            },
            { merge: true },
        )
        res.json({ status: 'ok', message: 'Server and Firestore are reachable.' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get('/api/public/projects', async (req, res) => {
    try {
        const snapshot = await db
            .collection('projects')
            .where('status', '==', 'published')
            .orderBy('category')
            .orderBy('title')
            .get()
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        res.json({ success: true, data })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get('/api/public/certificates', async (req, res) => {
    try {
        const snapshot = await db
            .collection('certificates')
            .where('status', '==', 'published')
            .orderBy('year', 'desc')
            .orderBy('title')
            .get()
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        res.json({ success: true, data })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/admin/projects', verifyAdmin, async (req, res) => {
    const parsed = sanitizeProject(req.body)
    if (parsed.error) {
        res.status(400).json({ error: parsed.error })
        return
    }
    const payload = {
        ...parsed.data,
        createdAt: new Date().toISOString(),
    }
    try {
        await db.collection('projects').doc(payload.id).set(payload)
        res.status(201).json({ success: true, data: payload })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/admin/projects/:id', verifyAdmin, async (req, res) => {
    const parsed = sanitizeProject({ ...req.body, id: req.params.id })
    if (parsed.error) {
        res.status(400).json({ error: parsed.error })
        return
    }
    try {
        await db.collection('projects').doc(req.params.id).set(parsed.data, { merge: true })
        res.json({ success: true, data: parsed.data })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/admin/projects/:id', verifyAdmin, async (req, res) => {
    try {
        await db.collection('projects').doc(req.params.id).delete()
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/admin/certificates', verifyAdmin, async (req, res) => {
    const parsed = sanitizeCertificate(req.body)
    if (parsed.error) {
        res.status(400).json({ error: parsed.error })
        return
    }
    const payload = {
        ...parsed.data,
        createdAt: new Date().toISOString(),
    }
    try {
        await db.collection('certificates').doc(payload.id).set(payload)
        res.status(201).json({ success: true, data: payload })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/admin/certificates/:id', verifyAdmin, async (req, res) => {
    const parsed = sanitizeCertificate({ ...req.body, id: req.params.id })
    if (parsed.error) {
        res.status(400).json({ error: parsed.error })
        return
    }
    try {
        await db.collection('certificates').doc(req.params.id).set(parsed.data, { merge: true })
        res.json({ success: true, data: parsed.data })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/admin/certificates/:id', verifyAdmin, async (req, res) => {
    try {
        await db.collection('certificates').doc(req.params.id).delete()
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app
