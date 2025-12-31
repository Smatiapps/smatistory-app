# COMPONENT-CODE Step6: Story-Bibliothek (MediaThek)

## Entwickler-Spezifikation: COMPONENT-CODE_Step6_Library

### 1. Screen Name & Route
- **Name**: `LibraryScreen`
- **Route**: `/library`
- **Parent Layout**: `DashboardLayout`

### 2. UI-Komponenten (Struktur)
Mobile-First Ansatz mit Raster-System (Grid) für Story-Karten:

- **LibraryHeader**:
  - Titel "Deine Bibliothek"
  - Suchfeld mit Lupen-Icon, Echtzeit-Filterung
  - Tab-Navigation: "Geschichten", "Hörbücher", "Videos", "Spiele"

- **FilterBar**:
  - Horizontal scrollbare Chips für Kategorien (Bedtime, Adventure, Learning, Fantasy)
  - Sortierung (Neueste, Älteste, Meist gelesen)

- **StoryGrid**:
  - Responsive: 1 Spalte (Mobile), 2 Spalten (Tablet), 3-4 Spalten (Desktop)
  - Lazy Loading / Pagination implementiert

- **StoryCard**:
  - Cover: KI-generiertes Bild
  - Typ-Badge: Icon/Text (Mond für Gute Nacht)
  - Fortschritt: Progress-Bar
  - Aktionen: Favoriten-Herz (Toggle)

- **EmptyState**:
  - Anzeige wenn keine Geschichten vorhanden
  - CTA "Erste Geschichte zaubern"

### 3. State-Management
```typescript
interface LibraryState {
  searchQuery: string;
  activeTab: 'stories' | 'audiobooks' | 'videos' | 'games';
  activeFilter: StoryType | 'all';
  sortBy: 'date_desc' | 'date_asc' | 'popular';
  stories: Story[];
  isLoading: boolean;
  isRefreshing: boolean;
}
```

### 4. API-Calls
- **Abrufen**: `GET /api/stories?page=1&limit=20&filter={activeFilter}&sort={sortBy}`
- **Favorisieren**: `POST /api/stories/{id}/favorite`
- **Löschen**: `DELETE /api/stories/{id}`

### 5. Features & UX
- **Pull-to-Refresh**: Mobile herunterziehen für Aktualisierung
- **Dark Mode**: Automatische Anpassung (Slate-900 Background, White Text)
- **Lazy Loading**: Bilder erst bei Viewport-Sichtbarkeit, Infinite Scroll
- **Responsive Design**: Mobile-first mit Breakpoints
- **Framer Motion**: Animationen für Karten und Übergänge

### 6. TypeScript Interfaces
