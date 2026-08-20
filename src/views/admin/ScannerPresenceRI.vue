<template>
  <div class="app-layout">
    <Sidebar :active-view="'presences-ri'" @logout="handleLogout" />

    <div class="main-content">
      <!-- Topbar Header -->
      <header class="topbar d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-link text-secondary p-0 back-button" @click="handleBack">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h1 class="h4 fw-bold text-dark-blue mb-0">SCANNER DE PRÉSENCE RI</h1>
            <span class="text-muted fs-7">Pointage des présences par Webcam & QR Code unique</span>
          </div>
        </div>

        <div class="d-flex align-items-center gap-3">
          <div v-if="campagnes.length > 0" class="campaign-select-wrapper">
            <label class="form-label fs-8 text-muted mb-0 fw-bold">Campagne :</label>
            <select
              v-model="selectedCampagneId"
              class="form-select form-select-sm fw-bold border-primary-subtle"
              @change="onCampagneChange"
            >
              <option v-for="c in campagnes" :key="c.id" :value="c.id">
                {{ c.title }}
              </option>
            </select>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container-fluid p-4">
        <!-- Campaign / RI Summary Banner -->
        <div v-if="currentCampagne || currentReunion" class="card border-0 shadow-sm rounded-4 mb-4 bg-light-gradient">
          <div class="card-body p-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span class="badge bg-primary px-3 py-2 rounded-pill me-2">
                <i class="fa-regular fa-calendar-check me-1"></i> RI Active
              </span>
              <strong class="text-dark-blue fs-5">
                {{ currentReunion?.titre || currentCampagne?.title || 'Réunion d\'Information' }}
              </strong>
            </div>
            <div class="d-flex gap-4 text-muted fs-7">
              <span v-if="currentReunion?.date || currentCampagne?.begin_date">
                <i class="fa-regular fa-calendar me-1"></i> Date : {{ formatDate(currentReunion?.date || currentCampagne?.begin_date) }}
              </span>
              <span v-if="currentReunion?.lieu">
                <i class="fa-solid fa-location-dot me-1"></i> Lieu : {{ currentReunion.lieu }}
              </span>
            </div>
          </div>
        </div>

        <!-- Statistics Counters -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="card stat-card border-0 shadow-sm rounded-4 text-center p-3">
              <div class="stat-icon bg-primary-subtle text-primary mx-auto mb-2">
                <i class="fa-solid fa-users fs-4"></i>
              </div>
              <div class="stat-value text-dark-blue">{{ stats.total || 0 }}</div>
              <div class="stat-label text-muted">Total Convoqués</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card stat-card border-0 shadow-sm rounded-4 text-center p-3 border-start border-success border-4">
              <div class="stat-icon bg-success-subtle text-success mx-auto mb-2">
                <i class="fa-solid fa-user-check fs-4"></i>
              </div>
              <div class="stat-value text-success">{{ stats.present || 0 }}</div>
              <div class="stat-label text-muted">Présents</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card stat-card border-0 shadow-sm rounded-4 text-center p-3 border-start border-warning border-4">
              <div class="stat-icon bg-warning-subtle text-warning-emphasis mx-auto mb-2">
                <i class="fa-solid fa-user-clock fs-4"></i>
              </div>
              <div class="stat-value text-warning">{{ stats.absent || 0 }}</div>
              <div class="stat-label text-muted">Absents / En attente</div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Left Column: Webcam Scanner -->
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                <h5 class="fw-bold text-dark-blue mb-0">
                  <i class="fa-solid fa-camera me-2 text-primary"></i> SCANNER LE QR CODE
                </h5>

                <div class="d-flex gap-2">
                  <button
                    v-if="scannerRunning"
                    class="btn btn-outline-secondary btn-sm rounded-pill"
                    @click="stopScanner"
                  >
                    <i class="fa-solid fa-stop me-1"></i> Arrêter
                  </button>
                  <button
                    v-else
                    class="btn btn-primary btn-sm rounded-pill"
                    @click="startScanner"
                  >
                    <i class="fa-solid fa-play me-1"></i> Démarrer la webcam
                  </button>
                </div>
              </div>

              <div class="card-body p-4 text-center">
                <!-- Camera Viewport -->
                <div class="scanner-viewport-wrapper position-relative mx-auto rounded-4 overflow-hidden mb-3">
                  <div id="qr-reader" class="scanner-reader"></div>

                  <!-- Scanner Targeting Overlay & Laser -->
                  <div v-if="scannerRunning" class="scanner-overlay-grid">
                    <div class="scanner-laser"></div>
                  </div>

                  <!-- Placeholder when scanner is inactive -->
                  <div v-if="!scannerRunning" class="scanner-placeholder d-flex flex-column align-items-center justify-content-center">
                    <i class="fa-solid fa-qrcode fs-1 text-muted mb-3 opacity-50"></i>
                    <p class="text-muted fw-semibold mb-2">Webcam actuellement arrêtée</p>
                    <button class="btn btn-pink rounded-pill px-4 py-2 fw-bold" @click="startScanner">
                      <i class="fa-solid fa-camera me-2"></i> Activer la webcam
                    </button>
                  </div>
                </div>

                <p class="text-muted fs-7 mb-3">
                  <i class="fa-solid fa-circle-info me-1 text-primary"></i>
                  Présentez le QR code de la convocation devant la webcam de votre ordinateur.
                </p>

                <!-- Feedback Display Banner (Success / Already Present / Error) -->
                <transition name="fade">
                  <div v-if="scanFeedback" class="scan-feedback-banner rounded-4 p-3 mb-3 text-start shadow-sm" :class="feedbackClass">
                    <div class="d-flex align-items-start gap-3">
                      <div class="feedback-icon-box">
                        <i :class="feedbackIcon" class="fs-2"></i>
                      </div>
                      <div class="flex-grow-1">
                        <div class="fw-black fs-5">{{ scanFeedback.title }}</div>
                        <div class="fs-7 mt-1">{{ scanFeedback.message }}</div>

                        <!-- Détails Candidat formatés si succès ou déjà présent -->
                        <div v-if="scanFeedback.candidate" class="mt-2 pt-2 border-top border-opacity-25 d-flex flex-wrap gap-3 fs-7">
                          <div>
                            <strong>Nom :</strong> {{ scanFeedback.candidate.nom }}
                          </div>
                          <div>
                            <strong>Prénom :</strong> {{ scanFeedback.candidate.prenom }}
                          </div>
                          <div v-if="scanFeedback.creneau">
                            <strong>Groupe :</strong> {{ scanFeedback.creneau.nom || 'Standard' }}
                            <span v-if="scanFeedback.creneau.heure_debut" class="text-muted">
                              ({{ scanFeedback.creneau.heure_debut }} - {{ scanFeedback.creneau.heure_fin }})
                            </span>
                          </div>
                          <div>
                            <strong>Statut :</strong>
                            <span class="badge bg-success ms-1">PRÉSENT(E)</span>
                          </div>
                          <div v-if="scanFeedback.time">
                            <strong>Heure d'arrivée :</strong> {{ scanFeedback.time }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>

                <!-- Saisie Manuelle du Token (Fallback) -->
                <div class="manual-entry-box p-3 bg-light rounded-3 text-start border">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label fs-8 text-muted fw-bold mb-0">Saisie manuelle du token QR :</label>
                  </div>
                  <div class="input-group">
                    <input
                      v-model="manualToken"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="Coller le token UUID (ex: 8f72c9c4-...)"
                      @keyup.enter="handleManualSubmit"
                    />
                    <button
                      class="btn btn-outline-primary btn-sm px-3 fw-bold"
                      :disabled="!manualToken || processing"
                      @click="handleManualSubmit"
                    >
                      <span v-if="processing" class="spinner-border spinner-border-sm me-1"></span>
                      Valider
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Last Scan & History -->
          <div class="col-lg-5">
            <!-- Last Scan Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-0 pt-4 px-4 pb-2">
                <h6 class="fw-bold text-dark-blue mb-0">
                  <i class="fa-solid fa-clock-rotate-left me-2 text-primary"></i> DERNIER POINTAGE
                </h6>
              </div>
              <div class="card-body p-4">
                <div v-if="lastScannedCandidate" class="last-scan-item p-3 rounded-4 bg-success-subtle border border-success-subtle">
                  <div class="d-flex align-items-center gap-3">
                    <div class="avatar-circle bg-success text-white fw-bold">
                      {{ (lastScannedCandidate.prenom?.[0] || '') + (lastScannedCandidate.nom?.[0] || '') }}
                    </div>
                    <div>
                      <div class="fw-bold text-success-emphasis fs-6">
                        ✓ {{ lastScannedCandidate.prenom }} {{ lastScannedCandidate.nom }}
                      </div>
                      <div class="text-muted fs-7">
                        <span v-if="lastScannedCandidate.creneau" class="badge bg-white text-dark me-1">
                          {{ typeof lastScannedCandidate.creneau === 'object' ? lastScannedCandidate.creneau.nom : lastScannedCandidate.creneau }}
                        </span>
                        Validé à {{ formatTime(lastScannedCandidate.presence_at || lastScannedCandidate.date_presence) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-3 text-muted fs-7">
                  Aucun candidat scanné lors de cette session.
                </div>
              </div>
            </div>

            <!-- History List -->
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                <h6 class="fw-bold text-dark-blue mb-0">
                  <i class="fa-solid fa-list-check me-2 text-primary"></i> HISTORIQUE DES PRÉSENTS ({{ stats.historique?.length || 0 }})
                </h6>
                <button
                  class="btn btn-link text-primary p-0 fs-8 text-decoration-none"
                  @click="refreshStats"
                >
                  <i class="fa-solid fa-arrows-rotate me-1"></i> Actualiser
                </button>
              </div>

              <div class="card-body p-3">
                <div v-if="stats.historique?.length" class="history-list d-flex flex-column gap-2">
                  <div
                    v-for="item in stats.historique"
                    :key="item.id"
                    class="history-item d-flex justify-content-between align-items-center p-2 px-3 rounded-3 bg-light"
                  >
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa-solid fa-circle-check text-success fs-6"></i>
                      <div>
                        <div class="fw-bold text-dark-blue fs-7">{{ item.prenom }} {{ item.nom }}</div>
                        <div class="text-muted fs-8">
                          {{ item.email }}
                          <span v-if="item.creneau" class="badge bg-secondary-subtle text-secondary ms-1">
                            {{ typeof item.creneau === 'object' ? item.creneau.nom : item.creneau }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-success-subtle text-success fs-8">
                        {{ formatTime(item.date_presence || item.presence_at) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-4 text-muted fs-7">
                  <i class="fa-regular fa-clipboard fs-2 mb-2 d-block opacity-50"></i>
                  Aucun candidat présent pour le moment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'
import Sidebar from '@/components/Sidebar.vue'
import { getCampagnes } from '@/api/endpoints/campagnes'
import {
  getReunionInformation,
  getReunionStats,
  scanReunionPresence,
} from '@/api/endpoints/reunionInformation'

const route = useRoute()
const router = useRouter()

const campagnes = ref([])
const selectedCampagneId = ref(null)
const currentReunion = ref(null)
const stats = ref({
  total: 0,
  present: 0,
  absent: 0,
  creneaux: [],
  historique: [],
})

const scannerRunning = ref(false)
const processing = ref(false)
const manualToken = ref('')
const scanFeedback = ref(null)
const lastScannedCandidate = ref(null)

let html5QrCode = null
let scanCooldown = false

const currentCampagne = computed(() => {
  return campagnes.value.find((c) => c.id === selectedCampagneId.value)
})

const feedbackClass = computed(() => {
  if (!scanFeedback.value) return ''
  if (scanFeedback.value.type === 'success')
    return 'bg-success-subtle text-success-emphasis border border-success'
  if (scanFeedback.value.type === 'warning')
    return 'bg-warning-subtle text-warning-emphasis border border-warning'
  return 'bg-danger-subtle text-danger-emphasis border border-danger'
})

const feedbackIcon = computed(() => {
  if (!scanFeedback.value) return ''
  if (scanFeedback.value.type === 'success') return 'fa-solid fa-circle-check text-success'
  if (scanFeedback.value.type === 'warning') return 'fa-solid fa-triangle-exclamation text-warning'
  return 'fa-solid fa-circle-xmark text-danger'
})

const handleLogout = () => {
  window.location.href = '/login'
}

const handleBack = () => {
  if (selectedCampagneId.value) {
    router.push(`/campagnes/${selectedCampagneId.value}`)
  } else {
    router.push('/campagnes')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatTime = (timeStr) => {
  if (!timeStr) return '--:--'
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) {
    return String(timeStr).substring(0, 5)
  }
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const playBeep = (isSuccess) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = isSuccess ? 800 : 300
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  } catch (e) {}
}

const refreshStats = async () => {
  if (!currentReunion.value?.id) return
  try {
    const { data } = await getReunionStats(currentReunion.value.id)
    stats.value = data
  } catch (err) {
    console.error('Erreur actualisation stats:', err)
  }
}

const loadReunionForCampagne = async (campagneId) => {
  try {
    const { data } = await getReunionInformation(campagneId)
    currentReunion.value = data
    if (data?.id) {
      await refreshStats()
    }
  } catch (err) {
    currentReunion.value = null
  }
}

const onCampagneChange = async () => {
  if (selectedCampagneId.value) {
    await loadReunionForCampagne(selectedCampagneId.value)
  }
}

// Démarrer la webcam
const startScanner = async () => {
  try {
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode('qr-reader')
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    }

    await html5QrCode.start(
      { facingMode: 'environment' },
      config,
      onScanSuccess,
      onScanFailure
    )

    scannerRunning.value = true
  } catch (err) {
    console.error('Erreur ouverture webcam:', err)
    scanFeedback.value = {
      type: 'danger',
      title: 'Accès caméra refusé',
      message: 'Veuillez autoriser l’accès à la webcam dans votre navigateur ou utiliser la saisie manuelle.',
    }
  }
}

// Arrêter la webcam
const stopScanner = async () => {
  if (html5QrCode && scannerRunning.value) {
    try {
      await html5QrCode.stop()
      scannerRunning.value = false
    } catch (err) {
      console.error('Erreur arrêt scanner:', err)
    }
  }
}

// Callback de détection réussie
const onScanSuccess = async (decodedText) => {
  if (scanCooldown || processing.value) return
  scanCooldown = true

  await processToken(decodedText)

  // Délai de 2 secondes avant d'autoriser le scan du candidat suivant
  setTimeout(() => {
    scanCooldown = false
  }, 2000)
}

const onScanFailure = () => {
  // Détection en cours
}

// Traitement du Token
const processToken = async (tokenStr) => {
  if (!tokenStr) return
  if (!currentReunion.value?.id) {
    scanFeedback.value = {
      type: 'danger',
      title: 'Erreur de configuration',
      message: 'Aucune réunion d\'information active n\'est sélectionnée.',
    }
    return
  }

  processing.value = true
  try {
    const { data } = await scanReunionPresence(currentReunion.value.id, {
      token: String(tokenStr).trim(),
    })

    if (data.success) {
      if (data.already_present) {
        playBeep(false)
        scanFeedback.value = {
          type: 'warning',
          title: '✓ Déjà présent',
          message: 'Ce candidat a déjà été marqué présent pour cette réunion.',
          candidate: data.candidate,
          creneau: data.creneau,
          time: formatTime(data.presence_at),
        }
      } else {
        playBeep(true)
        scanFeedback.value = {
          type: 'success',
          title: '✓ Présence enregistrée',
          message: `Présence validée avec succès pour ${data.candidate?.prenom} ${data.candidate?.nom}.`,
          candidate: data.candidate,
          creneau: data.creneau,
          time: formatTime(data.presence_at),
        }
        lastScannedCandidate.value = {
          ...data.candidate,
          creneau: data.creneau,
          presence_at: data.presence_at,
        }
        await refreshStats()
      }
    } else {
      playBeep(false)
      scanFeedback.value = {
        type: 'danger',
        title: '❌ Scan refusé',
        message: data.message || 'QR code invalide ou inconnu.',
      }
    }
  } catch (err) {
    playBeep(false)
    const errData = err.response?.data
    scanFeedback.value = {
      type: 'danger',
      title: '❌ Erreur de scan',
      message: errData?.message || errData?.detail || 'QR code invalide ou non autorisé.',
    }
  } finally {
    processing.value = false
  }
}

const handleManualSubmit = async () => {
  if (!manualToken.value) return
  const token = manualToken.value.trim()
  manualToken.value = ''
  await processToken(token)
}

onMounted(async () => {
  try {
    const { data } = await getCampagnes()
    campagnes.value = data

    const routeReunionId = route.params.reunionId ? Number(route.params.reunionId) : null
    const routeCampagneId = route.params.campagneId ? Number(route.params.campagneId) : null

    if (routeReunionId) {
      // Trouver la réunion correspondante
      try {
        const { data: rData } = await getReunionStats(routeReunionId)
        stats.value = rData
      } catch (e) {}
      // Charger les détails de la réunion
      currentReunion.value = { id: routeReunionId }
    }

    if (routeCampagneId) {
      selectedCampagneId.value = routeCampagneId
      await loadReunionForCampagne(routeCampagneId)
    } else if (data.length > 0) {
      selectedCampagneId.value = data[0].id
      await loadReunionForCampagne(data[0].id)
    }
  } catch (err) {
    console.error('Erreur chargement campagnes:', err)
  }

  // Démarrer la webcam
  await startScanner()
})

onBeforeUnmount(async () => {
  await stopScanner()
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  background-color: #f8fafc;
  font-family: 'Nunito Sans', sans-serif;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.topbar {
  height: 72px;
  padding: 0 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.back-button {
  font-size: 18px;
}

.bg-light-gradient {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  border: 1px solid #dcfce7;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
}

.scanner-viewport-wrapper {
  max-width: 420px;
  height: 320px;
  background: #000;
  border: 3px solid #00313c;
}

.scanner-reader {
  width: 100%;
  height: 100%;
}

.scanner-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1e293b;
  color: #fff;
  z-index: 10;
}

.scanner-overlay-grid {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border: 2px dashed rgba(255, 255, 255, 0.7);
  pointer-events: none;
  border-radius: 12px;
  z-index: 5;
}

.scanner-laser {
  width: 100%;
  height: 2px;
  background: #ef4444;
  box-shadow: 0 0 10px #ef4444;
  position: absolute;
  animation: laserScan 2s infinite alternate ease-in-out;
}

@keyframes laserScan {
  0% { top: 0; }
  100% { top: 100%; }
}

.avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.history-list {
  max-height: 380px;
  overflow-y: auto;
}

.fs-7 { font-size: 0.875rem; }
.fs-8 { font-size: 0.75rem; }

.btn-pink {
  background-color: #d20c4f;
  color: #ffffff;
  border: none;
}
.btn-pink:hover {
  background-color: #b00a42;
  color: #ffffff;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
