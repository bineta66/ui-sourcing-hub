import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getFormulaireById,
  createFormulaire,
  updateFormulaire,
  publierFormulaire,
  depublierFormulaire,
  createSection,
  updateSection as apiUpdateSection,
  deleteSection as apiDeleteSection,
  createQuestion,
  updateQuestion as apiUpdateQuestion,
  deleteQuestion as apiDeleteQuestion,
  createOption,
  updateOption as apiUpdateOption,
  deleteOption as apiDeleteOption,
} from '@/api/endpoints/formulaires'

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

const mapBackendToLocal = (data) => {
  const sections = (data.sections || []).map(section => ({
    id: String(section.id),
    title: section.titre,
    questions: (section.questions || []).map(q => {
      const typeMap = {TEXT: 'text', TEXTAREA: 'textarea', RADIO: 'radio', CHECKBOX: 'checkbox', SELECT: 'select', NUMBER: 'number', EMAIL: 'email', DATE: 'date', YES_NO: 'yes_no'}
      return {
        id: String(q.id),
        label: q.texte,
        type: typeMap[q.type_question] || 'text',
        required: q.obligatoire,
        options: (q.options || []).map(o => typeof o === 'string' ? o : (o.texte || o.valeur || String(o))),
      }
    }),
  }))
  return {
    formTitle: data.titre || '',
    formDescription: data.description || '',
    campaignId: data.campagne,
    campaignName: data.campagne_title || '',
    sections,
    savedDraft: true,
    isPublished: data.publier,
  }
}

const mapLocalToBackend = (state) => {
  const TYPE_MAP = {text: 'TEXT', textarea: 'TEXTAREA', radio: 'RADIO', checkbox: 'CHECKBOX', select: 'SELECT', number: 'NUMBER', email: 'EMAIL', date: 'DATE', yes_no: 'YES_NO', tel: 'TEXT', time: 'TEXT'}
  const sections = state.sections.map(section => ({
    titre: section.title,
    description: '',
    ordre: state.sections.indexOf(section),
    questions: section.questions.map((q, qIdx) => ({
      texte: q.label,
      type_question: TYPE_MAP[q.type] || 'TEXT',
      obligatoire: q.required,
      ordre: qIdx,
      options: (q.options || []).map((o, oIdx) => ({
        texte: typeof o === 'string' ? o : (o.text || o),
        valeur: typeof o === 'string' ? o : (o.value || o),
        ordre: oIdx,
      })),
    })),
  }))
  return {
    titre: state.formTitle,
    description: state.formDescription,
    campagne: state.campaignId,
    sections,
  }
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
  const loading = ref(false)
  const error = ref(null)
  const currentFormulaireId = ref(null)

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
    currentFormulaireId.value = null
  }

  const loadFromBackend = async (id) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await getFormulaireById(id)
      const mapped = mapBackendToLocal(data)
      formTitle.value = mapped.formTitle
      formDescription.value = mapped.formDescription
      campaignId.value = mapped.campaignId
      campaignName.value = mapped.campaignName
      sections.value = mapped.sections
      savedDraft.value = mapped.savedDraft
      isPublished.value = mapped.isPublished
      currentFormulaireId.value = id
      selectedQuestionId.value = null
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const saveToBackend = async () => {
    loading.value = true
    error.value = null
    try {
      const payload = mapLocalToBackend({
        formTitle: formTitle.value,
        formDescription: formDescription.value,
        campaignId: campaignId.value,
        sections: sections.value,
      })
      if (currentFormulaireId.value) {
        const { data } = await updateFormulaire(currentFormulaireId.value, payload)
        const mapped = mapBackendToLocal(data)
        formTitle.value = mapped.formTitle
        formDescription.value = mapped.formDescription
        sections.value = mapped.sections
        savedDraft.value = true
        return data
      } else {
        const { data } = await createFormulaire(payload)
        const mapped = mapBackendToLocal(data)
        currentFormulaireId.value = mapped.id || data.id
        formTitle.value = mapped.formTitle
        formDescription.value = mapped.formDescription
        sections.value = mapped.sections
        savedDraft.value = true
        return data
      }
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const publishToBackend = async () => {
    if (!currentFormulaireId.value) {
      const saved = await saveToBackend()
      currentFormulaireId.value = saved.id
    }
    loading.value = true
    error.value = null
    try {
      const { data } = await publierFormulaire(currentFormulaireId.value)
      isPublished.value = data.publier
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
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
    currentFormulaireId.value = null
  }

  const saveDraft = () => {
    savedDraft.value = true
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
    loading,
    error,
    currentFormulaireId,
    updateMeta,
    initForCampaign,
    loadFromBackend,
    saveToBackend,
    publishToBackend,
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
  }
})
