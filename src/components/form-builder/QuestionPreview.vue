<template>
  <div class="question-preview">
    <div v-if="question.type === 'text' || question.type === 'email' || question.type === 'tel' || question.type === 'number'">
      <input
        :type="question.type"
        class="form-control form-control-sm"
        :placeholder="'Votre ' + (question.type === 'text' ? 'réponse' : question.type)"
        disabled
      />
    </div>

    <div v-else-if="question.type === 'textarea'">
      <textarea
        class="form-control form-control-sm"
        rows="3"
        placeholder="Votre réponse"
        disabled
      ></textarea>
    </div>

    <div v-else-if="question.type === 'date'">
      <input type="date" class="form-control form-control-sm" disabled />
    </div>

    <div v-else-if="question.type === 'radio'">
      <div v-for="(option, index) in question.options" :key="index" class="form-check">
        <input
          :id="'preview-radio-' + question.id + '-' + index"
          class="form-check-input"
          type="radio"
          :name="'preview-radio-' + question.id"
          disabled
        />
        <label :for="'preview-radio-' + question.id + '-' + index" class="form-check-label">
          {{ option }}
        </label>
      </div>
    </div>

    <div v-else-if="question.type === 'checkbox'">
      <div v-for="(option, index) in question.options" :key="index" class="form-check">
        <input
          :id="'preview-check-' + question.id + '-' + index"
          class="form-check-input"
          type="checkbox"
          disabled
        />
        <label :for="'preview-check-' + question.id + '-' + index" class="form-check-label">
          {{ option }}
        </label>
      </div>
    </div>

    <div v-else-if="question.type === 'select'">
      <select class="form-select form-select-sm" disabled>
        <option value="">Sélectionner...</option>
        <option v-for="(option, index) in question.options" :key="index" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: Object
})
</script>

<style scoped>
.question-preview {
  margin-top: 6px;
}

.form-check {
  margin-bottom: 4px;
}
</style>
