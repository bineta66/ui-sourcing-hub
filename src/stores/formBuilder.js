import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

const slugify = (value) => {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const defaultSections = [
  {
    id: generateId(),
    title: 'Informations personnelles',
    questions: [
      { id: generateId(), label: 'Nom', type: 'text', required: true, options: [] },
      { id: generateId(), label: 'Prénom', type: 'text', required: true, options: [] },
      { id: generateId(), label: 'Date de naissance', type: 'date', required: false, options: [] },
      { id: generateId(), label: 'Lieu de naissance', type: 'text', required: false, options: [] },
      { id: generateId(), label: 'Genre', type: 'radio', required: false, options: ['Masculin', 'Féminin', 'Autre'] },
      { id: generateId(), label: 'Numéro de téléphone', type: 'tel', required: true, options: [] },
      { id: generateId(), label: 'Adresse e-mail', type: 'email', required: true, options: [] },
      { id: generateId(), label: 'Adresse / Localité', type: 'text', required: false, options: [] },
      { id: generateId(), label: 'Situation matrimoniale', type: 'radio', required: false, options: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve'] }
    ]
  },
  {
    id: generateId(),
    title: 'Parcours académique',
    questions: [
      { id: generateId(), label: "Niveau d'études", type: 'radio', required: true, options: ['Aucun diplôme', 'BFEM', 'BAC', 'BAC+1', 'BAC+2', 'Licence', 'Master', 'Doctorat', 'Autre'] },
      { id: generateId(), label: 'Dernier diplôme obtenu', type: 'text', required: true, options: [] },
      { id: generateId(), label: 'Domaine de formation', type: 'text', required: false, options: [] },
      { id: generateId(), label: 'Établissement fréquenté', type: 'text', required: false, options: [] },
      { id: generateId(), label: "Année d'obtention du diplôme", type: 'number', required: false, options: [] },
      { id: generateId(), label: "Niveau actuel d'études", type: 'text', required: false, options: [] },
      { id: generateId(), label: 'Autres formations suivies', type: 'textarea', required: false, options: [] }
    ]
  },
  {
    id: generateId(),
    title: 'Compétences basiques en informatique',
    questions: [
      { id: generateId(), label: 'Quel est votre niveau général en informatique ?', type: 'radio', required: true, options: ['Débutant', 'Intermédiaire', 'Avancé'] },
      { id: generateId(), label: 'Utilisez-vous régulièrement un ordinateur ?', type: 'radio', required: true, options: ['Oui', 'Non'] },
      { id: generateId(), label: "Quels systèmes d'exploitation connaissez-vous ?", type: 'checkbox', required: false, options: ['Windows', 'Linux', 'macOS', 'Android'] },
      { id: generateId(), label: 'Quels logiciels bureautiques utilisez-vous ?', type: 'checkbox', required: false, options: ['Microsoft Word', 'Microsoft Excel', 'PowerPoint', 'LibreOffice'] },
      { id: generateId(), label: 'Quel est votre niveau sur Microsoft Word ?', type: 'radio', required: false, options: ['Débutant', 'Intermédiaire', 'Avancé'] },
      { id: generateId(), label: 'Quel est votre niveau sur Microsoft Excel ?', type: 'radio', required: false, options: ['Débutant', 'Intermédiaire', 'Avancé'] },
      { id: generateId(), label: 'Savez-vous créer un tableau sur Excel ?', type: 'radio', required: true, options: ['Oui', 'Non'] },
      { id: generateId(), label: 'Savez-vous utiliser Internet pour effectuer des recherches ?', type: 'radio', required: true, options: ['Oui', 'Non'] },
      { id: generateId(), label: 'Utilisez-vous une adresse e-mail ?', type: 'radio', required: false, options: ['Régulièrement', 'Occasionnellement', 'Jamais'] },
      { id: generateId(), label: 'Savez-vous envoyer une pièce jointe par e-mail ?', type: 'radio', required: true, options: ['Oui', 'Non'] },
      { id: generateId(), label: 'Utilisez-vous des outils collaboratifs ?', type: 'checkbox', required: false, options: ['Google Drive', 'Google Docs', 'Microsoft Teams', 'Zoom', 'Slack'] },
      { id: generateId(), label: 'Avez-vous déjà utilisé un outil de visioconférence ?', type: 'radio', required: false, options: ['Oui', 'Non'] }
    ]
  }
]

export const useFormBuilderStore = defineStore('formBuilder', () => {
  const formTitle = ref('Formulaire sans titre')
  const formDescription = ref('')
  const campaignId = ref(null)
  const campaignName = ref('')
  const sections = ref(JSON.parse(JSON.stringify(defaultSections)))
  const savedDraft = ref(false)
  const isPublished = ref(false)
  const selectedQuestionId = ref(null)

  const totalQuestions = computed(() => sections.value.reduce((sum, section) => sum + section.questions.length, 0))
  const totalSections = computed(() => sections.value.length)

  const selectedQuestion = computed(() => {
    if (!selectedQuestionId.value) return null
    for (const section of sections.value) {
      const q = section.questions.find(q => q.id === selectedQuestionId.value)
      if (q) return { question: q, sectionId: section.id }
    }
    return null
  })

  const updateMeta = ({ title, description, campaignId: cid, campaignName: cname } = {}) => {
    if (title !== undefined) formTitle.value = title
    if (description !== undefined) formDescription.value = description
    if (cid !== undefined) campaignId.value = cid
    if (cname !== undefined) campaignName.value = cname
  }

  const initForCampaign = (campaign) => {
    campaignId.value = campaign.id
    campaignName.value = campaign.title
    sections.value = JSON.parse(JSON.stringify(defaultSections))
    formTitle.value = campaign.title
    formDescription.value = 'Candidature à la campagne'
    savedDraft.value = false
    isPublished.value = false
    selectedQuestionId.value = null
  }

  const addSection = (title = 'Nouvelle section') => {
    sections.value.push({
      id: generateId(),
      title,
      questions: []
    })
  }

  const updateSection = (sectionId, data) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    if (data.title !== undefined) section.title = data.title
  }

  const deleteSection = (sectionId) => {
    const idx = sections.value.findIndex(s => s.id === sectionId)
    if (idx !== -1) sections.value.splice(idx, 1)
  }

  const moveSection = (sectionId, direction) => {
    const idx = sections.value.findIndex(s => s.id === sectionId)
    if (idx === -1) return
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= sections.value.length) return
    const temp = sections.value[idx]
    sections.value[idx] = sections.value[newIdx]
    sections.value[newIdx] = temp
  }

  const duplicateSection = (sectionId) => {
    const idx = sections.value.findIndex(s => s.id === sectionId)
    if (idx === -1) return
    const original = sections.value[idx]
    const clone = JSON.parse(JSON.stringify(original))
    clone.id = generateId()
    clone.title = original.title + ' (copie)'
    clone.questions = clone.questions.map(q => ({ ...q, id: generateId() }))
    sections.value.splice(idx + 1, 0, clone)
  }

  const addQuestion = (sectionId, question = null) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const newQuestion = question || {
      id: generateId(),
      label: 'Question sans titre',
      type: 'text',
      required: false,
      options: []
    }
    section.questions.push(newQuestion)
    selectedQuestionId.value = newQuestion.id
  }

  const updateQuestion = (sectionId, questionId, data) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const question = section.questions.find(q => q.id === questionId)
    if (!question) return
    Object.assign(question, data)
  }

  const deleteQuestion = (sectionId, questionId) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const idx = section.questions.findIndex(q => q.id === questionId)
    if (idx !== -1) {
      section.questions.splice(idx, 1)
      if (selectedQuestionId.value === questionId) {
        selectedQuestionId.value = null
      }
    }
  }

  const moveQuestion = (sectionId, questionId, direction) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const idx = section.questions.findIndex(q => q.id === questionId)
    if (idx === -1) return
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= section.questions.length) return
    const temp = section.questions[idx]
    section.questions[idx] = section.questions[newIdx]
    section.questions[newIdx] = temp
  }

  const duplicateQuestion = (sectionId, questionId) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const idx = section.questions.findIndex(q => q.id === questionId)
    if (idx === -1) return
    const original = section.questions[idx]
    const clone = JSON.parse(JSON.stringify(original))
    clone.id = generateId()
    clone.label = original.label + ' (copie)'
    section.questions.splice(idx + 1, 0, clone)
    selectedQuestionId.value = clone.id
  }

  const addOption = (sectionId, questionId, option) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const question = section.questions.find(q => q.id === questionId)
    if (!question) return
    question.options.push(option)
  }

  const updateOption = (sectionId, questionId, optionIndex, value) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const question = section.questions.find(q => q.id === questionId)
    if (!question || optionIndex >= question.options.length) return
    question.options[optionIndex] = value
  }

  const deleteOption = (sectionId, questionId, optionIndex) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return
    const question = section.questions.find(q => q.id === questionId)
    if (!question || optionIndex >= question.options.length) return
    question.options.splice(optionIndex, 1)
  }

  const resetForm = () => {
    sections.value = JSON.parse(JSON.stringify(defaultSections))
    formTitle.value = 'Formulaire sans titre'
    formDescription.value = ''
    campaignId.value = null
    campaignName.value = ''
    savedDraft.value = false
    isPublished.value = false
    selectedQuestionId.value = null
  }

  const saveDraft = () => {
    savedDraft.value = true
  }

  const publishForm = (slug) => {
    if (!slug || !campaignId.value) return
    isPublished.value = true
    try {
      const questions = []
      sections.value.forEach(section => {
        section.questions.forEach(q => {
          questions.push({
            id: q.id,
            type: q.type,
            label: q.label,
            required: q.required,
            options: q.options || []
          })
        })
      })

      const payload = {
        id: slug,
        title: formTitle.value,
        description: formDescription.value,
        campaignId: campaignId.value,
        campaignName: campaignName.value,
        published: true,
        publishedAt: new Date().toISOString(),
        questions
      }

      localStorage.setItem(`public_form_${slug}`, JSON.stringify(payload))
    } catch (e) {
      console.error('Failed to publish form', e)
    }
  }

  const getPublishedFormBySlug = (slug) => {
    try {
      const raw = localStorage.getItem(`public_form_${slug}`)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (e) {
      console.error('Failed to get published form', e)
      return null
    }
  }

  return {
    formTitle,
    formDescription,
    campaignId,
    campaignName,
    sections,
    savedDraft,
    isPublished,
    selectedQuestionId,
    selectedQuestion,
    totalQuestions,
    totalSections,
    updateMeta,
    initForCampaign,
    addSection,
    updateSection,
    deleteSection,
    moveSection,
    duplicateSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    duplicateQuestion,
    addOption,
    updateOption,
    deleteOption,
    resetForm,
    saveDraft,
    publishForm,
    getPublishedFormBySlug
  }
})
