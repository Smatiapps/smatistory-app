# Step 4: Geschichten-Generierung (Story Generation Hub)

## Übersicht
Dieser Screen ermöglicht es dem Nutzer, zwischen 4 verschiedenen Geschichtentypen zu wählen und die notwendigen Parameter einzugeben, um eine personalisierte Geschichte mit Gemini Pro zu generieren.

## 1. Screen-Name & Route
- **Name:** `StoryGeneration`
- **Route:** `/stories/create`
- **Protected:** Ja (Auth required, Premium Check optional)

## 2. UI-Komponenten

### PageHeader
- **Titel:** "Welche Geschichte möchtest du heute erleben?"
- **Subtitel:** "Wähle einen Geschichtentyp und lass deiner Fantasie freien Lauf."

### StoryTypeSelector
Interaktive 2x2 Grid mit 4 Karten:

1. **Morgendliche Motivationsgeschichte**
   - Icon: Sonne/Stern
   - Beschreibung: "Starte den Tag mit einer inspirierenden Geschichte"
   - Farbe: Warmes Orange/Gelb
   - Eingabefelder:
     - Kindername (Auto-Fill aus Profil)
     - Alter (Auto-Fill)
     - Werte (Multi-Select, max 2 aus 25)
     - Tages-Thema (Text Input, z.B. "erster Schultag")

2. **Gute-Nacht-Geschichte**
   - Icon: Mond/Sterne
   - Beschreibung: "Sanfte Geschichten für einen friedlichen Schlaf"
   - Farbe: Beruhigendes Blau/Violett
   - Eingabefelder:
     - Kindername (Auto-Fill)
     - Alter (Auto-Fill)
     - Werte (Multi-Select)
     - Familienmitglied (Dropdown: Vater, Mutter, etc.)
     - Gemeinsames Erlebnis (Text Input)

3. **Interaktive Geschichte**
   - Icon: Joystick/Kompass
   - Beschreibung: "Entscheide selbst, wie die Geschichte weitergeht"
   - Farbe: Lebendiges Grün/Türkis
   - Eingabefelder:
     - Kindername (Auto-Fill)
     - Alter (Auto-Fill)
     - Genre (Dropdown: Abenteuer, Fantasy, Sci-Fi, etc.)
     - Hauptcharakter-Wunsch (Text Input)
     - Anzahl Entscheidungspunkte (Slider: 3-7)

4. **Familien-Erinnerungsgeschichte**
   - Icon: Herz/Fotoalbum
   - Beschreibung: "Verwandle echte Erlebnisse in magische Geschichten"
   - Farbe: Warmes Rosa/Gold
   - Eingabefelder:
     - Kindername (Auto-Fill)
     - Beteiligte Familienmitglieder (Multi-Select)
     - Erlebnis-Beschreibung (Text Area, 200 Zeichen)
     - Gefühls-Fokus (Dropdown: Freude, Mut, Zusammenhalt, etc.)
     - Fantasie-Level (Slider: Realistisch → Magisch)

### DynamicForm
Basierend auf der Auswahl des Geschichtentyps wird ein dynamisches Formular mit den entsprechenden Feldern angezeigt.

### GenerateButton
- Text: "Geschichte erstellen"
- Loading State: "Deine Geschichte wird geschrieben..."
- Animiert mit Framer Motion

## 3. Datenfluss & State

### Zustand (Zustand Store)
```typescript
interface StoryGenerationState {
  selectedType: 'morning' | 'bedtime' | 'interactive' | 'family' | null;
  formData: {
    childName: string;
    age: number;
    values: string[];
    // Type-specific fields
    [key: string]: any;
  };
  isGenerating: boolean;
  generatedStory: Story | null;
}
```

### Actions
- `selectStoryType(type)` - Geschichtentyp auswählen
- `updateFormData(field, value)` - Formularfeld aktualisieren
- `generateStory()` - API-Aufruf an Gemini Pro
- `saveStory()` - Geschichte in Firestore speichern

## 4. API Integration

### Gemini Pro Prompt Strategy

#### Morgendliche Motivationsgeschichte
```typescript
const prompt = `
Du bist ein erfahrener Kinderbuch-Autor. Erstelle eine 5-minütige motivierende Geschichte für ein ${age}-jähriges Kind namens ${childName}.

Thema des Tages: ${dayTheme}
Kernwerte: ${values.join(', ')}

Die Geschichte soll:
- Positiv und ermutigend sein
- Das Kind auf den Tag vorbereiten
- Die Kernwerte subtil vermitteln
- Altersgerecht und leicht verständlich sein
- Mit einer Aktivitäts-Idee für den Tag enden

Format: JSON mit { title, content, moral, dayActivity }
`;
```

#### Gute-Nacht-Geschichte
```typescript
const prompt = `
Erstelle eine beruhigende Gute-Nacht-Geschichte für ${childName} (${age} Jahre).

Familienmitglied in der Geschichte: ${familyMember}
Gemeinsames Erlebnis: ${sharedExperience}
Werte: ${values.join(', ')}

Die Geschichte soll:
- Sanft und beruhigend sein
- Das gemeinsame Erlebnis in eine friedliche Erzählung einbetten
- Sicherheit und Geborgenheit vermitteln
- Mit einer ruhigen Schlaf-Affirmation enden

Ton: Warm, leise, traumhaft
Format: JSON mit { title, content, lullaby }
`;
```

#### Interaktive Geschichte
```typescript
const prompt = `
Erstelle eine interaktive Geschichte mit Entscheidungspunkten für ${childName} (${age} Jahre).

Genre: ${genre}
Hauptcharakter-Wunsch: ${characterWish}
Anzahl Entscheidungen: ${decisionPoints}

Struktur:
- Jede Entscheidung führt zu unterschiedlichen Story-Zweigen
- Alle Wege führen zu positiven Lernmomenten
- Werte: ${values.join(', ')}

Format: JSON mit { title, scenes: [{ text, choices: [{ text, nextScene }] }] }
`;
```

#### Familien-Erinnerungsgeschichte
```typescript
const prompt = `
Verwandle folgendes echtes Erlebnis in eine magische Geschichte:

Beteiligte: ${familyMembers.join(', ')}
Erlebnis: ${experienceDescription}
Gefühls-Fokus: ${emotionFocus}
Fantasie-Level: ${fantasyLevel}/10

Die Geschichte soll:
- Das echte Erlebnis als Kern bewahren
- Je nach Fantasie-Level magische Elemente hinzufügen
- Die beteiligten Familienmitglieder als Charaktere einbinden
- Den emotionalen Fokus hervorheben

Format: JSON mit { title, content, familyMoment, photoPrompt }
`;
```

### API Call
```typescript
const generateStory = async (type: StoryType, formData: FormData) => {
  const response = await fetch('/api/stories/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      prompt: constructPrompt(type, formData),
      model: 'gemini-pro'
    })
  });
  
  return response.json();
};
```

## 5. Animationen

### Story Type Card Hover
```typescript
const cardVariants = {
  rest: { scale: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  hover: { 
    scale: 1.05, 
    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
    transition: { duration: 0.3 }
  }
};
```

### Generate Button
```typescript
const buttonVariants = {
  idle: { scale: 1 },
  loading: { 
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 1 }
  },
  success: { 
    scale: [1, 1.2, 1],
    backgroundColor: ['#4F46E5', '#10B981', '#4F46E5']
  }
};
```

## 6. Validierung

### Form Validation (react-hook-form)
```typescript
const schema = z.object({
  childName: z.string().min(2, 'Name zu kurz'),
  age: z.number().min(3).max(12),
  values: z.array(z.string()).min(1).max(2),
  // Type-specific validations
  dayTheme: z.string().optional(),
  experienceDescription: z.string().max(200).optional(),
});
```

## 7. Error Handling

- **API Fehler:** "Ups! Die Geschichte konnte nicht erstellt werden. Bitte versuche es erneut."
- **Validierungsfehler:** Inline-Feedback unter Formularfeldern
- **Netzwerk Timeout:** "Die Verbindung ist langsam. Bitte habe noch einen Moment Geduld..."

## 8. Success Flow

Nach erfolgreicher Generierung:
1. Smooth Transition zur Story-Vorschau
2. "Teilen"-Button (Familie einladen)
3. "Als Favorit speichern"-Button
4. "Neue Geschichte erstellen"-Button

## 9. Implementation Notes

- Alle Formulare nutzen `react-hook-form` für State Management
- Gemini Pro API-Aufrufe laufen über Backend-Route (`/api/stories/generate`)
- Generierte Geschichten werden in Firestore unter `users/{uid}/stories` gespeichert
- Auto-Fill-Felder ziehen Daten aus dem Child Profile (Zustand Store)
- Premium-Feature: Unbegrenzte Geschichten (Free: 5/Monat)

## 10. TypeScript Interfaces

```typescript
interface Story {
  id: string;
  type: StoryType;
  title: string;
  content: string;
  metadata: {
    childName: string;
    age: number;
    values: string[];
    createdAt: Timestamp;
  };
  // Type-specific fields
  [key: string]: any;
}

type StoryType = 'morning' | 'bedtime' | 'interactive' | 'family';

interface FormData {
  childName: string;
  age: number;
  values: string[];
  // Dynamic fields based on story type
  [key: string]: string | number | string[] | boolean;
}
```

---

**Next Steps:** Nach dieser Component folgt die Audio-Generation (Text-to-Speech) und Illustration-Generation (Imagen API).
