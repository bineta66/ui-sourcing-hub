<template>
  <div class="d-flex">
    <Sidebar />
    <div class="main-content flex-grow-1">
      <TopBar :breadcrumb="'Entretien motivation'" />
      <div class="p-4">
        <button class="btn btn-sm btn-outline-secondary mb-3" @click="router.back()">
          <i class="fa-solid fa-chevron-left"></i> Retour
        </button>
        <h3 class="mb-4">Entretien motivation</h3>

        <div v-if="loading">Chargement...</div>
        <template v-else>
          <PaireQuestions
            v-for="(paire, index) in paires"
            :key="index"
            :questions="paire"
            v-model="reponses"
          />

          <div class="mt-4">
            <label class="form-label fw-bold">Commentaire général</label>
            <textarea class="form-control mb-4" rows="4" v-model="commentaireGeneral"></textarea>

            <button class="btn btn-primary" @click="terminerEntretien">
              Terminer l'entretien
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getQuestionsByType, soumettreEntretien } from '@/services/entretiensService'
import { useEntretiensStore } from '@/stores/entretienJure'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import PaireQuestions from '@/components/entrtien_jure/PaireQuestions.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const questions = ref([])
const reponses = ref({})
const commentaireGeneral = ref('')

const paires = computed(() => {
  const result = []
  for (let i = 0; i < questions.value.length; i += 2) {
    result.push(questions.value.slice(i, i + 2))
  }
  return result
})

onMounted(async () => {
  questions.value = await getQuestionsByType('motivation')
  loading.value = false
})

async function terminerEntretien() {
  const store = useEntretiensStore()
  await soumettreEntretien({
    candidatId: route.params.candidatId,
    entretienId: route.params.entretienId,
    type: 'motivation',
    reponses: Object.entries(reponses.value).map(([questionId, commentaire]) => ({
      questionId: Number(questionId),
      commentaire,
    })),
    commentaireGeneral: commentaireGeneral.value,
  })
  store.markEntretienComplete(route.params.entretienId, route.params.candidatId, 'motivation')
  router.push(`/jury/entretiens/${route.params.entretienId}/candidats`)
}
</script>