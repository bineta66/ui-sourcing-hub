<template>
  <div class="modal-backdrop" v-if="open" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Modifier l'utilisateur</h3>
        <button class="modal-close" @click="close">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nom complet</label>
            <input class="form-control" v-model="form.name" placeholder="ex. David Richardson" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-control" v-model="form.email" placeholder="d.richardson@recruit.ai" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rôle</label>
            <select class="form-control" v-model="form.role">
              <option>admin</option>
              <option>jury</option>
              <option>candidate</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Statut</label>
            <select class="form-control" v-model="form.status">
              <option>ACTIVE</option>
              <option>INACTIVE</option>
              <option>EN ATTENTE</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Poste</label>
            <input class="form-control" v-model="form.subtitle" placeholder="Head of Sourcing" />
          </div>
          <div class="form-group">
            <label class="form-label">Département</label>
            <input class="form-control" v-model="form.department" placeholder="Sourcing" />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="close">Annuler</button>
        <button class="btn-save" @click="save">Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  open: Boolean,
  user: Object
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  email: '',
  role: 'ADMINISTRATOR',
  status: 'ACTIVE',
  subtitle: '',
  department: ''
})

watch(() => props.user, (val) => {
  if (val) {
    form.name = val.name || ''
    form.email = val.email || ''
    form.role = val.role || 'ADMINISTRATOR'
    form.status = val.status || 'ACTIVE'
    form.subtitle = val.subtitle || ''
    form.department = val.department || ''
  }
}, { immediate: true })

const close = () => emit('close')

const save = () => emit('save', { ...form })
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.modal {
  background: #FFFFFF;
  border-radius: 16px;
  width: 100%;
  max-width: 720px;
  max-height: calc(100vh - 48px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #EEF2F5;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #00313C;
  margin: 0;
  letter-spacing: -0.02em;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #EEF2F5;
  background: #FFFFFF;
  color: #64748B;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.modal-close:hover {
  background: #F8FAFC;
  color: #00313C;
  border-color: #CBD5E1;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.form-control {
  height: 42px;
  padding: 0 12px;
  border: 1px solid #EEF2F5;
  border-radius: 8px;
  background: #F8FAFC;
  font-size: 13px;
  color: #0F172A;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.form-control:focus {
  border-color: #00313C;
  background: #FFFFFF;
}

select.form-control {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #EEF2F5;
  background: #FAFBFC;
}

.btn-cancel {
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid #EEF2F5;
  background: #FFFFFF;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.btn-cancel:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.btn-save {
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  border: none;
  background: #D20C4F;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.btn-save:hover {
  background: #b01a3f;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
