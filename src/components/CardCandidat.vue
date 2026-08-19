<script setup>
defineProps({
  candidat: { type: Object, required: true }
})

const emit = defineEmits(['voir-plus'])
</script>

<template>
  <tr class="candidat-row">
    <td>
      <div class="d-flex flex-column">
        <span class="fw-semibold">{{ candidat.prenom }} {{ candidat.nom }}</span>
        <span class="text-muted small">{{ candidat.email }}</span>
      </div>
    </td>
    <td>{{ candidat.sexe }}</td>
    <td>{{ candidat.telephone }}</td>
    <td>{{ candidat.campagne }}</td>
    <td class="text-end">
      <button type="button" class="btn action-icon-btn" title="Voir plus" @click="emit('voir-plus', candidat)">
        <i class="fa-solid fa-eye"></i>
      </button>
    </td>
  </tr>
</template>

<style scoped>
.candidat-row td {
  vertical-align: middle;
  font-family: 'Nunito Sans', sans-serif;
  color: #00313C;
  border-color: #F1F5F9;
}
.action-icon-btn {
  width: 34px; height: 34px; border-radius: 8px;
  background-color: #F1F5F9; color: #00313C;
  display: inline-flex; align-items: center; justify-content: center;
  border: none; transition: all 0.2s ease;
}
.action-icon-btn:hover { background-color: #D20C4F; color: #FFFFFF; }
</style>