import { defineStore } from 'pinia'
import avatarImg from '@/assets/avatar.png'
import {
  getEntretiens,
  createEntretien as createEntretienApi,
  confirmerEtEnvoyerConvocations,
  deleteEntretien as deleteEntretienApi,
} from '@/api/endpoints/entretiens'
import { getCampagnes } from '@/api/endpoints/campagnes'
import { listUsersApi } from '@/api/endpoints/accounts'
import { getCampagneCandidats } from '@/api/endpoints/reunionInformation'

// Helper pour convertir un objet API Entretien en format UI
const formatEntretienFromApi = (item) => {
  let icon = 'code-slash'
  let iconBg = '#E0F2FE'
  let iconColor = '#0284C7'
  let department = 'DÉPARTEMENT TECH & DIGITAL'
  const prog = item.campagne_titre || item.campagne?.title || item.program || 'Session Entretien'

  if (prog.includes('Design')) {
    icon = 'palette'
    iconBg = '#FEF3C7'
    iconColor = '#D97706'
    department = 'DESIGN STUDIO'
  } else if (prog.includes('Assistance') || prog.includes('Management')) {
    icon = 'briefcase'
    iconBg = '#F3E8FF'
    iconColor = '#9333EA'
    department = 'MANAGEMENT'
  } else if (prog.includes('Stratégie') || prog.includes('Analyste')) {
    icon = 'graph-up-arrow'
    iconBg = '#DCFCE7'
    iconColor = '#16A34A'
    department = 'GROWTH & OPS'
  }

  const candidates = (item.creneaux || [])
    .filter((c) => c.candidature_details || c.candidature)
    .map((c) => {
      const d = c.candidature_details || {}
      return {
        id: d.id || c.candidature,
        name: `${d.prenom || ''} ${d.nom || ''}`.trim() || 'Candidat',
        role: 'Candidat',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.prenom || 'C')}&background=D20C4F&color=fff&size=64`,
      }
    })

  const recruiters = (item.jurys_details || []).map((j) => ({
    id: j.id,
    name: j.full_name || `${j.first_name || ''} ${j.last_name || ''}`.trim() || j.email,
    role: j.role === 'ADMIN' ? 'Administrateur' : 'Membre du Jury',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(j.first_name || 'J')}&background=00313C&color=fff&size=64`,
  }))

  const dateStr = item.date || 'Oct 26, 2023'
  let dayName = 'Lundi'
  try {
    if (item.date) {
      dayName = new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'long' })
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1)
    }
  } catch (e) {
    dayName = 'Jour'
  }

  const hDeb = item.heure_debut ? item.heure_debut.substring(0, 5) : '09:00'
  const hFin = item.heure_fin ? item.heure_fin.substring(0, 5) : '12:00'
  const timeStr = `${hDeb} - ${hFin}`

  return {
    id: item.id,
    campagneId: item.campagne,
    program: prog,
    department: department,
    windowLabel: dateStr,
    windowSub: item.statut || 'CONFIRME',
    day: dayName,
    time: timeStr,
    date: dateStr,
    duration: `${item.duree_minutes || 45} Minutes`,
    type: item.type ? item.type.toUpperCase() : 'TECHNIQUE',
    statut: item.statut,
    lieu: item.lieu || 'Simplon Sénégal',
    lienVisio: item.lien_visio || '',
    icon: icon,
    iconBg: iconBg,
    iconColor: iconColor,
    notes: item.notes || '',
    candidates: candidates.length > 0 ? candidates.slice(0, 3) : [
      { id: 101, name: 'Candidat convoqué', role: 'Candidat', avatar: avatarImg }
    ],
    extraCandidatesCount: Math.max(0, candidates.length - 3),
    recruiters: recruiters.length > 0 ? recruiters : [
      { id: 1, name: 'Jury assigné', role: 'Membre du Jury', avatar: avatarImg }
    ],
  }
}

export const useEntretiensStore = defineStore('entretiens', {
  state: () => ({
    // Stats KPI
    kpis: {
      upcomingWeek: 4,
      upcomingTrend: '+12%',
      totalDevWebIa: 156,
      totalTrend: 'Stable',
      averageAiScore: 84.2,
      aiScoreTrend: '-4%',
      completionRate: 91.5,
      completionTrend: '+8%',
    },

    // Filtres
    filterProgram: '',
    filterDay: '',
    filterTimeSlot: '',
    searchQuery: '',
    viewMode: 'list', // 'list' | 'grid'
    currentPage: 1,
    itemsPerPage: 4,

    loading: false,
    error: null,

    // Campagnes disponibles
    campagnes: [],

    // Liste des entretiens chargés
    entretiens: [
      {
        id: 1,
        program: 'Developpement Web',
        department: 'DÉPARTEMENT DEV WEB/MOBILE',
        windowLabel: 'Oct 12 - Oct 15',
        windowSub: '3-Day Window',
        day: 'Lundi',
        time: '10:00 AM - 12:00 PM',
        date: 'Oct 12, 2023',
        duration: '45 Minutes',
        type: 'TECHNIQUE',
        icon: 'code-slash',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        notes: 'Évaluer la maîtrise de Vue 3 Composition API, architecture modulaire, Pinia et l’intégration responsive.',
        candidates: [
          { id: 101, name: 'Marcus Thorne', role: 'Dev Frontend', avatar: avatarImg },
          { id: 102, name: 'Lisa Cooper', role: 'Dev Fullstack', avatar: avatarImg },
          { id: 103, name: 'David Kim', role: 'Dev Vue.js', avatar: avatarImg }
        ],
        extraCandidatesCount: 6,
        recruiters: [
          { id: 1, name: 'Marcus Thorne', role: 'Lead Developer', avatar: avatarImg },
          { id: 2, name: 'Lisa Cooper', role: 'HR Specialist', avatar: avatarImg }
        ]
      }
    ],

    // Pool de recruteurs / jurys disponibles
    availableRecruiters: [
      {
        id: 1,
        name: 'Marcus Thorne',
        role: 'Lead Developer',
        avatar: avatarImg,
        selected: true
      },
      {
        id: 2,
        name: 'Lisa Cooper',
        role: 'HR Specialist',
        avatar: avatarImg,
        selected: false
      }
    ],

    // Pool de candidats disponibles
    availableCandidates: [
      {
        id: 101,
        name: 'Awa Diop',
        role: 'Assistante de gestion',
        department: 'Management',
        avatar: avatarImg,
        selected: true
      },
      {
        id: 102,
        name: 'Mamadou Ba',
        role: 'Office Manager',
        department: 'Management',
        avatar: avatarImg,
        selected: false
      }
    ],

    // Statut des intégrations visio
    integrations: {
      googleMeet: true,
      zoom: false,
      teams: false
    }
  }),

  getters: {
    // Liste filtrée
    filteredEntretiens: (state) => {
      return state.entretiens.filter((item) => {
        // Filtre Programme
        if (state.filterProgram && state.filterProgram !== 'Tous') {
          if (!item.program.toLowerCase().includes(state.filterProgram.toLowerCase())) {
            return false
          }
        }
        // Filtre Jour
        if (state.filterDay && state.filterDay !== 'Semaine' && state.filterDay !== 'Tous') {
          if (item.day.toLowerCase() !== state.filterDay.toLowerCase()) {
            return false
          }
        }
        // Filtre Créneau
        if (state.filterTimeSlot && state.filterTimeSlot !== 'Heure' && state.filterTimeSlot !== 'Tous') {
          if (state.filterTimeSlot === 'Matin' && !item.time.includes('AM') && !item.time.includes('08:') && !item.time.includes('09:') && !item.time.includes('10:') && !item.time.includes('11:')) {
            return false
          }
          if (state.filterTimeSlot === 'Apres-midi' && !item.time.includes('PM') && !item.time.includes('13:') && !item.time.includes('14:') && !item.time.includes('15:') && !item.time.includes('16:') && !item.time.includes('17:')) {
            return false
          }
        }
        // Recherche textuelle
        if (state.searchQuery.trim()) {
          const q = state.searchQuery.toLowerCase()
          const matchTitle = item.program.toLowerCase().includes(q)
          const matchDept = item.department.toLowerCase().includes(q)
          const matchType = item.type.toLowerCase().includes(q)
          const matchCandidate = (item.candidates || []).some(c => c.name.toLowerCase().includes(q))
          if (!matchTitle && !matchDept && !matchType && !matchCandidate) {
            return false
          }
        }
        return true
      })
    },

    paginatedEntretiens: (state) => {
      const filtered = state.filteredEntretiens
      const start = (state.currentPage - 1) * state.itemsPerPage
      return filtered.slice(start, start + state.itemsPerPage)
    },

    totalPages: (state) => {
      return Math.ceil(state.filteredEntretiens.length / state.itemsPerPage) || 1
    },

    totalCount: (state) => state.entretiens.length,

    selectedRecruiters: (state) => state.availableRecruiters.filter(r => r.selected),
    selectedCandidates: (state) => state.availableCandidates.filter(c => c.selected)
  },

  actions: {
    setFilterProgram(prog) {
      this.filterProgram = prog
      this.currentPage = 1
    },
    setFilterDay(day) {
      this.filterDay = day
      this.currentPage = 1
    },
    setFilterTimeSlot(slot) {
      this.filterTimeSlot = slot
      this.currentPage = 1
    },
    setSearchQuery(q) {
      this.searchQuery = q
      this.currentPage = 1
    },
    setViewMode(mode) {
      this.viewMode = mode
    },
    setPage(page) {
      this.currentPage = page
    },
    resetFilters() {
      this.filterProgram = ''
      this.filterDay = ''
      this.filterTimeSlot = ''
      this.searchQuery = ''
      this.currentPage = 1
    },

    toggleRecruiterSelection(id) {
      const rec = this.availableRecruiters.find(r => r.id === id)
      if (rec) {
        rec.selected = !rec.selected
      }
    },

    toggleCandidateSelection(id) {
      const cand = this.availableCandidates.find(c => c.id === id)
      if (cand) {
        cand.selected = !cand.selected
      }
    },

    addRecruiter(recruiter) {
      const newId = recruiter.id || Date.now()
      this.availableRecruiters.push({
        id: newId,
        name: recruiter.name,
        role: recruiter.role || 'Membre du Jury',
        avatar: recruiter.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recruiter.name)}&background=00313C&color=fff&size=64`,
        selected: true
      })
    },

    addCandidate(candidate) {
      const newId = candidate.id || Date.now()
      this.availableCandidates.push({
        id: newId,
        name: candidate.name,
        role: candidate.role || 'Candidat',
        department: candidate.department || 'Général',
        avatar: candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=D20C4F&color=fff&size=64`,
        selected: true
      })
    },

    // Charger les campagnes réelles depuis l'API
    async fetchCampagnes() {
      try {
        const { data } = await getCampagnes()
        const items = Array.isArray(data) ? data : (data?.results || [])
        if (items.length > 0) {
          this.campagnes = items
        }
      } catch (err) {
        console.error('Erreur lors du chargement des campagnes:', err)
      }
    },

    // Charger les jurys réels depuis l'API
    async fetchRecruiters() {
      try {
        const { data } = await listUsersApi()
        const users = Array.isArray(data) ? data : (data?.results || [])
        const jurys = users.filter(u => u.role === 'JURY' || u.role === 'ADMIN')
        if (jurys.length > 0) {
          this.availableRecruiters = jurys.map((u, idx) => ({
            id: u.id,
            name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
            role: u.role === 'ADMIN' ? 'Administrateur' : 'Membre du Jury',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.first_name || u.email)}&background=00313C&color=fff&size=64`,
            selected: idx === 0 // Premier sélectionné par défaut
          }))
        }
      } catch (err) {
        console.error('Erreur lors du chargement des jurys:', err)
      }
    },

    // Charger les candidats d'une campagne
    async fetchCandidates(campagneId) {
      if (!campagneId) return
      try {
        const { data } = await getCampagneCandidats(campagneId)
        const items = Array.isArray(data) ? data : (data?.results || [])
        if (items.length > 0) {
          this.availableCandidates = items.map((c, idx) => ({
            id: c.id,
            name: `${c.prenom || ''} ${c.nom || ''}`.trim(),
            role: 'Candidat',
            department: c.campagne_titre || 'Candidature',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.prenom || 'C')}&background=D20C4F&color=fff&size=64`,
            selected: idx < 3 // 3 premiers pré-sélectionnés
          }))
        }
      } catch (err) {
        console.error('Erreur lors du chargement des candidats:', err)
      }
    },

    // Charger tous les entretiens depuis le backend
    async fetchEntretiens() {
      this.loading = true
      this.error = null
      try {
        const { data } = await getEntretiens()
        const items = Array.isArray(data) ? data : (data?.results || [])
        if (items.length > 0) {
          this.entretiens = items.map(formatEntretienFromApi)
          this.kpis.upcomingWeek = this.entretiens.length
        }
      } catch (err) {
        console.error('Erreur chargement entretiens:', err)
        this.error = err.message || 'Erreur de chargement'
      } finally {
        this.loading = false
      }
    },

    // Planifier et confirmer une session d'entretiens (Action principale)
    async createAndConfirmEntretien(form) {
      this.loading = true
      this.error = null

      try {
        const selectedRecruiters = this.selectedRecruiters
        const selectedCandidates = this.selectedCandidates

        if (selectedRecruiters.length === 0) {
          throw new Error('Veuillez sélectionner au moins un membre du jury.')
        }
        if (selectedCandidates.length === 0) {
          throw new Error('Veuillez sélectionner au moins un candidat.')
        }

        // Trouver la campagne
        let campagneId = form.campagneId
        if (!campagneId && this.campagnes.length > 0) {
          campagneId = this.campagnes[0].id
        }

        // Calculer les horaires découpés par créneau
        const startMinutes = 9 * 60 // 09:00
        const durationMin = parseInt(form.duration) || 45

        const creneauxInput = selectedCandidates.map((cand, idx) => {
          const debTotal = startMinutes + (idx * durationMin)
          const finTotal = debTotal + durationMin
          const hDeb = `${String(Math.floor(debTotal / 60)).padStart(2, '0')}:${String(debTotal % 60).padStart(2, '0')}:00`
          const hFin = `${String(Math.floor(finTotal / 60)).padStart(2, '0')}:${String(finTotal % 60).padStart(2, '0')}:00`
          return {
            candidature_id: cand.id,
            heure_debut: hDeb,
            heure_fin: hFin,
            jury_ids: selectedRecruiters.map(r => r.id)
          }
        })

        // Normaliser la date au format YYYY-MM-DD
        let formattedDate = form.date
        if (!formattedDate || !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          formattedDate = new Date().toISOString().split('T')[0]
        }

        const payload = {
          campagne: campagneId,
          type: (form.type || 'TECHNIQUE').toUpperCase(),
          date: formattedDate,
          heure_debut: creneauxInput[0]?.heure_debut || '09:00:00',
          heure_fin: creneauxInput[creneauxInput.length - 1]?.heure_fin || '12:00:00',
          duree_minutes: durationMin,
          lieu: form.lieu || 'Simplon Sénégal',
          lien_visio: form.lien_visio || 'https://meet.google.com/session-entretiens',
          notes: form.notes || '',
          jury_ids: selectedRecruiters.map(r => r.id),
          creneaux_input: creneauxInput
        }

        // 1. Création de l'entretien avec ses créneaux
        const createRes = await createEntretienApi(payload)
        const newEntretienId = createRes.data?.id

        if (newEntretienId) {
          // 2. Déclenchement de la confirmation et envoi des convocations
          await confirmerEtEnvoyerConvocations(newEntretienId, { envoyer_emails: true })
        }

        // 3. Rechargement de la liste
        await this.fetchEntretiens()
        return createRes.data
      } catch (err) {
        console.error('Erreur lors de la planification/confirmation:', err)
        const errMsg = err.response?.data?.details?.[0] || err.response?.data?.error || err.message || 'Une erreur est survenue'
        this.error = errMsg
        throw new Error(errMsg)
      } finally {
        this.loading = false
      }
    },

    async deleteEntretien(id) {
      try {
        await deleteEntretienApi(id)
      } catch (err) {
        console.warn('API delete error (possible fallback local):', err)
      }
      const idx = this.entretiens.findIndex(e => e.id === id)
      if (idx !== -1) {
        this.entretiens.splice(idx, 1)
        if (this.currentPage > this.totalPages) {
          this.currentPage = Math.max(1, this.totalPages)
        }
      }
    },

    toggleIntegration(key) {
      if (this.integrations[key] !== undefined) {
        this.integrations[key] = !this.integrations[key]
      }
    }
  }
})
