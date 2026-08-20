<template>
  <div class="form-builder-view">
    <FormHeader @preview="showPreview = true" @publish="handlePublish" />

    <div class="form-builder-main">
      <div class="form-builder-center">
        <div class="questions-indicator">
          <span class="questions-label">Questions</span>
          <span class="questions-count">{{ totalQuestions }} question{{ totalQuestions !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Sélection de la Campagne liée -->
        <div class="card p-3 mb-3 border-0 shadow-sm rounded-4">
          <label class="form-label fw-bold text-dark-blue mb-1">
            <i class="bi bi-bullseye me-1 text-primary"></i> Campagne associée <span class="text-danger">*</span>
          </label>
          <select
            v-model="selectedCampaignId"
            class="form-select"
            @change="onCampaignChange"
          >
            <option :value="null" disabled>Sélectionner la campagne concernée par ce formulaire</option>
            <option
              v-for="camp in campagnesList"
              :key="camp.id"
              :value="camp.id"
            >
              {{ camp.title }} ({{ camp.status }})
            </option>
          </select>
          <div v-if="!selectedCampaignId" class="form-text text-danger">
            Veuillez associer ce formulaire à une campagne avant de le sauvegarder ou de le publier.
          </div>
        </div>

        <FormTitleCard
          :title="formTitle"
          :description="formDescription"
          @click="editingMeta = true"
        />

        <div v-if="editingMeta" class="meta-editor card p-3 mb-4">
          <input
            v-model="localTitle"
            class="form-control mb-2"
            placeholder="Titre du formulaire"
            @blur="editingMeta = false"
          />
          <textarea
            v-model="localDescription"
            class="form-control"
            rows="2"
            placeholder="Description du formulaire"
            @blur="editingMeta = false"
          ></textarea>
        </div>

        <FormSection
          v-for="(section, sectionIndex) in sections"
          :key="section.id"
          :section="section"
          :section-index="sectionIndex"
          :total-sections="sections.length"
          :selected-question-id="selectedQuestionId"
          @update-section="handleUpdateSection"
          @delete-section="handleDeleteSection"
          @move-section="handleMoveSection"
          @duplicate-section="handleDuplicateSection"
          @add-question="handleAddQuestion"
          @update-question="handleUpdateQuestion"
          @delete-question="handleDeleteQuestion"
          @move-question="handleMoveQuestion"
          @duplicate-question="handleDuplicateQuestion"
          @add-option="handleAddOption"
          @update-option="handleUpdateOption"
          @delete-option="handleDeleteOption"
          @select-question="handleSelectQuestion"
        />

        <div v-if="sections.length === 0" class="empty-state text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
          <p class="text-muted">Aucune section. Ajoutez une section pour commencer.</p>
        </div>
      </div>

      <FormToolbar
        @add-question="handleAddQuestionToSelected"
        @add-title="editingMeta = true"
        @add-section="handleAddSection"
      />
    </div>

    <FormPreview v-model="showPreview" />
    <PublishModal v-model="showPublishModal" :slug="formulaireIdForPublish" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormBuilderStore } from '@/stores/formBuilder'
import { getCampagnes } from '@/api/endpoints/campagnes'
import FormHeader from '@/components/form-builder/FormHeader.vue'
import FormTitleCard from '@/components/form-builder/FormTitleCard.vue'
import FormSection from '@/components/form-builder/FormSection.vue'
import FormToolbar from '@/components/form-builder/FormToolbar.vue'
import FormPreview from '@/components/form-builder/FormPreview.vue'
import PublishModal from '@/components/PublishModal.vue'

const route = useRoute()
const router = useRouter()
const store = useFormBuilderStore()

const showPreview = ref(false)
const showPublishModal = ref(false)
const editingMeta = ref(false)
const localTitle = ref(store.formTitle)
const localDescription = ref(store.formDescription)
const campagnesList = ref([])

const { formTitle, formDescription, sections, totalQuestions, totalSections, selectedQuestionId, initForCampaign, loadFromBackend, publishToBackend } = store

watch(() => localTitle.value, (val) => {
  store.updateMeta({ title: val })
})

watch(() => localDescription.value, (val) => {
  store.updateMeta({ description: val })
})

const selectedCampaignId = computed({
  get: () => store.campaignId,
  set: (val) => {
    store.campaignId = val
    const found = campagnesList.value.find(c => c.id === val)
    if (found) {
      store.campaignName = found.title
      if (!store.formTitle || store.formTitle === 'Formulaire sans titre') {
        store.formTitle = `Formulaire de candidature - ${found.title}`
        localTitle.value = store.formTitle
      }
    }
  }
})

const onCampaignChange = () => {
  const found = campagnesList.value.find(c => c.id === store.campaignId)
  if (found) {
    store.campaignName = found.title
  }
}

const formulaireIdForPublish = computed(() => {
  if (store.currentFormulaireId) {
    return String(store.currentFormulaireId)
  }
  return route.params.formulaireId || route.params.campaignId || '1'
})

onMounted(async () => {
  try {
    const { data } = await getCampagnes()
    campagnesList.value = data
  } catch (err) {
    console.error('Erreur lors du chargement des campagnes :', err)
  }

  const formulaireId = route.params.formulaireId
  if (formulaireId) {
    try {
      await loadFromBackend(formulaireId)
      localTitle.value = store.formTitle
      localDescription.value = store.formDescription
    } catch (err) {
      console.error('Erreur lors du chargement du formulaire :', err)
    }
  } else {
    const campaignParam = route.params.campaignId || route.query.campaignId
    if (campaignParam) {
      const numId = Number(campaignParam)
      const found = campagnesList.value.find(c => c.id === numId)
      if (found) {
        initForCampaign(found)
        localTitle.value = store.formTitle
        localDescription.value = store.formDescription
      } else {
        selectedCampaignId.value = numId
      }
    }
  }
})

const handleUpdateSection = ({ id, title }) => {
  store.updateSection(id, { title })
}
const handleDeleteSection = (id) => {
  if (confirm('Supprimer cette section et toutes ses questions ?')) {
    store.deleteSection(id)
  }
}
const handleMoveSection = ({ id, direction }) => {
  store.moveSection(id, direction)
}
const handleDuplicateSection = (id) => {
  store.duplicateSection(id)
}
const handleAddSection = (title) => {
  store.addSection(title)
}
const handleAddQuestion = (sectionId) => {
  store.addQuestion(sectionId)
}
const handleAddQuestionToSelected = () => {
  if (sections.length === 0) {
    store.addSection()
  }
  const targetSection = sections[0]
  store.addQuestion(targetSection.id)
}
const handleUpdateQuestion = ({ sectionId, questionId, ...data }) => {
  store.updateQuestion(sectionId, questionId, data)
}
const handleDeleteQuestion = ({ sectionId, questionId }) => {
  store.deleteQuestion(sectionId, questionId)
}
const handleMoveQuestion = ({ sectionId, questionId, direction }) => {
  store.moveQuestion(sectionId, questionId, direction)
}
const handleDuplicateQuestion = ({ sectionId, questionId }) => {
  store.duplicateQuestion(sectionId, questionId)
}
const handleAddOption = ({ sectionId, questionId, option }) => {
  store.addOption(sectionId, questionId, option)
}
const handleUpdateOption = ({ sectionId, questionId, optionIndex, value }) => {
  store.updateOption(sectionId, questionId, optionIndex, value)
}
const handleDeleteOption = ({ sectionId, questionId, optionIndex }) => {
  store.deleteOption(sectionId, questionId, optionIndex)
}
const handleSelectQuestion = (id) => {
  if (!store.selectedQuestionId) return
  store.selectedQuestionId.value = id
}
const handlePublish = async () => {
  try {
    await publishToBackend()
    showPublishModal.value = true
  } catch (err) {
    alert(err.response?.data?.detail || 'Erreur lors de la publication du formulaire.')
  }
}
</script>

<style scoped>
.form-builder-view {
  min-height: 100vh;
  background: #f3e8ff;
}

.form-builder-main {
  display: flex;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  gap: 24px;
}

.form-builder-center {
  flex: 1;
  min-width: 0;
}

.questions-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 3px solid #7c3aed;
}

.questions-label {
  font-size: 13px;
  font-weight: 700;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.questions-count {
  font-size: 12px;
  color: #7c3aed;
  font-weight: 600;
}

.meta-editor {
  border: 1px solid #7c3aed !important;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.empty-state {
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed #e9ecef;
}

@media (max-width: 1200px) {
  .form-builder-main {
    padding-right: 80px;
  }
}

@media (max-width: 768px) {
  .form-builder-main {
    padding: 16px;
  }
}
</style>
