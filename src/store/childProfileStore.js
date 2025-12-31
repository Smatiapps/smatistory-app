import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChildProfileStore = create(
  persist(
    (set, get) => ({
      // State
      profile: {
        name: '',
        age: null,
        gender: '',
        favoriteColor: '',
        coreValues: [],
        familyMembers: []
      },
      currentStep: 1,
      isSubmitting: false,
      error: null,

      // Basic Data Actions
      setBasicData: (name, age, gender, favoriteColor) => {
        set((state) => ({
          profile: {
            ...state.profile,
            name,
            age,
            gender,
            favoriteColor
          }
        }));
      },

      // Core Values Actions (Max 2)
      addCoreValue: (value) => {
        const { profile } = get();
        if (profile.coreValues.length >= 2) {
          set({ error: 'Maximal 2 Werte können ausgewählt werden' });
          return false;
        }
        set((state) => ({
          profile: {
            ...state.profile,
            coreValues: [...state.profile.coreValues, value]
          },
          error: null
        }));
        return true;
      },

      removeCoreValue: (value) => {
        set((state) => ({
          profile: {
            ...state.profile,
            coreValues: state.profile.coreValues.filter((v) => v !== value)
          },
          error: null
        }));
      },

      toggleCoreValue: (value) => {
        const { profile } = get();
        if (profile.coreValues.includes(value)) {
          get().removeCoreValue(value);
        } else {
          return get().addCoreValue(value);
        }
        return true;
      },

      // Family Members Actions
      addFamilyMember: (member) => {
        const { profile } = get();
        if (profile.familyMembers.length >= 10) {
          set({ error: 'Maximal 10 Familienmitglieder können hinzugefügt werden' });
          return;
        }
        const newMember = {
          id: Date.now().toString(),
          ...member
        };
        set((state) => ({
          profile: {
            ...state.profile,
            familyMembers: [...state.profile.familyMembers, newMember]
          },
          error: null
        }));
      },

      removeFamilyMember: (id) => {
        set((state) => ({
          profile: {
            ...state.profile,
            familyMembers: state.profile.familyMembers.filter((m) => m.id !== id)
          }
        }));
      },

      updateFamilyMember: (id, updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            familyMembers: state.profile.familyMembers.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            )
          }
        }));
      },

      // Step Navigation
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Validation
      validateStep: (step) => {
        const { profile } = get();
        
        switch (step) {
          case 1:
            if (!profile.name || profile.name.length < 2) {
              set({ error: 'Name muss mindestens 2 Zeichen lang sein' });
              return false;
            }
            if (!profile.age) {
              set({ error: 'Bitte wähle das Alter aus' });
              return false;
            }
            if (!profile.gender) {
              set({ error: 'Bitte wähle das Geschlecht aus' });
              return false;
            }
            break;
          
          case 2:
            if (profile.coreValues.length === 0) {
              set({ error: 'Bitte wähle mindestens einen Wert aus' });
              return false;
            }
            break;
          
          case 3:
            // Family members are optional, no validation needed
            break;
        }
        
        set({ error: null });
        return true;
      },

      // Submit Profile (Firebase integration will be added later)
      submitProfile: async () => {
        set({ isSubmitting: true, error: null });
        
        try {
          const { profile } = get();
          
          // Validate all steps
          if (!get().validateStep(1) || !get().validateStep(2)) {
            set({ isSubmitting: false });
            return false;
          }
          
          // TODO: Add Firebase integration here
          console.log('Submitting profile:', profile);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isSubmitting: false });
          return true;
        } catch (error) {
          set({ 
            isSubmitting: false, 
            error: 'Fehler beim Speichern. Bitte versuche es erneut.' 
          });
          return false;
        }
      },

      // Reset
      resetProfile: () => {
        set({
          profile: {
            name: '',
            age: null,
            gender: '',
            favoriteColor: '',
            coreValues: [],
            familyMembers: []
          },
          currentStep: 1,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'child-profile-storage',
      partialize: (state) => ({ 
        profile: state.profile,
        currentStep: state.currentStep
      })
    }
  )
);

export default useChildProfileStore;
