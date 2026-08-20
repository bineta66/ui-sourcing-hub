<template>
  <div class="paire-questions mb-4">
    <div class="row g-3">
      <div class="col-md-6" v-for="q in questions" :key="q.id">
        <div class="question-card">
          <p class="question-texte">{{ q.texte }}</p>
          <textarea
            class="form-control"
            rows="3"
            placeholder="Réponse / observation..."
            :value="modelValue[q.id] ?? ''"
            @input="updateReponse(q.id, $event.target.value)"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  questions: { type: Array, required: true }, // max 2
  modelValue: { type: Object, required: true }, // { [questionId]: commentaire }
})
const emit = defineEmits(['update:modelValue'])

function updateReponse(questionId, value) {
  emit('update:modelValue', { ...props.modelValue, [questionId]: value })
}
</script>

<style scoped>
.question-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  height: 100%;
}
.question-texte {
  font-weight: 600;
  margin-bottom: 0.75rem;
}
</style>