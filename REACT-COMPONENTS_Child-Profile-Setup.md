# REACT COMPONENTS: Child Profile Setup Wizard

## ÜBERSICHT
Production-ready React/TypeScript Components für das Child Profile Onboarding nach User-Anmeldung.

## GENERIERT VON
- **AI Tool:** Google AI Studio (Gemini 3 Flash Preview)
- **Datum:** 31. Dezember 2025
- **Tokens:** 5.545
- **Link:** https://aistudio.google.com/prompts/1YaY2fuNihQninNflY1aogkdLCYJ6BnR8

## KOMPONENTEN-STRUKTUR

### 1. ChildProfileSetup.tsx (Haupt-Container)
**Funktionen:**
- Multi-Step Wizard mit Progress Bar (Step 1-3)
- Firebase Auth Integration (auth.currentUser)
- React Hook Form State Management
- Conditional Redirect zu `/dashboard` nach Completion
- Framer Motion Animationen

**Route:** `/onboarding/child-profile`

### 2. Step1_ChildInfo.tsx
**Inputs:**
- Kindername (string, required)
- Alter (number, 3-12 Jahre, required)

**Validierung:**
- Name min. 2 Zeichen
- Alter zwischen 3-12 Jahren
- Error Messages bei falscher Eingabe

### 3. Step2_CoreValues.tsx
**Features:**
- Responsive Grid (1 Spalte mobil, 4-5 Spalten Desktop)
- 25 auswählbare Value-Karten
- **Max 2 Selections** (enforced)
- Visual States: Default, Selected, Disabled
- Dark Mode optimiert
- Framer Motion Hover & Click Effects

**25 Core Values:**
1. Mut
2. Freundschaft
3. Ehrlichkeit
4. Kreativität
5. Respekt
6. Verantwortung
7. Neugier
8. Hilfsbereitschaft
9. Geduld
10. Optimismus
11. Teamwork
12. Durchhaltevermögen
13. Mitgefühl
14. Toleranz
15. Selbstvertrauen
16. Dankbarkeit
17. Fairness
18. Humor
19. Achtsamkeit
20. Großzügigkeit
21. Entschlossenheit
22. Einfühlungsvermögen
23. Umweltbewusstsein
24. Lernfreude
25. Unabhängigkeit

### 4. Step3_FamilyMembers.tsx
**Features:**
- Plus-Button zum Hinzufügen neuer Mitglieder
- useFieldArray für dynamisches Array-Management
- Edit/Delete Funktionen pro Mitglied

**Felder pro Familienmitglied:**
- Relationship (Dropdown): Vater, Mutter, Bruder, Schwester, Onkel, Tante, Opa, Oma, Cousin, Cousine
- Name (Input)
- Gemeinsame Erlebnisse (Textarea)

## TYPESCRIPT INTERFACES

```typescript
interface ChildProfile {
  childName: string;
  age: number;
  coreValues: string[]; // Max 2 Werte
  familyMembers: FamilyMember[];
}

interface FamilyMember {
  id: string;
  relationship: 'vater' | 'mutter' | 'bruder' | 'schwester' | 'onkel' | 'tante' | 'opa' | 'oma' | 'cousin' | 'cousine';
  name: string;
  sharedMemories: string;
}
```

## FIREBASE FIRESTORE INTEGRATION

**Collection:** `children`

**Dokument-Struktur:**
```javascript
{
  childName: string,
  age: number,
  coreValues: string[],
  familyMembers: FamilyMember[],
  parentId: auth.currentUser.uid,
  createdAt: serverTimestamp()
}
```

**Save Funktion:**
```typescript
const onSubmit = async (data: ChildProfile) => {
  if (!auth.currentUser) return;
  
  try {
    await addDoc(collection(db, 'children'), {
      ...data,
      parentId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });
    navigate('/dashboard');
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Fehler beim Speichern des Profils.");
  }
};
```

## TECH STACK

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS (Dark Mode)
- **Animations:** Framer Motion
- **Forms:** React Hook Form
- **Database:** Firebase Firestore
- **Icons:** Lucide React
- **Routing:** React Router

## UI/UX FEATURES

### Design Principles:
- **Mobile-First:** Responsive Grids (1-5 Spalten)
- **Dark Mode:** Alle Tailwind-Klassen mit `dark:` Varianten
- **Accessibility:** ARIA Labels, Keyboard Navigation
- **Loading States:** Submitting-Feedback während Save
- **Error Handling:** User-friendly Error Messages

### Animationen:
- **Framer Motion:** Smooth Step Transitions
- **Hover Effects:** Scale & Color Changes auf Value Cards
- **Click Feedback:** Instant Visual Response

## DEPLOYMENT STATUS

- ✅ **Architektur dokumentiert:** ARCHITECTURE-FIX_Child-Profile-Setup.md
- ✅ **NotebookLM Mindmap:** Erstellt mit 4 Quellen
- ✅ **AI Studio Code:** Generiert (5.545 tokens)
- ⚪ **GitHub Implementierung:** Bereit zum Committen
- ⚪ **Firebase Setup:** Collection `children` muss aktiviert werden
- ⚪ **Route Protection:** Auth Guard implementieren
- ⚪ **Vercel Deploy:** Auto-Deploy nach Commit

## NÄCHSTE SCHRITTE

1. **Code Integration:**
   - Erstelle `/src/components/onboarding/` Verzeichnis
   - Implementiere alle 4 React Components
   - Update `App.tsx` mit neuer Route

2. **Firebase Configuration:**
   - Firestore Rules für `children` Collection
   - Security: Nur parentId kann eigene Kinder lesen/schreiben

3. **Auth Guard:**
   ```typescript
   // Nur angemeldete User dürfen auf /onboarding zugreifen
   <PrivateRoute path="/onboarding/child-profile" component={ChildProfileSetup} />
   ```

4. **Dashboard Integration:**
   - Check ob Child Profile existiert
   - Falls NEIN: Redirect zu `/onboarding/child-profile`
   - Falls JA: Dashboard anzeigen

5. **Success Toast:**
   - Integration von `react-hot-toast`
   - Success Message nach Profile Save

## VOLLSTÄNDIGER CODE

Der komplette, produktionsreife Code mit allen 4 Komponenten ist verfügbar unter:
🔗 **Google AI Studio:** https://aistudio.google.com/prompts/1YaY2fuNihQninNflY1aogkdLCYJ6BnR8

---

**Erstellt am:** 31. Dezember 2025, 00:00 CET  
**Workflow:** NotebookLM → AI Studio → GitHub → Vercel  
**Status:** ✅ Ready for Implementation
