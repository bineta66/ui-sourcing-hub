import { defineStore } from 'pinia'
import avatarImg from '@/assets/avatar.png'

export const useEntretiensStore = defineStore('entretiens', {
  state: () => ({
    // Stats KPI
    kpis: {
      upcomingWeek: 10,
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

    // Liste des entretiens
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
        notes: 'Évaluer la maîtrise de Vue 3 Composition API, architecture modulaire, Pinia et l’intégration responsive selon maquette.',
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
      },
      {
        id: 2,
        program: 'Assistance digital',
        department: 'MANAGEMENT',
        windowLabel: 'Oct 14 - Oct 14',
        windowSub: 'Single Day',
        day: 'Mardi',
        time: '02:30 PM - 04:00 PM',
        date: 'Oct 14, 2023',
        duration: '45 Minutes',
        type: 'MOTIVATION',
        icon: 'briefcase',
        iconBg: '#F3E8FF',
        iconColor: '#9333EA',
        notes: 'Vérifier la rigueur administrative, la communication professionnelle et l’aisance avec les outils de productivité.',
        candidates: [
          { id: 104, name: 'Awa Diop', role: 'Assistante de gestion', avatar: avatarImg },
          { id: 105, name: 'Mamadou Ba', role: 'Office Manager', avatar: avatarImg }
        ],
        extraCandidatesCount: 1,
        recruiters: [
          { id: 2, name: 'Lisa Cooper', role: 'HR Specialist', avatar: avatarImg }
        ]
      },
      {
        id: 3,
        program: 'Designer UX/UI créatif',
        department: 'DESIGN STUDIO',
        windowLabel: 'Oct 15 - Oct 18',
        windowSub: '4-Day Window',
        day: 'Mercredi',
        time: '09:00 AM - 11:30 AM',
        date: 'Oct 15, 2023',
        duration: '60 Minutes',
        type: 'TECHNIQUE',
        icon: 'palette',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        notes: 'Revue du portfolio, analyse de cas d’usage Figma, design tokens et cohérence de l’expérience utilisateur.',
        candidates: [
          { id: 106, name: 'Elena Rostova', role: 'Product Designer', avatar: avatarImg },
          { id: 107, name: 'Karim Ndiaye', role: 'UI Specialist', avatar: avatarImg },
          { id: 108, name: 'Chloé Dupuis', role: 'UX Researcher', avatar: avatarImg }
        ],
        extraCandidatesCount: 12,
        recruiters: [
          { id: 1, name: 'Marcus Thorne', role: 'Lead Developer', avatar: avatarImg },
          { id: 2, name: 'Lisa Cooper', role: 'HR Specialist', avatar: avatarImg }
        ]
      },
      {
        id: 4,
        program: 'Analyste en stratégie commerciale',
        department: 'GROWTH & OPS',
        windowLabel: 'Oct 16 - Oct 16',
        windowSub: 'Single Day',
        day: 'Jeudi',
        time: '11:00 AM - 12:30 PM',
        date: 'Oct 16, 2023',
        duration: '45 Minutes',
        type: 'MOTIVATION',
        icon: 'graph-up-arrow',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        notes: 'Analyse d’un business case, stratégie go-to-market, KPI d’acquisition et capacité de négociation.',
        candidates: [
          { id: 109, name: 'Thomas Bernard', role: 'Growth Specialist', avatar: avatarImg }
        ],
        extraCandidatesCount: 4,
        recruiters: [
          { id: 2, name: 'Lisa Cooper', role: 'HR Specialist', avatar: avatarImg }
        ]
      }
    ],

    // Pool de recruteurs disponibles
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
      },
      {
        id: 3,
        name: 'Sarah Jenkins',
        role: 'Senior Tech Lead',
        avatar: avatarImg,
        selected: false
      },
      {
        id: 4,
        name: 'Jean-Marc Dupont',
        role: 'Talent Acquisition Manager',
        avatar: avatarImg,
        selected: false
      }
    ],

    // Pool de candidats disponibles
    availableCandidates: [
      {
        id: 101,
        name: 'Marcus Thorne',
        role: 'Lead Developer',
        department: 'Dev Web / IA',
        avatar: avatarImg,
        selected: true
      },
      {
        id: 102,
        name: 'Lisa Cooper',
        role: 'HR Specialist',
        department: 'Management',
        avatar: avatarImg,
        selected: false
      },
      {
        id: 103,
        name: 'Amadou Diallo',
        role: 'Développeur Fullstack Vue/Django',
        department: 'Dev Web / IA',
        avatar: avatarImg,
        selected: false
      },
      {
        id: 104,
        name: 'Sophie Martin',
        role: 'Product & UI Designer',
        department: 'Design Studio',
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
          if (state.filterTimeSlot === 'Matin' && !item.time.includes('AM')) {
            return false
          }
          if (state.filterTimeSlot === 'Apres-midi' && !item.time.includes('PM')) {
            return false
          }
        }
        // Recherche textuelle
        if (state.searchQuery.trim()) {
          const q = state.searchQuery.toLowerCase()
          const matchTitle = item.program.toLowerCase().includes(q)
          const matchDept = item.department.toLowerCase().includes(q)
          const matchType = item.type.toLowerCase().includes(q)
          const matchCandidate = item.candidates.some(c => c.name.toLowerCase().includes(q))
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
      const newId = Date.now()
      this.availableRecruiters.push({
        id: newId,
        name: recruiter.name,
        role: recruiter.role || 'Recruteur',
        avatar: recruiter.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recruiter.name)}&background=00313C&color=fff&size=64`,
        selected: true
      })
    },

    addCandidate(candidate) {
      const newId = Date.now()
      this.availableCandidates.push({
        id: newId,
        name: candidate.name,
        role: candidate.role || 'Candidat',
        department: candidate.department || 'Général',
        avatar: candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=D20C4F&color=fff&size=64`,
        selected: true
      })
    },

    createEntretien(payload) {
      const newId = Date.now()
      const recruiters = this.availableRecruiters.filter(r => r.selected)
      const candidates = this.availableCandidates.filter(c => c.selected)

      let icon = 'code-slash'
      let iconBg = '#E0F2FE'
      let iconColor = '#0284C7'
      let department = 'DÉPARTEMENT TECH & DIGITAL'

      if (payload.program.includes('Design')) {
        icon = 'palette'
        iconBg = '#FEF3C7'
        iconColor = '#D97706'
        department = 'DESIGN STUDIO'
      } else if (payload.program.includes('Assistance') || payload.program.includes('Management')) {
        icon = 'briefcase'
        iconBg = '#F3E8FF'
        iconColor = '#9333EA'
        department = 'MANAGEMENT'
      } else if (payload.program.includes('Stratégie') || payload.program.includes('Analyste')) {
        icon = 'graph-up-arrow'
        iconBg = '#DCFCE7'
        iconColor = '#16A34A'
        department = 'GROWTH & OPS'
      }

      const newEntretien = {
        id: newId,
        program: payload.program || 'Dew Web IA',
        department: department,
        windowLabel: payload.date || 'Oct 26 - Oct 26',
        windowSub: 'Single Day',
        day: 'Jeudi',
        time: payload.time || '10:30 AM',
        date: payload.date || 'Oct 26, 2023',
        duration: payload.duration || '45 Minutes',
        type: payload.type ? payload.type.toUpperCase() : 'TECHNIQUE',
        icon: icon,
        iconBg: iconBg,
        iconColor: iconColor,
        notes: payload.notes || '',
        candidates: candidates.length > 0 ? candidates.slice(0, 3) : [
          { id: 101, name: 'Marcus Thorne', role: 'Lead Developer', avatar: avatarImg }
        ],
        extraCandidatesCount: Math.max(0, candidates.length - 3),
        recruiters: recruiters.length > 0 ? recruiters : [
          { id: 1, name: 'Marcus Thorne', role: 'Lead Developer', avatar: avatarImg }
        ]
      }

      this.entretiens.unshift(newEntretien)
      this.kpis.upcomingWeek += 1
      return newEntretien
    },

    deleteEntretien(id) {
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
