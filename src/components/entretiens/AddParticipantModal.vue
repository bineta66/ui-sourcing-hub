<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String, // 'recruiter' | 'candidate'
    default: 'recruiter'
  }
})

const emit = defineEmits(['close', 'add'])

const name = ref('')
const role = ref('')
const email = ref('')
const department = ref('Dev Web / IA')

const handleAdd = () => {
  if (!name.value.trim()) return

  const parts = name.value.trim().split(' ')
  const prenom = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0]
  const nom = parts.length > 1 ? parts[parts.length - 1] : 'Candidat'

  emit('add', {
    type: props.type,
    name: name.value.trim(),
    prenom: prenom,
    nom: nom,
    role: role.value.trim() || (props.type === 'recruiter' ? 'Membre du Jury' : 'Candidat'),
    department: department.value,
    email: email.value.trim() || `${prenom.toLowerCase()}.${nom.toLowerCase()}@simplon.co`
  })

  name.value = ''
  role.value = ''
  email.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div class="d-flex align-items-center gap-3">
          <div class="header-icon" :class="type === 'recruiter' ? 'icon-rec' : 'icon-cand'">
            <i :class="type === 'recruiter' ? 'bi bi-person-badge' : 'bi bi-person-check'"></i>
          </div>
          <div>
            <h3 class="modal-title">
              {{ type === 'recruiter' ? 'Ajouter un recruteur' : 'Ajouter un candidat' }}
            </h3>
            <span class="modal-subtitle">
              {{ type === 'recruiter' ? 'Assigner un membre du jury ou examinateur' : 'Inscrire un candidat à la session' }}
            </span>
          </div>
        </div>
        <button class="btn-close-custom" @click="emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleAdd" class="modal-body">
        <div class="form-group">
          <label class="form-label">Nom complet *</label>
          <input
            v-model="name"
            type="text"
            class="form-control-custom"
            :placeholder="type === 'recruiter' ? 'Ex: Sarah Jenkins' : 'Ex: Karim Ndiaye'"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Titre / Rôle *</label>
          <input
            v-model="role"
            type="text"
            class="form-control-custom"
            :placeholder="type === 'recruiter' ? 'Ex: Lead Developer, HR Specialist' : 'Ex: Développeur Frontend, UI Designer'"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Adresse E-mail</label>
          <input
            v-model="email"
            type="email"
            class="form-control-custom"
            placeholder="nom.prenom@entreprise.com"
          />
        </div>

        <div v-if="type === 'candidate'" class="form-group">
          <label class="form-label">Programme / Filière</label>
          <select v-model="department" class="form-control-custom">
            <option value="Dev Web / IA">Dev Web / IA</option>
            <option value="Design Studio">Design Studio</option>
            <option value="Management">Management</option>
            <option value="Growth & Ops">Growth & Ops</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary-custom" @click="emit('close')">Annuler</button>
          <button type="submit" class="btn-primary-custom">
            <i class="bi bi-plus-lg"></i> Ajouter
          </button>
        </div>
      </form>
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
  max-width: 480px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F1F5F9;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.icon-rec {
  background: #EFF6FF;
  color: #0284C7;
}

.icon-cand {
  background: #FDF2F8;
  color: #D20C4F;
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.75rem;
  color: #64748B;
}

.btn-close-custom {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #64748B;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-close-custom:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
}

.form-control-custom {
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  border: 1px solid #CBD5E1;
  font-size: 0.875rem;
  color: #0F172A;
  outline: none;
  transition: border-color 0.2s;
}

.form-control-custom:focus {
  border-color: #00313C;
}

.modal-footer {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary-custom {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #475569;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary-custom:hover {
  background: #F1F5F9;
}

.btn-primary-custom {
  background: #D20C4F;
  border: none;
  color: #FFFFFF;
  padding: 0.5rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-primary-custom:hover {
  background: #B80A45;
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
