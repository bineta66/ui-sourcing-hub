<script setup>
import { ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'useQuestions'])

const selectedRole = ref('dev-web')
const selectedLevel = ref('mid')
const isGenerating = ref(false)
const copiedIndex = ref(null)

const generatedQuestions = ref([
  {
    id: 1,
    category: 'Architecture Vue 3',
    question: 'Quelle est la différence fondamentale entre ref() et reactive() dans Vue 3, et quand privilégier l’un par rapport à l’autre ?',
    criteria: 'Capacité à expliquer le boxing des primitives, la réactivité profonde des proxies et la déstructuration.'
  },
  {
    id: 2,
    category: 'State Management (Pinia)',
    question: 'Comment gérez-vous le cache et l’invalidation des requêtes asynchrones dans les actions d’un store Pinia ?',
    criteria: 'Maîtrise des actions asynchrones, gestion des états loading/error et découplage avec l’API.'
  },
  {
    id: 3,
    category: 'Optimisation & Performance',
    question: 'Quelles techniques mettez-vous en place pour éviter les re-rendus inutiles et optimiser le First Contentful Paint d’une SPA ?',
    criteria: 'Connaissance du lazy loading de routes/composants, computed cachés et virtual scrolling.'
  },
  {
    id: 4,
    category: 'Soft Skills & Collaboration',
    question: 'Comment menez-vous une revue de code (PR) constructive face à un collègue dont le code ne respecte pas les conventions ?',
    criteria: 'Empathie, communication bienveillante, rigueur technique et pédagogie.'
  }
])

const handleGenerate = () => {
  isGenerating.value = true
  setTimeout(() => {
    isGenerating.value = false
    if (selectedRole.value === 'ux-ui') {
      generatedQuestions.value = [
        {
          id: 1,
          category: 'Design Systems',
          question: 'Comment structurez-vous vos tokens de design (couleurs, typographies, espacements) pour assurer une synchronisation fluide avec les développeurs ?',
          criteria: 'Connaissance des tokens multi-niveaux, compatibilité Figma / CSS variables.'
        },
        {
          id: 2,
          category: 'Recherche Utilisateur',
          question: 'Décrivez votre démarche pour valider une hypothèse UX lorsque les données quantitatives sont insuffisantes.',
          criteria: 'Tests d’utilisabilité qualitatifs, protocoles de test guérilla et benchmark structuré.'
        },
        {
          id: 3,
          category: 'Accessibilité (a11y)',
          question: 'Quels critères WCAG 2.1 considérez-vous comme prioritaires dès la phase de wireframing ?',
          criteria: 'Contraste des couleurs, hiérarchie de focus, accessibilité cognitive et alternatives textuelles.'
        }
      ]
    } else if (selectedRole.value === 'growth') {
      generatedQuestions.value = [
        {
          id: 1,
          category: 'Modélisation CAC / LTV',
          question: 'Comment calculez-vous la valeur vie client (LTV) sur un modèle SaaS B2B et quel ratio LTV/CAC jugez-vous sain ?',
          criteria: 'Formule LTV exacte avec churn mensuel, analyse de payback period sous 12 mois.'
        },
        {
          id: 2,
          category: 'Expérimentation & Growth',
          question: 'Présentez la méthodologie d’un framework d’idéation ICE/PIE pour prioriser les tests d’acquisition.',
          criteria: 'Rigueur analytique, définition d’hypothèses testables et tracking multi-touch.'
        }
      ]
    }
  }, 600)
}

const copyQuestion = (q, idx) => {
  navigator.clipboard?.writeText(`${q.category} : ${q.question}\nCritères d'évaluation : ${q.criteria}`)
  copiedIndex.value = idx
  setTimeout(() => {
    copiedIndex.value = null
  }, 2000)
}
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="d-flex align-items-center gap-3">
          <div class="ai-header-icon">
            <i class="bi bi-robot"></i>
          </div>
          <div>
            <h3 class="modal-title">Générateur d'entretiens IA</h3>
            <span class="modal-subtitle">Génération assistée de grilles & questions d'évaluation</span>
          </div>
        </div>
        <button class="btn-close-custom" @click="emit('close')" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Configuration bar -->
        <div class="config-grid">
          <div class="config-item">
            <label class="config-label">Filière / Métier</label>
            <select v-model="selectedRole" class="config-select" @change="handleGenerate">
              <option value="dev-web">Développement Web & Mobile</option>
              <option value="ux-ui">Design UX/UI & Product</option>
              <option value="growth">Stratégie Commerciale & Growth</option>
            </select>
          </div>
          <div class="config-item">
            <label class="config-label">Séniorité ciblée</label>
            <select v-model="selectedLevel" class="config-select" @change="handleGenerate">
              <option value="junior">Junior (0 - 2 ans)</option>
              <option value="mid">Intermédiaire (2 - 5 ans)</option>
              <option value="senior">Senior / Lead (5+ ans)</option>
            </select>
          </div>
          <div class="config-item d-flex align-items-end">
            <button class="btn-regenerate" :disabled="isGenerating" @click="handleGenerate">
              <i class="bi bi-arrow-repeat" :class="{ 'spin-icon': isGenerating }"></i>
              <span>Régénérer</span>
            </button>
          </div>
        </div>

        <!-- Questions List -->
        <div class="questions-section">
          <div class="section-header">
            <h5 class="section-title">Questions suggérées par l'IA ({{ generatedQuestions.length }})</h5>
            <span class="ai-badge">
              <i class="bi bi-stars"></i> IA calibrée
            </span>
          </div>

          <div class="questions-list">
            <div v-for="(q, idx) in generatedQuestions" :key="q.id" class="question-card">
              <div class="q-header">
                <span class="q-tag">{{ q.category }}</span>
                <button class="btn-copy-q" @click="copyQuestion(q, idx)">
                  <i :class="copiedIndex === idx ? 'bi bi-check2 text-success' : 'bi bi-copy'"></i>
                  <span>{{ copiedIndex === idx ? 'Copié !' : 'Copier' }}</span>
                </button>
              </div>
              <p class="q-text">{{ q.question }}</p>
              <div class="q-criteria">
                <i class="bi bi-lightbulb"></i>
                <span><strong>Critère d'évaluation :</strong> {{ q.criteria }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn-secondary-custom" @click="emit('close')">Fermer</button>
        <button class="btn-primary-custom" @click="emit('useQuestions', generatedQuestions); emit('close')">
          <i class="bi bi-check2-circle"></i> Utiliser dans un nouvel entretien
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-card {
  background: #FFFFFF;
  border-radius: 18px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
}

.modal-header {
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F1F5F9;
  background: linear-gradient(135deg, #00313C 0%, #064E5F 100%);
  color: #FFFFFF;
}

.ai-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: #38BDF8;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.75rem;
  color: #CBD5E1;
}

.btn-close-custom {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #FFFFFF;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-close-custom:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem 1.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  background: #F8FAFC;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.config-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
}

.config-select {
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  font-size: 0.85rem;
  color: #0F172A;
  outline: none;
}

.btn-regenerate {
  background: #00313C;
  color: #FFFFFF;
  border: none;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.15s;
  height: 38px;
}

.btn-regenerate:hover {
  background: #084958;
}

.spin-icon {
  animation: spin 0.8s linear infinite;
}

.questions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.ai-badge {
  background: #EFF6FF;
  color: #0284C7;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.question-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.question-card:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.q-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.q-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: #D20C4F;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.btn-copy-q {
  background: transparent;
  border: none;
  color: #64748B;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
}

.btn-copy-q:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.q-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  line-height: 1.45;
}

.q-criteria {
  font-size: 0.8rem;
  color: #64748B;
  background: #F8FAFC;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}

.q-criteria i {
  color: #EAB308;
  margin-top: 2px;
}

.modal-footer {
  padding: 1rem 1.75rem;
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary-custom {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #475569;
  padding: 0.55rem 1.15rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary-custom:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-primary-custom {
  background: #D20C4F;
  border: none;
  color: #FFFFFF;
  padding: 0.55rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s;
}

.btn-primary-custom:hover {
  background: #B80A45;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
