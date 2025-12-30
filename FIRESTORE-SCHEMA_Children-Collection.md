# Firebase Firestore Schema: Children Collection

## Priority #1 Database Setup - NotebookLM Recommendation

This document defines the Firestore database structure for the SmatiStory children profile system, addressing the critical architecture correction where child profiles must be created BEFORE story generation can occur.

---

## Collection Path

```
users/{userId}/profiles/{profileId}
```

**Structure Type:** Sub-Collection within user document

---

## Schema Definition

### Profile Document Fields

```typescript
interface ChildProfile {
  // Basic Information
  childName: string;           // Required, 1-50 characters
  age: number;                 // Required, 2-12 years
  profileId: string;           // Auto-generated document ID
  userId: string;              // Reference to parent user
  
  // Core Values Selection
  coreValues: string[];        // Array of exactly 2 values from 25 options
  
  // Family Members Structure
  familyMembers: FamilyMember[]; // Array of family member objects
  
  // Metadata
  createdAt: Timestamp;        // Auto-generated
  updatedAt: Timestamp;        // Auto-updated
  isActive: boolean;           // Default: true
}

interface FamilyMember {
  relationship: string;        // enum: 'vater', 'mutter', 'bruder', 'schwester', 'onkel', 'tante', 'opa', 'oma', etc.
  name: string;                // 1-50 characters
  sharedMemories: string;      // Optional, up to 500 characters
  addedAt: Timestamp;          // Auto-generated
}
```

---

## Core Values (25 Options)

User must select exactly 2 values from this list:

```typescript
const CORE_VALUES = [
  'Mut',
  'Freundschaft',
  'Ehrlichkeit',
  'Respekt',
  'Hilfsbereitschaft',
  'Kreativität',
  'Neugier',
  'Geduld',
  'Teamarbeit',
  'Selbstvertrauen',
  'Verantwortung',
  'Mitgefühl',
  'Dankbarkeit',
  'Optimismus',
  'Durchhaltevermögen',
  'Toleranz',
  'Fairness',
  'Bescheidenheit',
  'Großzügigkeit',
  'Achtsamkeit',
  'Loyalität',
  'Weisheit',
  'Humor',
  'Entschlossenheit',
  'Empathie'
];
```

---

## Validation Rules

### Firestore Security Rules

```javascript
match /users/{userId}/profiles/{profileId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null 
                && request.auth.uid == userId
                && request.resource.data.childName is string
                && request.resource.data.childName.size() >= 1
                && request.resource.data.childName.size() <= 50
                && request.resource.data.age is int
                && request.resource.data.age >= 2
                && request.resource.data.age <= 12
                && request.resource.data.coreValues is list
                && request.resource.data.coreValues.size() == 2;
  allow update: if request.auth != null && request.auth.uid == userId;
  allow delete: if request.auth != null && request.auth.uid == userId;
}
```

---

## Example Document

```json
{
  "profileId": "profile_abc123",
  "userId": "user_xyz789",
  "childName": "Emma",
  "age": 7,
  "coreValues": ["Mut", "Freundschaft"],
  "familyMembers": [
    {
      "relationship": "mutter",
      "name": "Sarah",
      "sharedMemories": "Wir backen jeden Sonntag zusammen Kuchen",
      "addedAt": "2025-01-15T10:30:00Z"
    },
    {
      "relationship": "bruder",
      "name": "Max",
      "sharedMemories": "Wir spielen oft Fußball im Park",
      "addedAt": "2025-01-15T10:32:00Z"
    }
  ],
  "createdAt": "2025-01-15T10:25:00Z",
  "updatedAt": "2025-01-15T10:32:00Z",
  "isActive": true
}
```

---

## Implementation Steps

### 1. Firebase Console Setup

1. Navigate to Firebase Console → Firestore Database
2. Create collection: `users`
3. Create test user document with auto-ID
4. Create sub-collection: `profiles`
5. Add test profile document with schema above

### 2. Firestore Indexes

Create composite index for efficient queries:

```
Collection: users/{userId}/profiles
Fields: 
  - userId (Ascending)
  - isActive (Ascending)
  - createdAt (Descending)
```

### 3. React Integration

See `REACT-COMPONENTS_Child-Profile-Setup.md` for component implementation.

---

## Architecture Correction Context

**Critical Fix:** The original architecture incorrectly placed coreValues selection in the story type flow (morning/goodnight/interactive). 

**Correct Flow:**
1. User signs up/logs in
2. **Child Profile Setup** (this schema)
   - Enter child name
   - Enter age
   - Select 2 core values from 25
   - Add family members (+ button)
     - Select relationship
     - Enter name
     - Add shared memories (optional)
3. Story Generation Dashboard (uses profile data)
   - Morning motivational stories
   - Goodnight stories
   - Interactive stories

---

## Story Coordination

The child profile data coordinates all story generation:

- **coreValues**: Used in story prompts to embed selected values
- **familyMembers**: Characters included in personalized stories
- **childName**: Protagonist name in all stories
- **age**: Determines language complexity and story themes

---

## Next Steps

1. ✅ Document Firestore schema (this file)
2. ⏳ Create Firestore collection in Firebase Console
3. ⏳ Implement React components with Firebase SDK
4. ⏳ Add authentication guards
5. ⏳ Test profile creation flow
6. ⏳ Connect to story generation engine

---

**Document Created:** 2025-01-15  
**Source:** NotebookLM Priority Recommendation  
**Related:** ARCHITECTURE-FIX_Child-Profile-Setup.md, REACT-COMPONENTS_Child-Profile-Setup.md
