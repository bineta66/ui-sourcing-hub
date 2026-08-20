# Documentation des fonctionnalités — Sourcing HUB

## Vue d'ensemble

**Sourcing HUB** est une plateforme de gestion de sourcing et de candidature. Elle permet à des administrateurs et jurys de créer et gérer des campagnes de formation/professionnelles, d'évaluer des candidats via des formulaires personnalisés, de planifier des réunions d'information et des entretiens. Les candidats peuvent postuler, consulter leurs entretiens, passer des tests et suivre leur profil.

---

## Architecture

- **Frontend** : Vue.js 3 (Composition API) + Vite + Pinia + Vue Router + Bootstrap 5
- **Backend (inféré)** : Django REST Framework avec JWT Authentication
- **Base URL API** : configurable via `VITE_API_BASE_URL` (défaut : `http://127.0.0.1:8000/`)

---

## Rôles utilisateur

| Rôle | Description |
|------|-------------|
| `ADMIN` | Gestion complète des utilisateurs, campagnes, formulaires, critères, référentiels |
| `JURY` | Consultation et gestion des campagnes, accès aux détails |
| `CANDIDAT` | Espace candidat : entretiens, tests, candidature, profil |

---

## Fonctionnalités Frontend

### 1. Authentification et gestion de compte

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Connexion | Authentification JWT avec email/mot de passe, option "se souvenir de moi" | `/login` |
| Inscription / Activation | Activation de compte via token d'invitation | `/inscription`, `/activate` |
| Mot de passe oublié | Demande de réinitialisation par email | `/mot-de-passe-oublie` |
| Confirmation mot de passe | Réinitialisation via lien avec uid/token | `/reset-password/:uid/:token` |
| Déconnexion | Révocation du refresh token et nettoyage de la session | — |
| Rafraîchissement automatique | Refresh token via intercepteur Axios | — |

**Store utilisé** : `src/stores/auth.js`

**Intercepteur Axios** (`src/api/axios.js`) :
- Injection automatique du `Bearer` token dans les headers
- Gestion du refresh token avec queue des requêtes en attente
- Redirection vers `/login` si le refresh échoue

---

### 2. Gestion des utilisateurs (Admin)

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Liste des utilisateurs | Tableau avec recherche, filtres par rôle/statut, vue grille/liste | `/gestion-utilisateurs` |
| Création / Invitation | Invitation d'un nouvel utilisateur par email avec rôle | `/creation-utilisateur` |
| Détail utilisateur | Consultation du profil et de l'activité récente | `/detail-utilisateur/:id` |
| Modification utilisateur | Édition des informations utilisateur | `/creation-utilisateur?id=:id` |

**API endpoints** :
- `POST /api/accounts/users/` — Inviter un utilisateur
- `POST /api/accounts/activate/` — Activer un compte
- `PATCH /api/accounts/profile/complete/` — Compléter le profil

**Store utilisé** : `src/stores/auth.js`

---

### 3. Gestion des campagnes (Admin / Jury)

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Dashboard campagnes | Liste, filtres (programme, statut), statistiques, actions | `/campagnes` |
| Création campagne | Formulaire complet : titre, description, dates, statut, référentiel, critères | `/campagnes/create` |
| Modification campagne | Pré-remplissage du formulaire avec données existantes | `/campagnes/update/:id?` |
| Détail campagne | Vue détaillée : description, statut, paramètres, critères, réunion d'information | `/campagnes/detail/:id?` |
| Suppression campagne | Modal de confirmation avant suppression | — |

**Statuts possibles** : `brouillon`, `publiee`, `cloturee`

**API endpoints** (`src/api/endpoints/campagnes.js`) :
- `GET /api/campagnes/` — Liste des campagnes
- `GET /api/campagnes/:id/` — Détail d'une campagne
- `POST /api/campagnes/` — Créer une campagne
- `PATCH /api/campagnes/:id/` — Modifier une campagne
- `DELETE /api/campagnes/:id/` — Supprimer une campagne

**Stores utilisés** : `src/stores/campagnes.js`, `src/stores/criteres.js`, `src/stores/referentiels.js`

---

### 4. Form Builder (Admin)

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Création de formulaires | Éditeur visuel de formulaires de candidature | `/form-builder/:campaignId?` |
| Sections | Ajout, modification, suppression, déplacement, duplication de sections | — |
| Questions | Ajout, modification, suppression, déplacement, duplication de questions | — |
| Types de questions | `text`, `email`, `tel`, `number`, `date`, `time`, `textarea`, `radio`, `checkbox`, `select` | — |
| Options | Gestion des options pour les questions à choix multiples | — |
| Aperçu | Prévisualisation du formulaire en temps réel | — |
| Publication | Publication du formulaire et génération d'un lien public | — |
| Brouillon | Sauvegarde en mode brouillon | — |

**Formulaires par défaut** :
- Informations personnelles (Nom, Prénom, Date de naissance, Genre, Téléphone, Email, Adresse, Situation matrimoniale)
- Parcours académique (Niveau d'études, Dernier diplôme, Domaine, Établissement, Année, etc.)
- Compétences basiques en informatique (Niveau, OS, Logiciels, Word, Excel, Internet, Email, Outils collaboratifs)

**Store utilisé** : `src/stores/formBuilder.js`

**Composants** :
- `FormHeader.vue` — En-tête avec actions aperçu/publication
- `FormTitleCard.vue` — Carte titre/description cliquable
- `FormSection.vue` — Section de questions
- `FormQuestion.vue` — Question individuelle
- `QuestionEditor.vue` — Éditeur de question
- `QuestionOptions.vue` — Gestion des options
- `QuestionTypeSelector.vue` — Sélecteur de type
- `FormPreview.vue` — Aperçu du formulaire
- `FormToolbar.vue` — Barre d'outils

---

### 5. Candidature publique

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Formulaire public | Affichage et soumission du formulaire de candidature publié | `/candidature/:slug` |
| Validation | Champs requis, vérifications côté client | — |
| Soumission | Simulation d'envoi avec feedback visuel | — |

**Store utilisé** : `src/stores/formBuilder.js` (via `getPublishedFormBySlug`)

**API endpoints référentiels** (`src/api/endpoints/referentiels.js`) :
- `GET /api/referentiels/` — Liste des référentiels
- `POST /api/referentiels/` — Créer un référentiel

**API endpoints critères** (`src/api/endpoints/criteres.js`) :
- `GET /api/criteres/` — Liste des critères
- `POST /api/criteres/` — Créer un critère

---

### 6. Espace Candidat

#### 6.1 Entretiens

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Liste des entretiens | Vue des entretiens à venir et passés avec onglets | `/candidate/entretiens` |
| Détails entretien | Date, heure, durée, format, jury, lien de connexion | — |
| Convocation | Modal de convocation avec détails complets | — |
| Résumé | Progression circulaire des entretiens | — |
| Informations importantes | Consignes pour les candidats | — |

#### 6.2 Tests

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Liste des tests | Tests disponibles, soumis, restants avec statistiques | `/candidate/tests` |
| Soumission de test | Modal avec lien repository, site déployé, commentaire | — |
| Suivi de progression | Indicateur circulaire de progression | — |

#### 6.3 Candidature

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Suivi de candidature | Statut, date de candidature, prochain entretien | `/candidate/candidature` |
| Convocation | Accès aux convocations (technique, motivationnelle, globale) | — |
| Progression | Indicateur visuel des étapes validées | — |

#### 6.4 Profil

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Consultation profil | Informations personnelles, académiques, avatar | `/candidate/profil` |
| Modification profil | Modal d'édition avec upload d'avatar | — |

**Store utilisé** : `src/stores/auth.js` (pour l'authentification et le rôle)

**Composants** :
- `CandidateSidebar.vue` — Barre latérale de l'espace candidat

---

### 7. Réunion d'information

| Fonctionnalité | Description | Routes |
|----------------|-------------|--------|
| Planification RI | Création d'une réunion d'information (date, lieu, titre) | Intégré à `/campagnes/detail/:id?` |
| Modification RI | Modification des informations de la réunion | — |
| Gestion des créneaux | CRUD des créneaux horaires pour la réunion | — |
| Affichage | Vue de la réunion planifiée avec nombre de créneaux | — |

**API endpoints** (`src/api/endpoints/reunionInformation.js`) :
- `GET /api/campagnes/:campagneId/reunion-information/` — Récupérer la RI
- `POST /api/campagnes/:campagneId/reunion-information/` — Créer la RI
- `PATCH /api/campagnes/:campagneId/reunion-information/:reunionId/` — Modifier la RI
- `DELETE /api/campagnes/:campagneId/reunion-information/:reunionId/` — Supprimer la RI
- `GET /api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/` — Liste des créneaux
- `POST /api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/` — Créer un créneau
- `PATCH /api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/:creneauId/` — Modifier un créneau
- `DELETE /api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/:creneauId/` — Supprimer un créneau

**Composants** :
- `ReunionInformationCard.vue` — Carte d'affichage de la RI
- `ReunionInformationForm.vue` — Formulaire de création/modification de RI
- `CreneauxRI.vue` — Liste des créneaux
- `CreneauRIForm.vue` — Formulaire de création/modification de créneau

---

### 8. Navigation et Layout

| Composant | Description |
|-----------|-------------|
| `Sidebar.vue` | Barre latérale principale (Admin/Jury) avec navigation et déconnexion |
| `CandidateSidebar.vue` | Barre latérale de l'espace candidat |
| `DeleteCampagne.vue` | Modal de confirmation de suppression de campagne |
| `PublishModal.vue` | Modal de publication de formulaire |
| `ModalCreation.vue` | Modal générique de création (critère, référentiel) |
| `EditUserModal.vue` | Modal de modification d'utilisateur |

---

## Fonctionnalités Backend (inférées depuis les endpoints API)

### Authentification et comptes

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/accounts/login/` | POST | Connexion JWT (username + password) |
| `/api/accounts/logout/` | POST | Déconnexion avec révocation du refresh token |
| `/api/accounts/token/refresh/` | POST | Rafraîchissement du token d'accès |
| `/api/accounts/users/` | POST | Invitation d'un utilisateur (email + rôle) |
| `/api/accounts/activate/` | POST | Activation de compte via token (token + password + password_confirm) |
| `/api/accounts/profile/complete/` | PATCH | Complétion du profil (first_name, last_name, phone_number) |
| `/api/accounts/password-reset/` | POST | Demande de réinitialisation de mot de passe (email) |
| `/api/accounts/password-reset/confirm/:uid/:token/` | POST | Confirmation du nouveau mot de passe |

### Campagnes

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/campagnes/` | GET | Liste des campagnes |
| `/api/campagnes/` | POST | Création d'une campagne |
| `/api/campagnes/:id/` | GET | Détail d'une campagne |
| `/api/campagnes/:id/` | PATCH | Modification d'une campagne |
| `/api/campagnes/:id/` | DELETE | Suppression d'une campagne |

### Critères d'évaluation

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/criteres/` | GET | Liste des critères |
| `/api/criteres/` | POST | Création d'un critère (name + description) |

### Référentiels

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/referentiels/` | GET | Liste des référentiels |
| `/api/referentiels/` | POST | Création d'un référentiel (title + description) |

### Réunion d'information et créneaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/campagnes/:campagneId/reunion-information/` | GET | Récupérer la réunion d'information |
| `/api/campagnes/:campagneId/reunion-information/` | POST | Créer une réunion d'information |
| `/api/campagnes/:campagneId/reunion-information/:reunionId/` | PATCH | Modifier la réunion |
| `/api/campagnes/:campagneId/reunion-information/:reunionId/` | DELETE | Supprimer la réunion |
| `/api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/` | GET | Liste des créneaux |
| `/api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/` | POST | Créer un créneau |
| `/api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/:creneauId/` | PATCH | Modifier un créneau |
| `/api/campagnes/:campagneId/reunion-information/:reunionId/creneaux/:creneauId/` | DELETE | Supprimer un créneau |

---

## Structure du projet

```
src/
├── api/
│   ├── axios.js                    # Instance Axios avec intercepteurs JWT
│   └── endpoints/
│       ├── accounts.js             # Authentification et comptes
│       ├── campagnes.js            # Campagnes CRUD
│       ├── criteres.js             # Critères CRUD
│       ├── referentiels.js         # Référentiels CRUD
│       └── reunionInformation.js   # Réunion d'information et créneaux CRUD
├── assets/
├── components/
│   ├── form-builder/               # Composants du Form Builder
│   ├── reunion/                    # Composants de réunion d'information
│   ├── Sidebar.vue
│   ├── CandidateSidebar.vue
│   ├── DeleteCampagne.vue
│   ├── EditUserModal.vue
│   ├── ModalCreation.vue
│   └── PublishModal.vue
├── router/
│   └── index.js                    # Routes et guards
├── stores/
│   ├── auth.js                     # Store Pinia auth
│   ├── campagnes.js                # Store Pinia campagnes
│   ├── criteres.js                 # Store Pinia critères
│   ├── referentiels.js             # Store Pinia référentiels
│   └── formBuilder.js              # Store Pinia form builder
├── views/
│   ├── admin/
│   │   └── FormBuilderView.vue     # Vue Form Builder
│   ├── campagnes/
│   │   ├── CampagnesDashboard.vue  # Dashboard campagnes
│   │   ├── CreateCampagne.vue      # Création campagne
│   │   ├── UpdateCampagne.vue      # Modification campagne
│   │   └── DetailCampagne.vue      # Détail campagne
│   ├── candidate/
│   │   ├── CandidateEntretiens.vue # Espace candidat - Entretiens
│   │   ├── CandidateTests.vue      # Espace candidat - Tests
│   │   ├── CandidateCandidature.vue # Espace candidat - Candidature
│   │   └── Profile.vue             # Espace candidat - Profil
│   ├── Login.vue                   # Connexion
│   ├── Inscription.vue             # Activation de compte
│   ├── MotDePasseOublie.vue        # Mot de passe oublié
│   ├── ResetPasswordConfirm.vue    # Confirmation reset password
│   ├── GestionUtilisateurs.vue     # Liste utilisateurs
│   ├── CreationUtilisateur.vue     # Création/Édition utilisateur
│   ├── DetailUtilisateur.vue       # Détail utilisateur
│   └── Candidature.vue             # Formulaire de candidature public
└── main.js                         # Point d'entrée
```

---

## Technologies utilisées

| Catégorie | Outil |
|-----------|-------|
| Framework | Vue.js 3.5+ |
| Build | Vite 8.1+ |
| State Management | Pinia 4.0+ |
| Router | Vue Router 5.2+ |
| HTTP Client | Axios 1.19+ |
| UI Framework | Bootstrap 5.3+ |
| Icons | Bootstrap Icons 1.13+ |
| Fonts | Inter, Nunito Sans |

---

## Statut de développement

- **Frontend** : En développement actif
- **Backend** : API Django REST Framework (inférée depuis les endpoints — pas de code Python dans ce dépôt)
- Les données affichées dans certaines vues (GestionUtilisateurs, DetailUtilisateur, CandidateEntretiens, CandidateTests, CandidateCandidature, Profile) sont actuellement **simulées/mockées** en dur dans les composants.
